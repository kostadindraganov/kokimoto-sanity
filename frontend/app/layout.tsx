import './globals.css'
// portfolio.css is ported from the template's styles.css — created by the UI agent
import './portfolio.css'

import {JetBrains_Mono, Space_Grotesk} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense} from 'react'

import DraftModeToast from '@/app/components/DraftModeToast'
import {getDynamicFetchOptions, sanityFetch, SanityLive, type DynamicFetchOptions} from '@/sanity/lib/live'
import {NAVIGATION_QUERY, SETTINGS_QUERY} from '@/sanity/lib/queries'
import {handleError} from '@/app/client-utils'

// ─── Fonts ────────────────────────────────────────────────────────────────────
// JetBrains Mono → --mono (monospace-first body + UI chrome)
// Space Grotesk  → --display (headings, names, metric numbers)

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

// ─── Layout helpers (three-layer pattern per sanity-live-cache-components) ────
// Layer 2: resolves perspective + stega from cookies (dynamic API)
async function DynamicTopBar() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedTopBar perspective={perspective} stega={stega} />
}

// Layer 3: 'use cache' — fetches settings + nav, renders TopBar
async function CachedTopBar({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const [{data: settings}, {data: navigation}] = await Promise.all([
    sanityFetch({query: SETTINGS_QUERY, perspective, stega}),
    sanityFetch({query: NAVIGATION_QUERY, perspective, stega}),
  ])
  // TopBar is a client component — import lazily once it exists
  // For now render a placeholder that gets replaced when the portfolio shell lands.
  // The settings and navigation props will be threaded through once TopBar is implemented.
  void settings
  void navigation
  return (
    <header className="topbar">
      {/* TopBar client component slot — portfolio shell agent will wire this */}
    </header>
  )
}

// Layer 2: StatusBar
async function DynamicStatusBar() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedStatusBar perspective={perspective} stega={stega} />
}

// Layer 3: StatusBar data
async function CachedStatusBar({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const [{data: settings}, {data: navigation}] = await Promise.all([
    sanityFetch({query: SETTINGS_QUERY, perspective, stega}),
    sanityFetch({query: NAVIGATION_QUERY, perspective, stega}),
  ])
  // StatusBar is a client component — will be wired by the portfolio shell agent.
  void settings
  void navigation
  return (
    <footer className="statusbar">
      {/* StatusBar client component slot — portfolio shell agent will wire this */}
    </footer>
  )
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body className="shell">
        {/* TopBar — three-layer pattern keeps children streaming */}
        {isDraftMode ? (
          <Suspense fallback={<div className="topbar" aria-hidden />}>
            <DynamicTopBar />
          </Suspense>
        ) : (
          <CachedTopBar perspective="published" stega={false} />
        )}

        {/* Page content */}
        <main className="shell-inner">{children}</main>

        {/* StatusBar — three-layer pattern */}
        {isDraftMode ? (
          <Suspense fallback={<div className="statusbar" aria-hidden />}>
            <DynamicStatusBar />
          </Suspense>
        ) : (
          <CachedStatusBar perspective="published" stega={false} />
        )}

        {/* Atmosphere overlays (film grain + vignette) */}
        <div className="fx-grain" aria-hidden />
        <div className="fx-vignette" aria-hidden />

        {/* Sanity Live — single instance, revalidates cached content */}
        <SanityLive includeDrafts={isDraftMode} onError={handleError} />

        {/* Draft mode tools — gated so they never ship to production visitors */}
        {isDraftMode && <VisualEditing />}
        {isDraftMode && <DraftModeToast />}
      </body>
    </html>
  )
}
