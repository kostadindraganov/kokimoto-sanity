'use client'

/* ============================================================
   AsciiReveal.tsx — images decode in from scrambling ASCII art
   then crossfade to the real photo.
   Verbatim TSX port of docs/kokikillara-porfolio/js/ascii-reveal.jsx.
   Adapted for Sanity CDN images: crossOrigin="anonymous"
   (cdn.sanity.io sends CORS headers) + the template's
   tainted-canvas fallback (skip the effect, just reveal).
   NOTE: swap imports to app/components/portfolio/fx/* once the
   frontend-foundation workstream lands its canonical fx port.
   ============================================================ */

import {type CSSProperties, useEffect, useRef, useState} from 'react'

import {prefersReduced} from './session'

const ASCII_CHARS = '........:::=+xX#0369'
const ASCII_FONT = 13 // px, monospace cell
const _denseStart = ASCII_CHARS.lastIndexOf('.') + 1
const _denseChars = ASCII_CHARS.slice(_denseStart).split('')

/* measure a monospace cell once (lazily, client-only) */
let _cellW: number | null = null
function asciiCellWidth(): number {
  if (_cellW == null) {
    const mctx = document.createElement('canvas').getContext('2d')
    if (!mctx) return ASCII_FONT
    mctx.font = `${ASCII_FONT}px monospace`
    _cellW = Math.ceil(mctx.measureText('M').width)
  }
  return _cellW
}
const ASCII_CH = ASCII_FONT

function _palette() {
  const cs = getComputedStyle(document.documentElement)
  return {
    bg: (cs.getPropertyValue('--bg-1') || '#100e0b').trim(),
    ink: (cs.getPropertyValue('--ink-2') || '#b9b1a0').trim(),
    accent: (cs.getPropertyValue('--accent') || '#db8c4e').trim(),
  }
}

/* sample img (cropped to the container aspect, cover) → char + brightness grids */
function _toAsciiGrid(img: HTMLImageElement, cols: number, rows: number) {
  const ASCII_CW = asciiCellWidth()
  const s = document.createElement('canvas')
  s.width = cols
  s.height = rows
  const sctx = s.getContext('2d')
  if (!sctx) throw new Error('no 2d context')

  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (nw && nh) {
    const imgAspect = nw / nh
    const boxAspect = (cols / rows) * (ASCII_CW / ASCII_CH)
    let cx = 0
    let cy = 0
    let cw = nw
    let ch = nh
    if (imgAspect > boxAspect) {
      cw = nh * boxAspect
      cx = (nw - cw) / 2
    } else {
      ch = nw / boxAspect
      cy = (nh - ch) / 2
    }
    sctx.drawImage(img, cx, cy, cw, ch, 0, 0, cols, rows)
  } else {
    // SVG / sizeless image — scale the whole thing to fill the sampling grid
    sctx.drawImage(img, 0, 0, cols, rows)
  }
  const {data} = sctx.getImageData(0, 0, cols, rows)

  const chars: string[][] = []
  const bright: number[][] = []
  for (let r = 0; r < rows; r++) {
    const cr: string[] = []
    const br: number[] = []
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
      const idx = Math.min(ASCII_CHARS.length - 1, Math.floor((1 - lum) * ASCII_CHARS.length))
      cr.push(ASCII_CHARS[idx])
      br.push(idx)
    }
    chars.push(cr)
    bright.push(br)
  }
  return {chars, bright}
}

function _shuffle(a: number[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface RevealOpts {
  columns?: number
  box?: {w: number; h: number}
  appearMs?: number
  scramble?: number
  scrambleMs?: number
  stagger?: number
}

/* run the decode animation on a canvas; calls onDone when settled.
   returns a cleanup fn. */
export function runAsciiReveal(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  opts: RevealOpts,
  onDone?: () => void,
): () => void {
  const ASCII_CW = asciiCellWidth()
  const cols = opts.columns || 46
  const box = opts.box || {w: 100, h: 125}
  const rows = Math.max(8, Math.round(cols * (box.h / box.w) * (ASCII_CW / ASCII_CH)))
  let chars: string[][]
  let bright: number[][]
  try {
    ;({chars, bright} = _toAsciiGrid(img, cols, rows))
  } catch {
    // tainted canvas / unreadable image — skip the effect, just reveal
    if (onDone) onDone()
    return () => {}
  }
  const {bg, ink, accent} = _palette()

  const dpr = 2
  canvas.width = cols * ASCII_CW * dpr
  canvas.height = rows * ASCII_CH * dpr
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    if (onDone) onDone()
    return () => {}
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, cols * ASCII_CW, rows * ASCII_CH)
  ctx.font = `${ASCII_CH}px monospace`
  ctx.textBaseline = 'top'

  const draw = (col: number, row: number, ch: string, color: string) => {
    ctx.fillStyle = bg
    ctx.fillRect(col * ASCII_CW, row * ASCII_CH, ASCII_CW, ASCII_CH)
    ctx.fillStyle = color
    ctx.fillText(ch, col * ASCII_CW, row * ASCII_CH)
  }

  const total = cols * rows
  const denseIdx = _denseStart - 1
  const state: (number | null)[] = new Array(total).fill(null)
  let settled = 0
  const timers: ReturnType<typeof setTimeout>[] = []
  let ticker: ReturnType<typeof setInterval> | null = null
  let done = false

  const finish = () => {
    if (done) return
    done = true
    if (onDone) onDone()
  }

  const order = _shuffle(Array.from({length: total}, (_, i) => i))
  const APPEAR = opts.appearMs != null ? opts.appearMs : 1.3
  const SCRAMBLE = opts.scramble != null ? opts.scramble : 5
  const SCRAMBLE_MS = opts.scrambleMs != null ? opts.scrambleMs : 42
  const stagger = opts.stagger || 0

  order.forEach((cell, i) => {
    timers.push(
      setTimeout(
        () => {
          const row = Math.floor(cell / cols)
          const col = cell % cols
          const isDark = bright[row][col] > denseIdx
          if (!isDark) {
            draw(col, row, chars[row][col], ink)
            state[cell] = 0
            settled++
            if (settled === total) finish()
          } else {
            draw(col, row, _denseChars[(Math.random() * _denseChars.length) | 0], accent)
            state[cell] = SCRAMBLE
          }
        },
        stagger + i * APPEAR,
      ),
    )
  })

  ticker = setInterval(() => {
    let busy = false
    for (let cell = 0; cell < total; cell++) {
      const rem = state[cell]
      if (rem === null || rem === 0) continue
      busy = true
      const row = Math.floor(cell / cols)
      const col = cell % cols
      if (rem === 1) {
        draw(col, row, chars[row][col], ink)
        state[cell] = 0
        settled++
        if (settled === total) finish()
      } else {
        draw(col, row, _denseChars[(Math.random() * _denseChars.length) | 0], accent)
        state[cell] = rem - 1
      }
    }
    if (!busy && settled === total && ticker) clearInterval(ticker)
  }, SCRAMBLE_MS)

  return () => {
    timers.forEach(clearTimeout)
    if (ticker) clearInterval(ticker)
  }
}

export interface AsciiRevealProps {
  src: string
  alt?: string
  columns?: number
  className?: string
  imgClassName?: string
  style?: CSSProperties
  loading?: 'lazy' | 'eager'
}

/* React wrapper — drop in place of an <img>. The parent must be a
   positioning context (position: relative/absolute + overflow hidden),
   which all the image frames on this site already are. */
export default function AsciiReveal({
  src,
  alt = '',
  columns = 46,
  className = '',
  imgClassName = '',
  style,
  loading = 'lazy',
}: AsciiRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const wrapRef = useRef<HTMLSpanElement | null>(null)
  // derived "revealed" — keyed by src so a src change resets automatically
  const [revealedSrc, setRevealedSrc] = useState<string | null>(null)
  const revealed = revealedSrc === src

  useEffect(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!img || !canvas || !wrap) return
    if (prefersReduced()) {
      const t = setTimeout(() => setRevealedSrc(src), 0)
      return () => clearTimeout(t)
    }

    let cleanup: (() => void) | null = null
    let cancelled = false
    let poll: ReturnType<typeof setInterval> | null = null
    const start = () => {
      if (cancelled || canvas.width > 300) return // already running
      const rect = wrap.getBoundingClientRect()
      const box = {w: rect.width || 100, h: rect.height || 125}
      cleanup = runAsciiReveal(canvas, img, {columns, box, stagger: 0}, () => {
        // hold the finished ASCII portrait a beat, then dissolve to the photo
        if (!cancelled)
          setTimeout(() => {
            if (!cancelled) setRevealedSrc(src)
          }, 260)
      })
    }
    const ready = () => img.complete && img.naturalWidth > 0
    // CORS/load failure (e.g. origin not allowed on the CDN) — skip the
    // effect and reveal so the frame never sticks on a scrambling canvas
    const fail = () => {
      if (!cancelled) setRevealedSrc(src)
    }
    img.loading = 'eager' // the effect needs the pixels — don't defer the load
    if (ready()) start()
    else {
      img.addEventListener('load', start)
      img.addEventListener('error', fail)
      // 'load' may fire before the listener attaches (cached) — poll as a safety net
      poll = setInterval(() => {
        if (ready()) {
          if (poll) clearInterval(poll)
          poll = null
          start()
        }
      }, 120)
    }

    return () => {
      cancelled = true
      img.removeEventListener('load', start)
      img.removeEventListener('error', fail)
      if (poll) clearInterval(poll)
      if (cleanup) cleanup()
    }
  }, [src, columns])

  return (
    <span
      ref={wrapRef}
      className={
        'ascii-reveal' + (revealed ? ' revealed' : '') + (className ? ' ' + className : '')
      }
      style={style}
    >
      {/* raw <img> is required: the effect samples pixels off the element
          and toggles `loading` imperatively — next/image can't do either. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        crossOrigin="anonymous"
        className={'ascii-reveal-img' + (imgClassName ? ' ' + imgClassName : '')}
      />
      <canvas ref={canvasRef} className="ascii-reveal-canvas" aria-hidden="true" />
    </span>
  )
}
