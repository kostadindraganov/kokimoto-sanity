'use server'

import 'server-only'

import {headers} from 'next/headers'
import {Resend} from 'resend'
import {z} from 'zod'

import {writeClient} from '@/sanity/lib/write-client'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContactActionResult =
  | {success: true; firstName: string}
  | {success: false; error: string; fieldErrors?: Record<string, string[]>}

// ─── Zod schema ───────────────────────────────────────────────────────────────
// Mirrors template validation rules + contactPage.validationMessages keys

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().regex(/^[^@]+@[^@]+\.[^@]+$/),
  message: z.string().min(12),
  _hp: z.string(),
})

// ─── In-memory rate limiter ───────────────────────────────────────────────────
// 5 requests per 60 seconds per IP

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60_000

const rateLimitMap = new Map<string, {count: number; windowStart: number}>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, {count: 1, windowStart: now})
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

// ─── Server Action ────────────────────────────────────────────────────────────

export async function submitContact(formData: FormData): Promise<ContactActionResult> {
  // 1. Parse + validate
  const rawData = {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    message: formData.get('message') ?? '',
    _hp: formData.get('_hp') ?? '',
  }

  const parsed = contactSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: 'validation_error',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data

  // 2. Honeypot check — silent drop
  if (data._hp !== '') {
    return {success: true, firstName: data.name.split(' ')[0]}
  }

  // 3. Rate limit
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'

  if (!checkRateLimit(ip)) {
    return {success: false, error: 'rate_limited'}
  }

  // 4. Write contactSubmission to inbox dataset
  try {
    await writeClient.create({
      _type: 'contactSubmission',
      name: data.name,
      email: data.email,
      message: data.message,
      submittedAt: new Date().toISOString(),
      read: false,
    })
  } catch (err) {
    console.error('[contact] writeClient.create failed:', err)
    return {success: false, error: 'server_error'}
  }

  // 5. Send email via Resend — failure is non-fatal (doc already created)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'portfolio@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || '',
      subject: `[portfolio] new message from ${data.name}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    })
  } catch (err) {
    console.error('[contact] Resend email failed (doc was created):', err)
  }

  return {success: true, firstName: data.name.split(' ')[0]}
}
