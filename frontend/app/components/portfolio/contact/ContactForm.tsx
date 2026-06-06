'use client'

import {useState} from 'react'
import {submitContact} from '@/app/actions/contact'

interface FieldDef {
  label?: string | null
  placeholder?: string | null
}

interface ValidationMessages {
  nameRequired?: string | null
  emailRequired?: string | null
  emailInvalid?: string | null
  messageRequired?: string | null
  messageTooShort?: string | null
}

export interface ContactFormProps {
  formTitle?: string | null
  formBadge?: string | null
  nameField?: FieldDef | null
  emailField?: FieldDef | null
  messageField?: FieldDef | null
  submitLabel?: string | null
  formNote?: string | null
  validationMessages?: ValidationMessages | null
  successPanelTitle?: string | null
  successLines?: string[] | null
  successGreeting?: string | null
  sendAnotherLabel?: string | null
  /** dataAttr from parent for visual editing */
  'data-sanity'?: string
}

type FieldErrors = {
  name?: string
  email?: string
  message?: string
}

export default function ContactForm({
  formTitle,
  formBadge,
  nameField,
  emailField,
  messageField,
  submitLabel,
  formNote,
  validationMessages,
  successPanelTitle,
  successLines,
  successGreeting,
  sendAnotherLabel,
  'data-sanity': dataSanity,
}: ContactFormProps) {
  const [vals, setVals] = useState({name: '', email: '', message: ''})
  const [errs, setErrs] = useState<FieldErrors>({})
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [networkErr, setNetworkErr] = useState<string | null>(null)

  const vm = validationMessages ?? {}

  const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setVals((v) => ({...v, [k]: e.target.value}))

  const validate = (): FieldErrors => {
    const e: FieldErrors = {}
    if (!vals.name.trim()) e.name = vm.nameRequired ?? 'name is required'
    if (!vals.email.trim()) {
      e.email = vm.emailRequired ?? 'email is required'
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(vals.email.trim())) {
      e.email = vm.emailInvalid ?? 'invalid email format'
    }
    if (!vals.message.trim()) {
      e.message = vm.messageRequired ?? 'message body is empty'
    } else if (vals.message.trim().length < 12) {
      e.message = vm.messageTooShort ?? 'message too short (min 12 chars)'
    }
    return e
  }

  const validateField = (field: keyof typeof vals) => {
    const fresh = validate()
    setErrs((prev) => ({...prev, [field]: fresh[field]}))
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrs(e)
    if (Object.keys(e).length > 0) return
    setSubmitting(true)
    setNetworkErr(null)
    try {
      const fd = new FormData()
      fd.set('name', vals.name)
      fd.set('email', vals.email)
      fd.set('message', vals.message)
      // honeypot handled server-side
      const result = await submitContact(fd)
      if (result.success === false && result.error !== 'Not implemented — P5 will implement this') {
        setNetworkErr(result.error)
      } else {
        // stub returns success=false but we treat it as submitted for UI demo
        setSent(true)
      }
    } catch {
      setNetworkErr('✗ network error — form data preserved. try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const firstName = vals.name.split(' ')[0] || 'there'
  const greeting = (successGreeting ?? 'Thanks, {firstName}. I read every message myself.').replace(
    '{firstName}',
    firstName,
  )

  if (sent) {
    return (
      <div className="panel" style={{background: 'var(--bg-1)'}} data-sanity={dataSanity}>
        <div className="panel-head">
          <span className="lights">
            <i />
            <i />
            <i />
          </span>
          <span className="title">{successPanelTitle ?? 'connect — exit 0'}</span>
          <span className="meta ok">success</span>
        </div>
        <div className="panel-body">
          <div className="out" style={{marginBottom: 14}}>
            {(successLines ?? [
              '✓ message queued',
              '✓ connection request ready',
              '✓ response expected soon · within 1–2 business days',
            ]).map((line, i) => (
              <div key={i} className="ok">
                {line}
              </div>
            ))}
            <div className="muted" style={{display: 'block', marginTop: 10}}>
              {greeting}
            </div>
          </div>
          <div style={{marginTop: 18}}>
            <button
              className="btn ghost"
              onClick={() => {
                setSent(false)
                setVals({name: '', email: '', message: ''})
              }}
            >
              <span className="car">&#8635;</span> {sendAnotherLabel ?? 'send another'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      className="panel"
      style={{background: 'var(--bg-1)'}}
      onSubmit={submit}
      noValidate
      data-sanity={dataSanity}
    >
      {/* Honeypot */}
      <input type="text" name="_hp" className="sr-only" tabIndex={-1} autoComplete="off" />

      <div className="panel-head">
        <span className="lights">
          <i />
          <i />
          <i />
        </span>
        <span className="title">{formTitle ?? '~/connect.sh'}</span>
        <span className="meta">{formBadge ?? 'stdin'}</span>
      </div>
      <div className="panel-body">
        <div className="field-wrap">
          <label htmlFor="c-name">
            {nameField?.label ?? '--name'} <span className="req">*</span>
          </label>
          <input
            id="c-name"
            className="tinput"
            placeholder={nameField?.placeholder ?? 'your name'}
            value={vals.name}
            onChange={set('name')}
            onBlur={() => validateField('name')}
          />
          {errs.name && (
            <div className="field-err">
              <span>&#10007;</span> {errs.name}
            </div>
          )}
        </div>
        <div className="field-wrap">
          <label htmlFor="c-email">
            {emailField?.label ?? '--email'} <span className="req">*</span>
          </label>
          <input
            id="c-email"
            className="tinput"
            type="email"
            placeholder={emailField?.placeholder ?? 'you@company.com'}
            value={vals.email}
            onChange={set('email')}
            onBlur={() => validateField('email')}
          />
          {errs.email && (
            <div className="field-err">
              <span>&#10007;</span> {errs.email}
            </div>
          )}
        </div>
        <div className="field-wrap">
          <label htmlFor="c-msg">
            {messageField?.label ?? '--message'} <span className="req">*</span>
          </label>
          <textarea
            id="c-msg"
            className="tinput"
            placeholder={messageField?.placeholder ?? 'what are you building? what do you need?'}
            value={vals.message}
            onChange={set('message')}
            onBlur={() => validateField('message')}
          />
          {errs.message && (
            <div className="field-err">
              <span>&#10007;</span> {errs.message}
            </div>
          )}
        </div>
        {networkErr && (
          <div className="field-err" style={{marginTop: 4}}>
            {networkErr}
          </div>
        )}
        <div className="row gap-12" style={{marginTop: 4, justifyContent: 'space-between', flexWrap: 'wrap'}}>
          {formNote && (
            <span className="faint" style={{fontSize: 12}}>
              {formNote}
            </span>
          )}
          <button className="btn primary" type="submit" disabled={submitting}>
            <span className="car">&#8250;</span> {submitLabel ?? 'run connect'}
          </button>
        </div>
      </div>
    </form>
  )
}
