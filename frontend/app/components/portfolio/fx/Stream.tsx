'use client'

/* ============================================================
   Stream.tsx — Claude-Code-style streaming engine
   Ported 1:1 from the template's streaming.jsx.
   Primitives: PromptView, ToolUseBlock, LinesView, NodeView,
   ThinkingView  +  <Stream> timeline orchestrator.
   ============================================================ */

import type {ReactNode} from 'react'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'

import {Cursor} from './Cursor'
import {Spinner} from './Spinner'
import type {PromptSegment} from './Typewriter'
import {StaticPrompt, Typewriter} from './Typewriter'

type StepState = 'active' | 'settled'

/* ---------- Prompt line ---------- */
export function PromptView({
  segments,
  state,
  onDone,
}: {
  segments: PromptSegment[]
  state: StepState
  onDone?: () => void
}) {
  return (
    <div className="prompt">
      {state === 'active' ? (
        <Typewriter segments={segments} speed={16} onDone={onDone} />
      ) : (
        <StaticPrompt segments={segments} />
      )}
    </div>
  )
}

/* ---------- Tool-use block ---------- */
export function ToolUseBlock({
  label,
  actions,
  state,
  onDone,
}: {
  label?: string
  actions: string[]
  state: StepState
  onDone?: () => void
}) {
  const animate = state === 'active'
  const [running, setRunning] = useState(animate ? 0 : actions.length)
  const [collapsed, setCollapsed] = useState(!animate)
  const [open, setOpen] = useState(false) // user expand override
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (!animate) return
    let idx = 0
    let t: ReturnType<typeof setTimeout>
    const step = () => {
      idx++
      setRunning(idx)
      if (idx < actions.length) {
        t = setTimeout(step, 180 + Math.random() * 140)
      } else {
        t = setTimeout(() => {
          setCollapsed(true)
          if (doneRef.current) doneRef.current()
        }, 280)
      }
    }
    t = setTimeout(step, 220)
    return () => clearTimeout(t)
  }, [animate, actions.length])

  const showList = !collapsed || open
  // decorative fake durations — intentionally random once per action list
  // eslint-disable-next-line react-hooks/purity
  const ms = useMemo(() => actions.map(() => 120 + Math.floor(Math.random() * 900)), [actions])

  return (
    <div className="tool reveal">
      <button
        className={'tool-head' + (showList ? ' open' : '')}
        onClick={() => (collapsed ? setOpen((o) => !o) : null)}
        aria-expanded={showList}
      >
        <span className="bullet">●</span>
        <span>{collapsed ? `${actions.length} tool uses` : label || 'running tools'}</span>
        {collapsed && <span className="chev">›</span>}
      </button>
      {showList && (
        <div className="tool-list">
          {actions.map((a, i) => {
            const done = i < running
            const run = i === running && animate
            return (
              <div key={i} className={'tool-line' + (done ? ' done' : run ? ' run' : '')}>
                <span className="ic">{done ? '✓' : run ? <Spinner /> : '·'}</span>
                <span>{a}</span>
                {done && <span className="ms">{ms[i]}ms</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ---------- Lines view (reveal line-by-line) ---------- */
export function LinesView({
  lines,
  state,
  onDone,
  chunk = 55,
}: {
  lines: ReactNode[]
  state: StepState
  onDone?: () => void
  chunk?: number
}) {
  const animate = state === 'active'
  const [k, setK] = useState(animate ? 0 : lines.length)
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])
  useEffect(() => {
    if (!animate) return
    let i = 0
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      i++
      setK(i)
      if (i < lines.length) t = setTimeout(tick, chunk + Math.random() * 25)
      else if (doneRef.current) doneRef.current()
    }
    t = setTimeout(tick, chunk)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate])
  return (
    <div className="out">
      {lines.slice(0, k).map((ln, i) => (
        <div key={i} className="ln reveal">
          {ln}
          {animate && i === k - 1 && k < lines.length && <Cursor thin />}
        </div>
      ))}
    </div>
  )
}

/* ---------- Node view (custom JSX body, reveal + advance) ---------- */
export function NodeView({
  node,
  state,
  onDone,
  delay = 360,
}: {
  node: ReactNode
  state: StepState
  onDone?: () => void
  delay?: number
}) {
  const animate = state === 'active'
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])
  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => {
      if (doneRef.current) doneRef.current()
    }, delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate])
  return <div className={animate ? 'reveal' : ''}>{node}</div>
}

/* ---------- Thinking view (Claude-Code-style pause before responding) ---------- */
const THINK_PHRASES = ['Thinking', 'Pondering', 'Synthesizing', 'Composing', 'Reasoning']
export function ThinkingView({
  state,
  onDone,
  duration = 1000,
}: {
  state: StepState
  onDone?: () => void
  duration?: number
}) {
  const animate = state === 'active'
  const [phrase, setPhrase] = useState(0)
  const [t0] = useState(() => performance.now())
  const [now, setNow] = useState(0)
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (!animate) return
    const swap = setInterval(() => setPhrase((p) => (p + 1) % THINK_PHRASES.length), 280)
    const tick = setInterval(() => setNow(performance.now()), 60)
    const done = setTimeout(() => {
      if (doneRef.current) doneRef.current()
    }, duration)
    return () => {
      clearInterval(swap)
      clearInterval(tick)
      clearTimeout(done)
    }
  }, [animate, duration])

  if (!animate) return null
  const sec = Math.max(0.1, Math.min(duration / 1000, (now - t0) / 1000))
  return (
    <div className="think" role="status" aria-live="polite">
      <span className="think-glyph">✻</span>
      <span className="think-label">{THINK_PHRASES[phrase]}…</span>
      <span className="think-meta tnum">({sec.toFixed(1)}s · esc to interrupt)</span>
    </div>
  )
}

/* ---------- <Stream> timeline orchestrator ---------- */
export type StreamStep =
  | {kind: 'prompt'; id?: string; gap?: number; segments: PromptSegment[]}
  | {kind: 'tools'; id?: string; gap?: number; label?: string; actions: string[]}
  | {kind: 'lines'; id?: string; gap?: number; lines: ReactNode[]; chunk?: number}
  | {kind: 'node'; id?: string; gap?: number; node: ReactNode; delay?: number}
  | {kind: 'think'; id?: string; gap?: number; duration?: number}

export function Stream({
  steps,
  animate,
  onComplete,
  showMeter = true,
}: {
  steps: StreamStep[]
  animate: boolean
  onComplete?: () => void
  showMeter?: boolean
}) {
  const [active, setActive] = useState(animate ? 0 : steps.length)
  const completedRef = useRef(false)
  const [tokens, setTokens] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!animate) {
      // template behavior: settle the whole timeline when animation is off
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(steps.length)
    }
  }, [animate, steps.length])

  const advance = useCallback(() => {
    setActive((a) => {
      const n = a + 1
      if (n >= steps.length && !completedRef.current) {
        completedRef.current = true
        if (onComplete) setTimeout(onComplete, 0)
      }
      return n
    })
  }, [steps.length, onComplete])

  // if not animating, fire complete once
  useEffect(() => {
    if (!animate && !completedRef.current) {
      completedRef.current = true
      if (onComplete) onComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // token meter — increments while stream is active, freezes when settled
  useEffect(() => {
    if (!animate) return
    if (startRef.current == null) startRef.current = performance.now()
    if (active >= steps.length) return
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      setTokens((t) => t + Math.max(1, Math.floor(36 * dt + Math.random() * 6)))
      setElapsed((now - (startRef.current as number)) / 1000)
    }, 70)
    return () => clearInterval(id)
  }, [animate, active, steps.length])

  const streaming = animate && active < steps.length

  return (
    <div className="stream">
      {steps.map((s, i) => {
        if (i > active) return null
        const state: StepState = i < active ? 'settled' : animate ? 'active' : 'settled'
        const wrap = (child: ReactNode) => (
          <div key={s.id || i} style={{marginTop: i === 0 ? 0 : s.gap != null ? s.gap : 18}}>
            {child}
          </div>
        )
        if (s.kind === 'prompt')
          return wrap(<PromptView segments={s.segments} state={state} onDone={advance} />)
        if (s.kind === 'tools')
          return wrap(
            <ToolUseBlock label={s.label} actions={s.actions} state={state} onDone={advance} />,
          )
        if (s.kind === 'lines')
          return wrap(<LinesView lines={s.lines} state={state} onDone={advance} chunk={s.chunk} />)
        if (s.kind === 'node')
          return wrap(<NodeView node={s.node} state={state} onDone={advance} delay={s.delay} />)
        if (s.kind === 'think')
          return wrap(<ThinkingView state={state} onDone={advance} duration={s.duration || 1000} />)
        return null
      })}
      {showMeter && (streaming || (animate && tokens > 0)) && (
        <div className={'stream-meter' + (streaming ? ' live' : ' settled')}>
          <span className="spin">{streaming ? '✻' : '✓'}</span>
          <span className="lbl">{streaming ? 'streaming' : 'complete'}</span>
          <span className="sep">·</span>
          <span className="tnum">{tokens.toLocaleString()}</span>
          <span className="unit">tokens</span>
          <span className="sep">·</span>
          <span className="tnum">{elapsed.toFixed(1)}s</span>
        </div>
      )}
    </div>
  )
}

/* ---------- helper: build a shell prompt segment list ---------- */
export function shellPrompt(handle: string, cmd: string, flag?: string): PromptSegment[] {
  const segs: PromptSegment[] = [
    {t: handle, c: 'who'},
    {t: ':', c: 'pct'},
    {t: '~', c: 'path'},
    {t: ' % ', c: 'pct'},
    {t: cmd, c: 'cmd'},
  ]
  if (flag) segs.push({t: ' ' + flag, c: 'flag'})
  return segs
}

export default Stream
