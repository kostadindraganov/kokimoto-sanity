'use client'

/* ============================================================
   HeroAscii.tsx — interactive ASCII wordmark for the home hero
   Ported 1:1 from the template's hero-ascii.jsx.
   - text is sampled into a low-res grid of "cells"
   - lit cells stream in left→right (sync'd with the boot reveal)
   - cells then constantly re-pick their glyph and respond to the
     mouse with a spring-physics push
   ============================================================ */

import {stegaClean} from 'next-sanity'
import {useEffect, useRef} from 'react'

import {prefersReduced} from './motion'

type Cell = {
  col: number
  row: number
  char: string
  isLit: boolean
  lit: boolean
  offsetX: number
  offsetY: number
  velX: number
  velY: number
}

export function HeroAscii({
  word,
  sub,
  animate,
  onDone,
  handle = 'kostadin@portfolio',
}: {
  word: string
  sub?: string
  animate: boolean
  onDone?: () => void
  handle?: string
}) {
  // stega-encoded invisible characters break canvas text sampling/measuring —
  // clean every string fed to the canvas.
  const cleanWord = stegaClean(word)
  const cleanSub = sub ? stegaClean(sub) : undefined
  const cleanHandle = stegaClean(handle)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{
    col: number
    row: number
    isMoving: boolean
    idle: ReturnType<typeof setTimeout> | undefined
  }>({col: -999, row: -999, isMoving: false, idle: undefined})
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d', {alpha: true})
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const reduced = prefersReduced()
    const mouse = mouseRef.current

    const GRID_COLOR = 'rgba(236, 230, 215, 0.05)'
    const ASCII_CHARS = '.:+*#%@0369'
    const THRESHOLD = 0.5
    const PUSH_RADIUS = 5
    const PUSH_FORCE = 30
    const SPRING = 0.025
    const DAMPING = 0.5

    let CHAR_COLOR = '#dadada'
    const readAccent = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()
      if (v) CHAR_COLOR = v
    }
    readAccent()

    let cells: Cell[] = []
    let cols = 0
    let rows = 0
    let CELL_SIZE = 8
    let CELL_GAP = 2
    let CELL_STEP = CELL_SIZE + CELL_GAP
    let width = 0
    let height = 0
    let rafId = 0
    let streamId = 0
    let scrambleId: ReturnType<typeof setInterval> | 0 = 0
    let streaming = !!animate && !reduced
    let revealedCols = streaming ? -8 : 9999

    function setupCanvas() {
      if (!wrap || !canvas || !ctx) return
      const rect = wrap.getBoundingClientRect()
      width = Math.max(280, Math.floor(rect.width))
      height = Math.max(140, Math.floor(rect.height))
      CELL_SIZE = width < 480 ? 3 : width < 760 ? 5 : width < 1100 ? 7 : 8
      CELL_GAP = width < 480 ? 1 : 2
      CELL_STEP = CELL_SIZE + CELL_GAP
      cols = Math.floor(width / CELL_STEP)
      rows = Math.floor(height / CELL_STEP)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function sampleText() {
      const sample = document.createElement('canvas')
      sample.width = cols
      sample.height = rows
      const sCtx = sample.getContext('2d')
      if (!sCtx) {
        cells = []
        return
      }
      sCtx.fillStyle = '#000'
      sCtx.fillRect(0, 0, cols, rows)
      sCtx.fillStyle = '#fff'
      sCtx.textAlign = 'center'
      sCtx.textBaseline = 'middle'

      const hasSub = !!cleanSub
      const wordH = hasSub ? rows * 0.62 : rows * 0.78
      const wordY = hasSub ? rows * 0.42 : rows * 0.52

      // main word — pick font size that fills ~92% of width
      let size = Math.max(8, Math.floor(wordH))
      sCtx.font = `700 ${size}px "Space Grotesk", system-ui, sans-serif`
      const m = sCtx.measureText(cleanWord)
      const targetW = cols * 0.92
      if (m.width > targetW) {
        size = Math.max(8, Math.floor(size * (targetW / m.width)))
        sCtx.font = `700 ${size}px "Space Grotesk", system-ui, sans-serif`
      }
      sCtx.fillText(cleanWord, cols / 2, wordY)

      // subtitle
      if (hasSub && cleanSub) {
        let sSize = Math.max(4, Math.floor(rows * 0.13))
        sCtx.font = `500 ${sSize}px "JetBrains Mono", monospace`
        const sm = sCtx.measureText(cleanSub)
        const sTarget = cols * 0.7
        if (sm.width > sTarget) {
          sSize = Math.max(4, Math.floor(sSize * (sTarget / sm.width)))
          sCtx.font = `500 ${sSize}px "JetBrains Mono", monospace`
        }
        sCtx.fillText(cleanSub, cols / 2, rows * 0.85)
      }

      let data: Uint8ClampedArray
      try {
        // throws on a tainted canvas — fall back to an empty (grid-only) banner
        ;({data} = sCtx.getImageData(0, 0, cols, rows))
      } catch {
        cells = []
        return
      }
      cells = new Array(cols * rows)
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4
          const b = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
          const isLit = b > THRESHOLD
          const char = isLit
            ? ASCII_CHARS[Math.min(ASCII_CHARS.length - 1, Math.floor(b * ASCII_CHARS.length))]
            : ' '
          cells[row * cols + col] = {
            col,
            row,
            char,
            isLit,
            lit: streaming ? false : isLit,
            offsetX: 0,
            offsetY: 0,
            velX: 0,
            velY: 0,
          }
        }
      }
    }

    function drawGridDots() {
      if (!ctx) return
      ctx.fillStyle = GRID_COLOR
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          ctx.fillRect(col * CELL_STEP, row * CELL_STEP, CELL_SIZE, CELL_SIZE)
        }
      }
    }

    function render() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      drawGridDots()
      ctx.font = `${CELL_SIZE + 2}px "JetBrains Mono", monospace`
      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'
      ctx.fillStyle = CHAR_COLOR
      for (let k = 0; k < cells.length; k++) {
        const c = cells[k]
        if (!c.isLit || !c.lit) continue
        const x = (c.col + Math.round(c.offsetX)) * CELL_STEP
        const y = (c.row + Math.round(c.offsetY)) * CELL_STEP
        ctx.fillText(c.char, x + CELL_SIZE / 2, y)
      }
      // leading edge during stream-in
      if (streaming && revealedCols >= 0 && revealedCols < cols) {
        ctx.fillStyle =
          getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
          '#db8c4e'
        const x = revealedCols * CELL_STEP
        ctx.globalAlpha = 0.55
        ctx.fillRect(x, 0, 1, height)
        ctx.globalAlpha = 1
      }
    }

    function updatePhysics() {
      const mx = mouse.col
      const my = mouse.row
      const moving = mouse.isMoving
      for (let k = 0; k < cells.length; k++) {
        const cell = cells[k]
        if (!cell.isLit || !cell.lit) continue
        if (moving) {
          const dx = cell.col + cell.offsetX - mx
          const dy = cell.row + cell.offsetY - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < PUSH_RADIUS && dist > 0) {
            const force = (1 - dist / PUSH_RADIUS) ** 2 * PUSH_FORCE
            cell.velX += (dx / dist) * force
            cell.velY += (dy / dist) * force
          }
        }
        cell.velX += -cell.offsetX * SPRING
        cell.velY += -cell.offsetY * SPRING
        cell.velX *= DAMPING
        cell.velY *= DAMPING
        cell.offsetX += cell.velX
        cell.offsetY += cell.velY
        if (Math.abs(cell.offsetX) < 0.01 && Math.abs(cell.velX) < 0.01) {
          cell.offsetX = cell.velX = 0
        }
        if (Math.abs(cell.offsetY) < 0.01 && Math.abs(cell.velY) < 0.01) {
          cell.offsetY = cell.velY = 0
        }
      }
    }

    function loop() {
      updatePhysics()
      render()
      rafId = requestAnimationFrame(loop)
    }

    function startScramble() {
      scrambleId = setInterval(() => {
        for (let k = 0; k < cells.length; k++) {
          const c = cells[k]
          if (c.isLit && c.lit) c.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        }
      }, 80)
    }

    function streamIn() {
      const colsPerSec = Math.max(60, cols / 1.15) // ~1.15s sweep regardless of width
      let last = performance.now()
      const step = (t: number) => {
        const dt = (t - last) / 1000
        last = t
        revealedCols += colsPerSec * dt
        const upTo = Math.floor(revealedCols)
        for (let k = 0; k < cells.length; k++) {
          const c = cells[k]
          if (c.isLit && !c.lit && c.col <= upTo) c.lit = true
        }
        render()
        if (revealedCols < cols + 4) {
          streamId = requestAnimationFrame(step)
        } else {
          streaming = false
          for (let k = 0; k < cells.length; k++) {
            const c = cells[k]
            if (c.isLit) c.lit = true
          }
          render()
          startScramble()
          loop()
          if (onDoneRef.current) onDoneRef.current()
        }
      }
      streamId = requestAnimationFrame(step)
    }

    function init() {
      setupCanvas()
      sampleText()
      render()
    }

    let cancelled = false
    function start() {
      if (cancelled) return
      init()
      if (reduced) {
        // reduced motion — settle instantly: lit glyphs, no scramble/physics
        streaming = false
        for (let k = 0; k < cells.length; k++) {
          const c = cells[k]
          if (c.isLit) c.lit = true
        }
        render()
        if (onDoneRef.current) onDoneRef.current()
        return
      }
      if (streaming) {
        streamIn()
      } else {
        startScramble()
        loop()
      }
    }

    // wait for fonts so text sampling is accurate
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start)
    } else {
      start()
    }

    // resize — re-init the grid; keep streaming state finished after first reveal
    let resizeT: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(resizeT)
      resizeT = setTimeout(() => {
        cancelAnimationFrame(rafId)
        cancelAnimationFrame(streamId)
        if (scrambleId) clearInterval(scrambleId)
        const wasStreaming = streaming
        revealedCols = wasStreaming ? revealedCols : 9999
        init()
        if (reduced) {
          render()
        } else if (wasStreaming) {
          streamIn()
        } else {
          startScramble()
          loop()
        }
      }, 120)
    }
    window.addEventListener('resize', onResize)

    // mouse
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.col = (e.clientX - rect.left) / CELL_STEP
      mouse.row = (e.clientY - rect.top) / CELL_STEP
      mouse.isMoving = true
      clearTimeout(mouse.idle)
      mouse.idle = setTimeout(() => {
        mouse.isMoving = false
      }, 60)
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches && e.touches[0]
      if (!t) return
      const rect = canvas.getBoundingClientRect()
      mouse.col = (t.clientX - rect.left) / CELL_STEP
      mouse.row = (t.clientY - rect.top) / CELL_STEP
      mouse.isMoving = true
      clearTimeout(mouse.idle)
      mouse.idle = setTimeout(() => {
        mouse.isMoving = false
      }, 90)
    }
    const onLeave = () => {
      mouse.col = mouse.row = -999
      mouse.isMoving = false
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('touchmove', onTouch, {passive: true})
    canvas.addEventListener('touchend', onLeave)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      cancelAnimationFrame(streamId)
      if (scrambleId) clearInterval(scrambleId)
      clearTimeout(resizeT)
      clearTimeout(mouse.idle)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('touchmove', onTouch)
      canvas.removeEventListener('touchend', onLeave)
    }
  }, [animate, cleanWord, cleanSub])

  return (
    <div className="ascii-hero" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="ascii-hero-cap">
        <span className="who" style={{color: 'var(--green)'}}>
          {cleanHandle}
        </span>
        <span style={{color: 'var(--ink-4)'}}>~ %</span>
        <span style={{color: 'var(--ink)'}}>render</span>
        <span style={{color: 'var(--accent)'}}>--hero</span>
        <span style={{color: 'var(--ink-3)'}}>{cleanWord.toLowerCase()}.ascii</span>
      </div>
    </div>
  )
}

export default HeroAscii
