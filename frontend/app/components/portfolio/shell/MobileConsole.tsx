'use client'

/* ============================================================
   MobileConsole — full-screen nav drawer (template: shell.jsx).
   Slides down from the top; nav items animate an accent
   edge-bar + arrow on press. Closes on route change, outside
   tap or Escape.
   ============================================================ */

import {usePathname, useRouter} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {useEffect, useRef} from 'react'

import {clearAllBoots} from '../fx/BootLoader'
import {Cursor} from '../fx/Cursor'
import type {PortfolioNavItem} from '../types'
import {NEW_SESSION_EVENT} from './CommandPalette'
import {PALETTE_EVENT} from './TopBar'

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function MobileConsole({
  navItems,
  isOpen,
  onClose,
  handle = 'kostadin@portfolio',
  email,
  github,
  linkedin,
  onPalette,
  onNewSession,
}: {
  navItems: PortfolioNavItem[]
  isOpen: boolean
  onClose: () => void
  /** e.g. "kostadin@portfolio" */
  handle?: string
  email?: string
  github?: string
  linkedin?: string
  onPalette?: () => void
  onNewSession?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  const cleanHandle = stegaClean(handle)
  const name = cleanHandle.includes('@') ? cleanHandle.split('@')[0] : cleanHandle
  const cleanEmail = email ? stegaClean(email) : ''
  const cleanGithub = github ? stegaClean(github) : ''
  const cleanLinkedin = linkedin ? stegaClean(linkedin) : ''

  /* close on route change */
  const prevPath = useRef(pathname)
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname
      if (isOpen) onClose()
    }
  }, [pathname, isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const first = ref.current && ref.current.querySelector('button')
    if (first) first.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const go = (href: string) => {
    router.push(href)
    onClose()
  }
  const openPalette = () => {
    onClose()
    setTimeout(() => {
      if (onPalette) onPalette()
      else window.dispatchEvent(new CustomEvent(PALETTE_EVENT))
    }, 60)
  }
  const newSession = () => {
    clearAllBoots()
    window.dispatchEvent(new CustomEvent(NEW_SESSION_EVENT))
    window.scrollTo({top: 0})
    if (onNewSession) onNewSession()
    onClose()
  }

  return (
    <>
      <div className="mcon-scrim" onClick={onClose} />
      <div className="mcon" ref={ref} role="dialog" aria-modal="true" aria-label="Navigation console">
        <div className="mcon-head">
          <span className="brand">
            <span className="mark">{name.charAt(0)}</span>
            <b>{name}</b>
          </span>
          <button className="mcon-close" onClick={onClose} aria-label="Close navigation">
            ×
          </button>
        </div>
        <div className="mcon-prompt">
          <span className="who" style={{color: 'var(--green)'}}>
            {cleanHandle}
          </span>
          <span style={{color: 'var(--ink-4)'}}>~ %</span>
          <span style={{color: 'var(--ink)'}}>nav</span>
          <Cursor />
        </div>
        <div className="mcon-list">
          {navItems.map((n) => (
            <button
              key={n.href}
              className={'mcon-item' + (isActive(pathname, n.href) ? ' active' : '')}
              onClick={() => go(n.href)}
            >
              <span className="slash">/</span>
              <span>{n.label}</span>
              <span className="ic">↵</span>
            </button>
          ))}
        </div>
        <div className="mcon-actions">
          <button className="mcon-action" onClick={openPalette}>
            <span className="ic">⌘</span>
            <span className="lbl">run command</span>
            <span className="kbd">Ctrl</span>
            <span className="kbd">K</span>
          </button>
          <button className="mcon-action" onClick={newSession}>
            <span className="ic">↻</span>
            <span className="lbl">new session</span>
            <span className="sub">replay stream</span>
          </button>
        </div>
        <div className="mcon-foot">
          {cleanEmail && <a href={'mailto:' + cleanEmail}>{cleanEmail}</a>}
          {cleanGithub && (
            <a href={'https://' + cleanGithub} target="_blank" rel="noreferrer">
              github ↗
            </a>
          )}
          {cleanLinkedin && (
            <a href={'https://' + cleanLinkedin} target="_blank" rel="noreferrer">
              linkedin ↗
            </a>
          )}
        </div>
      </div>
    </>
  )
}

export default MobileConsole
