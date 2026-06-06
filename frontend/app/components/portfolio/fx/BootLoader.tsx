'use client'

/* ============================================================
   BootLoader.tsx — terminal boot screen (initial load only)
   Ported 1:1 from the template's bootloader.jsx.
   ============================================================ */

import {useEffect, useMemo, useRef, useState} from 'react'

import {prefersReduced} from './motion'
import {Spinner} from './Spinner'

/* session tracking so the boot animation runs once per session.
   We use an in-memory Set (not sessionStorage) so a real page refresh
   re-runs both the boot loader and the home-page streaming reveal.
   Navigating page-to-page within the same load still remembers
   what's been seen, so going home → blog → home doesn't replay. */
const _bootSeen = new Set<string>()
export function bootSeen(key: string): boolean {
  return _bootSeen.has(key)
}
export function markBoot(key: string): void {
  _bootSeen.add(key)
}
/** "New session" action — clears all seen pages so streams replay. */
export function clearAllBoots(): void {
  _bootSeen.clear()
}

export function BootLoader({
  onDone,
  projectCount = 0,
  postCount = 0,
  brand = 'kostadin',
  version = 'v2026.5',
}: {
  onDone: () => void
  projectCount?: number
  postCount?: number
  brand?: string
  version?: string
}) {
  // skipped entirely under prefers-reduced-motion
  const [reduced] = useState(() => prefersReduced())

  const LINES = useMemo(
    () => [
      'mount /profile.md',
      'load runtime · node v22.3',
      'index ./portfolio · ' + projectCount + ' systems',
      'start field-notes feed · ' + postCount + ' entries',
      'warm ai-native workflows',
      'establish secure session',
    ],
    [projectCount, postCount],
  )
  const N = LINES.length
  const [cur, setCur] = useState(0)
  const [exit, setExit] = useState(false)
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (reduced) {
      if (doneRef.current) doneRef.current()
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    let t: ReturnType<typeof setTimeout>
    if (cur < N) {
      t = setTimeout(() => setCur((c) => c + 1), 240 + Math.random() * 150)
    } else {
      t = setTimeout(() => {
        setExit(true)
        setTimeout(() => doneRef.current && doneRef.current(), 560)
      }, 520)
    }
    return () => clearTimeout(t)
  }, [cur, N, reduced])

  if (reduced) return null

  const pct = Math.round((Math.min(cur, N) / N) * 100)
  const shown = LINES.slice(0, cur < N ? cur + 1 : N)

  return (
    <div className={'boot' + (exit ? ' exit' : '')} role="status" aria-label="Loading">
      <div className="boot-inner">
        <div className="boot-brand">
          <span className="mark">{brand.charAt(0)}</span>
          <span className="bt">
            <b>{brand}</b>.os
          </span>
          <span className="ver">{version} · session boot</span>
        </div>
        <div className="boot-log">
          {shown.map((l, i) => {
            const done = cur >= N || i < cur
            const running = cur < N && i === cur
            return (
              <div key={i} className={'boot-line' + (done ? ' ok' : '')}>
                <span className="tag">
                  {done ? '[ ok ]' : running ? <Spinner /> : <span className="br">[ ·· ]</span>}
                </span>
                <span>{l}</span>
              </div>
            )
          })}
        </div>
        <div className="boot-bar">
          <div className="fill" style={{width: pct + '%'}} />
        </div>
        <div className="boot-foot">
          <span>
            {cur >= N ? <span className="boot-ready">▸ ready — launching console</span> : 'booting session…'}
          </span>
          <span className="pct tnum">{pct}%</span>
        </div>
      </div>
    </div>
  )
}

export default BootLoader
