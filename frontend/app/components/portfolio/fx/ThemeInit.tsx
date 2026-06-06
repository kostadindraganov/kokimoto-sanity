/* ============================================================
   ThemeInit — server-rendered theme application.
   Replaces the template's tweaks panel: applies
   siteSettings.theme (accentColor / grain / heroLayout) at
   render time. Rendered inside the root layout (P3B).
   ============================================================ */

import {stegaClean} from 'next-sanity'

export type PortfolioTheme = {
  accentColor?: {hex?: string | null} | null
  grain?: boolean | null
  heroLayout?: string | null
}

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/

export default function ThemeInit({theme}: {theme?: PortfolioTheme | null}) {
  const accentRaw = theme?.accentColor?.hex ? stegaClean(theme.accentColor.hex) : null
  const accent = accentRaw && HEX_RE.test(accentRaw) ? accentRaw : null
  const noGrain = theme?.grain === false
  const heroLayoutRaw = theme?.heroLayout ? stegaClean(theme.heroLayout) : null
  const heroLayout = heroLayoutRaw === 'split' ? 'split' : 'boot'

  // class + data attribute go on <html>; a server component can't render html
  // attributes from here, so apply them with a tiny pre-paint inline script.
  const init = [
    noGrain
      ? "document.documentElement.classList.add('no-grain');"
      : "document.documentElement.classList.remove('no-grain');",
    `document.documentElement.setAttribute('data-hero-layout',${JSON.stringify(heroLayout)});`,
  ].join('')

  return (
    <>
      {accent && <style>{`:root{--accent:${accent};}`}</style>}
      <script dangerouslySetInnerHTML={{__html: init}} />
    </>
  )
}
