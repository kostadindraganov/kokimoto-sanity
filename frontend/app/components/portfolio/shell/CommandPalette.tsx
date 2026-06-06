'use client'

/* ============================================================
   CommandPalette — Ctrl/Cmd+K palette (template: shell.jsx).
   navigate / actions (new session, copy email) / links.
   Self-managed open state: hotkey toggle + PALETTE_EVENT
   (dispatched by TopBar / MobileConsole "run command").
   ============================================================ */

import {useRouter} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {Fragment, useCallback, useEffect, useMemo, useRef, useState} from 'react'

import {clearAllBoots} from '../fx/BootLoader'
import type {PortfolioNavItem} from '../types'
import {PALETTE_EVENT} from './TopBar'

/** Fired when the visitor runs "new session" — page shells listen and replay the boot. */
export const NEW_SESSION_EVENT = 'portfolio:new-session'

type Command = {
  group: string
  icon: string
  label: string
  sub: string
  run: () => void
}

export function CommandPalette({
  navItems,
  handle,
  email,
  github,
  linkedin,
  onNewSession,
}: {
  navItems: PortfolioNavItem[]
  /** e.g. "kostadin@portfolio" — shown in the input row */
  handle: string
  email?: string
  github?: string
  linkedin?: string
  onNewSession?: () => void
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)

  const cleanHandle = stegaClean(handle)
  const cleanEmail = email ? stegaClean(email) : ''
  const cleanGithub = github ? stegaClean(github) : ''
  const cleanLinkedin = linkedin ? stegaClean(linkedin) : ''

  const onClose = useCallback(() => setOpen(false), [])

  const newSession = useCallback(() => {
    clearAllBoots()
    window.dispatchEvent(new CustomEvent(NEW_SESSION_EVENT))
    window.scrollTo({top: 0})
    if (onNewSession) onNewSession()
  }, [onNewSession])

  /* window hotkey + open-event (from TopBar / MobileConsole) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((p) => !p)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(PALETTE_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(PALETTE_EVENT, onOpen)
    }
  }, [])

  const commands = useMemo<Command[]>(() => {
    const navCmds: Command[] = navItems.map((n) => ({
      group: 'navigate',
      icon: '›',
      label: '/' + stegaClean(n.label),
      sub: 'page',
      run: () => {
        router.push(n.href)
        onClose()
      },
    }))
    const actions: Command[] = [
      {
        group: 'actions',
        icon: '↻',
        label: 'new session',
        sub: 'replay streaming',
        run: () => {
          newSession()
          onClose()
        },
      },
    ]
    if (cleanEmail) {
      actions.push({
        group: 'actions',
        icon: '@',
        label: 'copy email',
        sub: cleanEmail,
        run: () => {
          if (navigator.clipboard) navigator.clipboard.writeText(cleanEmail)
          onClose()
        },
      })
    }
    if (cleanGithub) {
      actions.push({
        group: 'links',
        icon: '↗',
        label: 'open github',
        sub: cleanGithub,
        run: () => {
          window.open('https://' + cleanGithub, '_blank')
          onClose()
        },
      })
    }
    if (cleanLinkedin) {
      actions.push({
        group: 'links',
        icon: '↗',
        label: 'open linkedin',
        sub: cleanLinkedin,
        run: () => {
          window.open('https://' + cleanLinkedin, '_blank')
          onClose()
        },
      })
    }
    return [...navCmds, ...actions]
  }, [navItems, router, onClose, newSession, cleanEmail, cleanGithub, cleanLinkedin])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return commands
    return commands.filter((c) => (c.label + ' ' + c.sub + ' ' + c.group).toLowerCase().includes(s))
  }, [q, commands])

  useEffect(() => {
    if (open) {
      // template behavior: reset the transcript every time the palette opens
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQ('')
      setSel(0)
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 30)
    }
  }, [open])
  useEffect(() => {
    // template behavior: reset the selection whenever the query changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSel(0)
  }, [q])

  /* keyboard trap while open: arrows + enter + escape */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSel((s) => Math.min(s + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSel((s) => Math.max(s - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[sel]) filtered[sel].run()
      } else if (e.key === 'Tab') {
        // focus trap — keep focus on the command input
        e.preventDefault()
        if (inputRef.current) inputRef.current.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, sel, onClose])

  if (!open) return null

  let lastGroup: string | null = null
  return (
    <div
      className="cmdk-scrim"
      ref={scrimRef}
      onMouseDown={(e) => {
        if (e.target === scrimRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="cmdk">
        <div className="cmdk-input-row">
          <span className="who">{cleanHandle} ~ %</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            value={q}
            placeholder="type a command…"
            onChange={(e) => setQ(e.target.value)}
            aria-label="Command input"
          />
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && (
            <div className="cmdk-group">no matches — try /home, github, email</div>
          )}
          {filtered.map((c, i) => {
            const head = c.group !== lastGroup ? c.group : null
            lastGroup = c.group
            return (
              <Fragment key={c.label + i}>
                {head && <div className="cmdk-group">{head}</div>}
                <div
                  className={'cmdk-row' + (i === sel ? ' sel' : '')}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => c.run()}
                >
                  <span className="ic">{c.icon}</span>
                  <span>{c.label}</span>
                  <span className="sub">{c.sub}</span>
                </div>
              </Fragment>
            )
          })}
        </div>
        <div className="cmdk-foot">
          <span>
            <span className="k">↑↓</span> navigate
          </span>
          <span>
            <span className="k">↵</span> run
          </span>
          <span>
            <span className="k">esc</span> close
          </span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
