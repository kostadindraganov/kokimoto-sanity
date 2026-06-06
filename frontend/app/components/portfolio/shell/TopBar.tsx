'use client'

/* ============================================================
   TopBar — top system bar (template: shell.jsx).
   brand · nav (active blinking block cursor) · run Ctrl K ·
   breathing "available" dot · burger (mobile console).
   ============================================================ */

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import type {PortfolioNavItem} from '../types'

/** Window events used to wire the shell pieces together when no callbacks are passed. */
export const PALETTE_EVENT = 'portfolio:palette'
export const MOBILE_EVENT = 'portfolio:mobile'

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function TopBar({
  handle,
  navItems,
  availabilityStatus,
  availabilityTitle,
  onPalette,
  onMobile,
}: {
  /** e.g. "kostadin@portfolio" — rendered as mark · name · @ · domain */
  handle: string
  navItems: PortfolioNavItem[]
  availabilityStatus: boolean
  availabilityTitle?: string
  onPalette?: () => void
  onMobile?: () => void
}) {
  const pathname = usePathname()
  // the handle is split into brand fragments — clean stega chars first
  const cleanHandle = stegaClean(handle) || 'kostadin@portfolio'
  const [name, domain] = cleanHandle.includes('@')
    ? cleanHandle.split('@')
    : [cleanHandle, 'portfolio']

  const openPalette = () => {
    if (onPalette) onPalette()
    else window.dispatchEvent(new CustomEvent(PALETTE_EVENT))
  }
  const openMobile = () => {
    if (onMobile) onMobile()
    else window.dispatchEvent(new CustomEvent(MOBILE_EVENT))
  }

  return (
    <header className="topbar">
      <div className="shell-inner topbar-row">
        <Link className="brand" href="/">
          <span className="mark">{name.charAt(0)}</span>
          <b>{name}</b>
          <span className="sep domain">@</span>
          <span className="domain">{domain}</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          {navItems.map((n) => {
            const active = isActive(pathname, n.href)
            return (
              <Link
                key={n.href}
                href={n.href}
                className={'nav-item' + (active ? ' active' : '')}
                aria-current={active ? 'page' : undefined}
              >
                <span className="slash">/</span>
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div className="topbar-right">
          <button className="kbd-hint" onClick={openPalette} aria-label="Open command palette">
            <span>run</span>
            <span className="kbd">Ctrl</span>
            <span className="kbd">K</span>
          </button>
          {availabilityStatus && (
            <span className="avail" title={availabilityTitle}>
              <span className="dot" />
              <span className="lbl">available</span>
            </span>
          )}
          <button
            className="burger"
            onClick={openMobile}
            aria-label="Open navigation console"
            aria-haspopup="dialog"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar
