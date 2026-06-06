import './globals.css'
import './portfolio.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import {JetBrains_Mono, Space_Grotesk} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import type {ReactNode} from 'react'

import DraftModeToast from '@/app/components/DraftModeToast'
import {SanityLive} from '@/sanity/lib/live'
import {handleError} from '@/app/client-utils'

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

export default async function RootLayout({children}: {children: ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <div className="fx-grain" aria-hidden="true" />
        <div className="fx-vignette" aria-hidden="true" />

        <div className="shell">
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

          <main className="main">
            <div className="shell-inner">
              {isDraftMode && (
                <>
                  <DraftModeToast />
                  <VisualEditing />
                </>
              )}
              <SanityLive includeDrafts={isDraftMode} onError={handleError} />
              {children}
            </div>
          </main>

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
