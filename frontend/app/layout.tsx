import './globals.css'
import './portfolio.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import {Toaster} from 'sonner'
import {JetBrains_Mono, Space_Grotesk} from 'next/font/google'
import {draftMode} from 'next/headers'
import {defineQuery, stegaClean} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense, type ReactNode} from 'react'

import DraftModeToast from '@/app/components/DraftModeToast'
import ShellChrome from '@/app/components/portfolio/shell/ShellChrome'
import StatusBar from '@/app/components/portfolio/shell/StatusBar'
import type {PortfolioNavItem} from '@/app/components/portfolio/types'
import {handleError} from '@/app/client-utils'
import {
  getDynamicFetchOptions,
  sanityFetch,
  SanityLive,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {navigationQuery} from '@/sanity/lib/queries'
import type {NavigationQueryResult} from '@/sanity.types'

const jetbrainsMono = JetBrains_Mono({
  variable: '--mono',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

/* Shell chrome strings from the siteSettings singleton. Lives here because
   sanity/lib/queries.ts SETTINGS_QUERY doesn't project the shell fields
   (handle/availability/statusbar/location) — same colocated-query convention
   as app/components/portfolio/home/queries.ts. Coalesce defaults keep the
   chrome copy-identical to the template when a field is unset. */
const SHELL_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    "handle": coalesce(handle, "kostadin@portfolio"),
    "availabilityTitle": availability,
    "availabilityStatus": coalesce(availabilityStatus, true),
    email,
    github,
    linkedin,
    location,
    "branchLabel": coalesce(statusbar.branchLabel, "main"),
    "statusText": coalesce(statusbar.statusText, "ready")
  }
`)

type ShellSettings = {
  handle: string
  availabilityTitle: string | null
  availabilityStatus: boolean
  email: string | null
  github: string | null
  linkedin: string | null
  location: string | null
  branchLabel: string
  statusText: string
}

/* Cached shell data — same Cache Components pattern as the page routes:
   dynamic options resolved outside, fetched inside 'use cache' with
   perspective/stega as cache keys. */
async function getShellData({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const [navResult, settingsResult] = await Promise.all([
    sanityFetch({query: navigationQuery, perspective, stega}),
    sanityFetch({query: SHELL_SETTINGS_QUERY, perspective, stega}),
  ])
  return {
    nav: navResult.data as NavigationQueryResult | null,
    settings: settingsResult.data as ShellSettings | null,
  }
}

/* navigation.items[].route is modeled as path segments (e.g. ["portfolio"]),
   but seeded documents store a plain string — handle both. Falls back to the
   command label ("/portfolio"). "home" maps to "/". */
function toNavItems(nav: NavigationQueryResult | null): PortfolioNavItem[] {
  const items = nav?.items ?? []
  return items.map((item) => {
    const raw = item.route as unknown
    const segments = Array.isArray(raw) ? raw : typeof raw === 'string' ? [raw] : []
    const path =
      segments
        .map((s) => stegaClean(String(s)))
        .filter(Boolean)
        .join('/') || stegaClean(item.command ?? '').replace(/^\//, '')
    const href = !path || path === 'home' ? '/' : `/${path}`
    return {href, label: item.label}
  })
}

/** The palette/console prepend "https://" — links are passed without protocol. */
function stripProtocol(url?: string | null): string | undefined {
  if (!url) return undefined
  return stegaClean(url).replace(/^https?:\/\//, '')
}

/* ── Dynamic shell islands ──────────────────────────────────────────────────
   Each island reads request-scoped dynamic data (draftMode/cookies) so it must
   sit inside its own <Suspense>. Under Cache Components, reading dynamic data
   in the layout body with no boundary makes the whole route "blocking" and
   throws at render — which also tears down <VisualEditing/>, breaking the
   Presentation tool's click-to-edit overlays. getShellData is 'use cache' and
   draftMode()/cookies() are request-memoized, so resolving the options in both
   the header and footer islands is effectively free. */

async function ShellHeader() {
  const fetchOptions = await getDynamicFetchOptions()
  const {nav, settings} = await getShellData(fetchOptions)
  const navItems = toNavItems(nav)
  return (
    <ShellChrome
      handle={settings?.handle ?? ''}
      navItems={navItems}
      availabilityStatus={settings?.availabilityStatus ?? false}
      availabilityTitle={settings?.availabilityTitle ?? undefined}
      email={settings?.email ?? undefined}
      github={stripProtocol(settings?.github)}
      linkedin={stripProtocol(settings?.linkedin)}
    />
  )
}

async function ShellFooter() {
  const fetchOptions = await getDynamicFetchOptions()
  const {settings} = await getShellData(fetchOptions)
  return (
    <StatusBar
      branchLabel={settings?.branchLabel ?? ''}
      statusText={settings?.statusText ?? ''}
      location={settings?.location ?? ''}
    />
  )
}

/* Draft-mode overlays + live updates. draftMode() is dynamic → own boundary. */
async function LiveLayer() {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <>
      {isDraftMode && (
        <>
          <DraftModeToast />
          <VisualEditing />
        </>
      )}
      <SanityLive includeDrafts={isDraftMode} onError={handleError} />
    </>
  )
}

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <div className="fx-grain" aria-hidden="true" />
        <div className="fx-vignette" aria-hidden="true" />

        <div className="shell">
          <Suspense fallback={<header className="topbar" aria-hidden="true" />}>
            <ShellHeader />
          </Suspense>

          <main className="main">
            <div className="shell-inner">
              <Suspense fallback={null}>
                <LiveLayer />
              </Suspense>
              {children}
            </div>
          </main>

          <Suspense fallback={<footer className="statusbar" aria-hidden="true" />}>
            <ShellFooter />
          </Suspense>
        </div>

        <Toaster position="bottom-right" theme="dark" />
        <SpeedInsights />
      </body>
    </html>
  )
}
