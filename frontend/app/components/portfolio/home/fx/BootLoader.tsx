'use client'

/* ============================================================
   BootLoader.tsx — terminal boot screen (initial load only).
   Verbatim TSX port of docs/kokikillara-porfolio/js/bootloader.jsx,
   with all copy supplied via CMS-fed props (zero hardcoded copy).
   NOTE: swap imports to app/components/portfolio/fx/* once the
   frontend-foundation workstream lands its canonical fx port.
   ============================================================ */

import {useEffect, useRef, useState} from 'react'

import {Spinner} from './Streaming'

export interface BootLoaderProps {
  lines: string[]
  brandMark: string
  brandName: string
  brandSuffix: string
  versionLabel: string
  bootingLabel: string
  readyLabel: string
  onDone?: () => void
}

export default function BootLoader({
  lines,
  brandMark,
  brandName,
  brandSuffix,
  versionLabel,
  bootingLabel,
  readyLabel,
  onDone,
}: BootLoaderProps) {
  const N = lines.length
  const [cur, setCur] = useState(0)
  const [exit, setExit] = useState(false)
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
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
  }, [cur, N])

  const pct = N > 0 ? Math.round((Math.min(cur, N) / N) * 100) : 100
  const shown = lines.slice(0, cur < N ? cur + 1 : N)

  return (
    <div className={'boot' + (exit ? ' exit' : '')} role="status" aria-label="Loading">
      <div className="boot-inner">
        <div className="boot-brand">
          <span className="mark">{brandMark}</span>
          <span className="bt">
            <b>{brandName}</b>
            {brandSuffix}
          </span>
          <span className="ver">{versionLabel}</span>
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
          <span>{cur >= N ? <span className="boot-ready">{readyLabel}</span> : bootingLabel}</span>
          <span className="pct tnum">{pct}%</span>
        </div>
      </div>
    </div>
  )
}
