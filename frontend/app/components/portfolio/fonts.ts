/**
 * Portfolio fonts — JetBrains Mono (--mono) + Space Grotesk (--display).
 * Imported by the root layout; the exposed CSS variables are consumed by
 * `app/portfolio.css` (`--mono` / `--display` in `:root`).
 */
import {JetBrains_Mono, Space_Grotesk} from 'next/font/google'

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
})

export const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
