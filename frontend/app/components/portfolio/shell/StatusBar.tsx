'use client'

/* ============================================================
   StatusBar — bottom status bar (template: shell.jsx).
   branch · ready · ~/route · token meter (scroll-mapped,
   23k → 140k, ultracolor gradient) · location.
   ============================================================ */

import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'

export function StatusBar({
  branchLabel,
  statusText,
  location,
}: {
  branchLabel: string
  statusText: string
  location: string
}) {
  const pathname = usePathname()
  // "/" → "home", "/blog/some-post" → "blog/some-post"
  const route = pathname === '/' ? 'home' : pathname.replace(/^\//, '')

  // token meter mapped to scroll depth — 23k at the top, 140k at the bottom
  const [tokens, setTokens] = useState(23000)
  useEffect(() => {
    let raf = 0
    const compute = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight || 1
      const p = Math.min(1, Math.max(0, window.scrollY / max))
      setTokens(Math.round(23000 + p * (140000 - 23000)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll)
    compute()
    // page height grows as content streams in — keep the mapping in sync
    const id = setInterval(compute, 700)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      clearInterval(id)
    }
  }, [pathname])

  return (
    <footer className="statusbar">
      <div className="shell-inner statusbar-row">
        <span className="seg">
          <span className="branch">⎇ {branchLabel}</span>
        </span>
        <span className="seg hide-sm">
          <span className="ok">●</span> <b>{statusText}</b>
        </span>
        <span className="seg">
          ~/<b>{route}</b>
        </span>
        <span className="spacer" />
        <span className="seg token-meter" title="context tokens">
          <span className="tok-think">ultrathink</span>
          <span className="tok-glyph">✦</span>
          <span className="tok-num tnum">{tokens.toLocaleString()}</span>
          <span className="tok-unit">tokens</span>
        </span>
        <span className="seg">{location}</span>
      </div>
    </footer>
  )
}

export default StatusBar
