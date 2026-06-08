'use client'

/* ============================================================
   AsciiImageReveal.tsx — image decodes in from scrambling ASCII
   characters, then cuts to the real photo once every cell has
   settled. Ported from the codegrid "ASCII Image Reveal Effect"
   reference (script.js), retuned to the warm-graphite terminal
   palette and hardened for CMS images (CORS canvas sampling,
   reduced-motion + tainted-canvas fallbacks, stega cleaning).
   ============================================================ */

import {stegaClean} from 'next-sanity'
import {type CSSProperties, useEffect, useRef, useState} from 'react'

import {prefersReduced} from './motion'

// codegrid timing/feel — kept verbatim from the reference
const ASCII_CHARS = '........:::=+xX#0369'
const FONT_SIZE = 14 // px, monospace cell height (internal render only)
const CELL_APPEAR_MS = 0.7 // per-cell stagger; small so the fine grid still decodes quickly
const SCRAMBLE_COUNT = 10 // ticks a dark cell scrambles before settling
const SCRAMBLE_SPEED_MS = 100 // scramble tick interval
const REVEAL_DELAY_MS = 0 // hold after settle before showing the photo

const denseStart = ASCII_CHARS.lastIndexOf('.')
const denseChars = ASCII_CHARS.slice(denseStart + 1).split('')

/* measure one monospace cell, lazily (SSR-safe) */
let _charWidth = 0
function charWidth(): number {
  if (_charWidth) return _charWidth
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) {
    _charWidth = Math.ceil(FONT_SIZE * 0.6)
    return _charWidth
  }
  ctx.font = `${FONT_SIZE}px monospace`
  _charWidth = Math.ceil(ctx.measureText('M').width)
  return _charWidth
}

function palette() {
  const cs = getComputedStyle(document.documentElement)
  return {
    bg: (cs.getPropertyValue('--bg-1') || '#100e0b').trim(),
    ink: (cs.getPropertyValue('--ink-2') || '#b9b1a0').trim(),
    accent: (cs.getPropertyValue('--accent') || '#db8c4e').trim(),
  }
}

/* sample img (cover-cropped to the box aspect) into char + brightness grids */
function imageToAsciiGrid(
  img: HTMLImageElement,
  cols: number,
  rows: number,
  boxAspect: number,
) {
  const sampling = document.createElement('canvas')
  sampling.width = cols
  sampling.height = rows
  const sctx = sampling.getContext('2d')
  if (!sctx) throw new Error('no 2d context')

  const nw = img.naturalWidth
  const nh = img.naturalHeight
  let cx = 0
  let cy = 0
  let cw = nw
  let ch = nh
  const imgAspect = nw / nh
  if (imgAspect > boxAspect) {
    cw = nh * boxAspect
    cx = (nw - cw) / 2
  } else {
    ch = nw / boxAspect
    cy = (nh - ch) / 2
  }
  sctx.drawImage(img, cx, cy, cw, ch, 0, 0, cols, rows)

  // throws SecurityError on a tainted canvas — handled by the caller
  const {data} = sctx.getImageData(0, 0, cols, rows)

  const asciiGrid: string[][] = []
  const brightnessGrid: number[][] = []
  for (let row = 0; row < rows; row++) {
    const aRow: string[] = []
    const bRow: number[] = []
    for (let col = 0; col < cols; col++) {
      const i = (row * cols + col) * 4
      const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
      const charIndex = Math.min(
        ASCII_CHARS.length - 1,
        Math.floor((1 - brightness) * ASCII_CHARS.length),
      )
      aRow.push(ASCII_CHARS[charIndex])
      bRow.push(charIndex)
    }
    asciiGrid.push(aRow)
    brightnessGrid.push(bRow)
  }
  return {asciiGrid, brightnessGrid}
}

function shuffle(a: number[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* run the decode on the canvas; calls onDone when every cell has settled.
   returns a cleanup fn. */
function runReveal(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  cols: number,
  rows: number,
  boxAspect: number,
  staggerDelay: number,
  onDone: () => void,
): () => void {
  let asciiGrid: string[][]
  let brightnessGrid: number[][]
  try {
    ;({asciiGrid, brightnessGrid} = imageToAsciiGrid(img, cols, rows, boxAspect))
  } catch {
    onDone() // tainted/unreadable canvas — just show the photo
    return () => {}
  }

  const {bg, ink, accent} = palette()
  const cw = charWidth()
  const ch = FONT_SIZE
  const dpr = 2
  canvas.width = cols * cw * dpr
  canvas.height = rows * ch * dpr
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    onDone()
    return () => {}
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, cols * cw, rows * ch)
  ctx.font = `${ch}px monospace`
  ctx.textBaseline = 'top'

  const drawChar = (col: number, row: number, char: string, color: string) => {
    ctx.fillStyle = bg
    ctx.fillRect(col * cw, row * ch, cw, ch)
    ctx.fillStyle = color
    ctx.fillText(char, col * cw, row * ch)
  }

  const total = cols * rows
  const scrambleState: (number | null)[] = new Array(total).fill(null)
  let settled = 0
  let finished = false
  const timers: ReturnType<typeof setTimeout>[] = []
  let ticker: ReturnType<typeof setInterval> | null = null

  const finish = () => {
    if (finished) return
    finished = true
    if (REVEAL_DELAY_MS) timers.push(setTimeout(onDone, REVEAL_DELAY_MS))
    else onDone()
  }

  const order = shuffle(Array.from({length: total}, (_, i) => i))
  order.forEach((cell, i) => {
    timers.push(
      setTimeout(
        () => {
          const row = Math.floor(cell / cols)
          const col = cell % cols
          const isDark = brightnessGrid[row][col] > denseStart
          if (!isDark) {
            drawChar(col, row, asciiGrid[row][col], ink)
            scrambleState[cell] = 0
            settled++
            if (settled === total) finish()
          } else {
            drawChar(col, row, denseChars[(Math.random() * denseChars.length) | 0], accent)
            scrambleState[cell] = SCRAMBLE_COUNT
          }
        },
        staggerDelay + i * CELL_APPEAR_MS,
      ),
    )
  })

  ticker = setInterval(() => {
    let busy = false
    for (let cell = 0; cell < total; cell++) {
      const rem = scrambleState[cell]
      if (rem === null || rem === 0) continue
      busy = true
      const row = Math.floor(cell / cols)
      const col = cell % cols
      if (rem === 1) {
        drawChar(col, row, asciiGrid[row][col], ink)
        scrambleState[cell] = 0
        settled++
        if (settled === total) finish()
      } else {
        drawChar(col, row, denseChars[(Math.random() * denseChars.length) | 0], accent)
        scrambleState[cell] = rem - 1
      }
    }
    if (!busy && settled === total && ticker) clearInterval(ticker)
  }, SCRAMBLE_SPEED_MS)

  return () => {
    timers.forEach(clearTimeout)
    if (ticker) clearInterval(ticker)
  }
}

/* React wrapper — fills its (position:relative) parent. */
export function AsciiImageReveal({
  src,
  alt = '',
  columns = 64,
  staggerMs = 0,
  className = '',
  style,
}: {
  src: string
  alt?: string
  columns?: number
  staggerMs?: number
  className?: string
  style?: CSSProperties
}) {
  // CMS URLs/strings carry invisible stega chars that break image loading
  // and canvas sampling — clean everything fed into the pipeline.
  const cleanSrc = stegaClean(src)
  const cleanAlt = stegaClean(alt)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    // re-arm whenever the source changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRevealed(false)
    const img = imgRef.current
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!img || !canvas || !wrap) return
    if (prefersReduced()) {
      setRevealed(true)
      return
    }

    let cancelled = false
    let cleanup: (() => void) | null = null
    let poll: ReturnType<typeof setInterval> | null = null
    let safety: ReturnType<typeof setTimeout> | null = null

    const reveal = () => {
      if (!cancelled) setRevealed(true)
    }

    // a fresh flag per effect run — NOT canvas.width — so React strict-mode's
    // dev remount (mount → cleanup → mount) restarts the decode cleanly instead
    // of the second mount short-circuiting on the first (now-frozen) run.
    let runStarted = false
    const start = () => {
      if (cancelled || runStarted) return
      const rect = wrap.getBoundingClientRect()
      if (!rect.width || !rect.height) return // not laid out yet — poll retries
      runStarted = true
      const cw = charWidth()
      const rows = Math.max(6, Math.round(columns * (rect.height / rect.width) * (cw / FONT_SIZE)))
      const boxAspect = rect.width / rect.height
      try {
        cleanup = runReveal(canvas, img, columns, rows, boxAspect, staggerMs, reveal)
      } catch {
        reveal()
      }
      // safety net: never leave the canvas stuck if the decode stalls
      // (e.g. a backgrounded tab throttling timers)
      safety = setTimeout(reveal, staggerMs + columns * rows * CELL_APPEAR_MS + 6000)
    }

    const ready = () => img.complete && img.naturalWidth > 0
    img.loading = 'eager' // the decode needs the pixels — don't defer the load
    if (ready()) start()
    // start() may have no-op'd (image not ready, or frame not laid out yet) —
    // keep retrying via the load event + a poll until the run actually begins
    if (!runStarted) {
      img.addEventListener('load', start)
      poll = setInterval(() => {
        if (ready()) start()
        if (runStarted && poll) {
          clearInterval(poll)
          poll = null
        }
      }, 120)
    }

    return () => {
      cancelled = true
      img.removeEventListener('load', start)
      if (poll) clearInterval(poll)
      if (safety) clearTimeout(safety)
      if (cleanup) cleanup()
    }
  }, [cleanSrc, columns, staggerMs])

  return (
    <span
      ref={wrapRef}
      className={className}
      style={{position: 'absolute', inset: 0, display: 'block', overflow: 'hidden', ...style}}
    >
      {/* cdn.sanity.io sends CORS headers — anonymous crossOrigin keeps the
          canvas untainted so getImageData can sample the pixels */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={cleanSrc}
        alt={cleanAlt}
        crossOrigin="anonymous"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: revealed ? 'block' : 'none',
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: revealed ? 'none' : 'block',
        }}
      />
    </span>
  )
}

export default AsciiImageReveal
