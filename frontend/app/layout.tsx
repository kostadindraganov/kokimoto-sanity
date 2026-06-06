import './globals.css'
// portfolio.css is ported from the template's styles.css — created by the UI agent
import './portfolio.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {JetBrains_Mono, Space_Grotesk} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense} from 'react'

import DraftModeToast from '@/app/components/DraftModeToast'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
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

// Kokikillara design system fonts
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        {/* fx-grain and fx-vignette atmosphere layers */}
        <div className="fx-grain" aria-hidden="true" />
        <div className="fx-vignette" aria-hidden="true" />

        <div className="shell">
          {/* TopBar */}
          <header className="topbar">
            <div className="shell-inner topbar-row">
              <span className="brand">
                <span className="mark">K</span>
                <b>kostadin</b>
                <span className="sep">@</span>
                portfolio
              </span>
            </div>
          </header>

          {/* Main content */}
          <main className="main">
            <div className="shell-inner">
              {/* The <Toaster> component is responsible for rendering toast notifications */}
              <Toaster />
              {isDraftMode && (
                <>
                  <DraftModeToast />
                  {/* Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
                  <VisualEditing />
                </>
              )}
              {/* The <SanityLive> component is responsible for making all sanityFetch calls live */}
              <SanityLive onError={handleError} />
              {children}
            </div>
          </main>

          {/* StatusBar */}
          <footer className="statusbar">
            <div className="shell-inner statusbar-row">
              <span className="seg branch">main</span>
              <span className="seg">ready</span>
              <span className="spacer" />
              <span className="seg token-meter">
                <span className="tok-glyph">⬡</span>
                <span className="tok-think">ctx</span>
                <span className="tok-num">23k</span>
                <span className="tok-unit">tok</span>
              </span>
            </div>
          </footer>
        </div>

        <SpeedInsights />
      </body>
    </html>
  )
}
