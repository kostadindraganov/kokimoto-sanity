'use client'

/* ============================================================
   Streaming.tsx — Claude-Code-style streaming engine.
   Verbatim TSX port of docs/kokikillara-porfolio/js/streaming.jsx.
   Primitives: Spinner, Cursor, Typewriter, StaticPrompt,
   PromptView, ToolUseBlock, LinesView, NodeView, ThinkingView
   + <Stream> timeline orchestrator + shellPrompt helper.
   Extension over the template: each step accepts an optional
   `sanity` string (a data-sanity attribute payload) so CMS
   fields stay click-to-editable in Presentation.
   NOTE: swap imports to app/components/portfolio/fx/* once the
   frontend-foundation workstream lands its canonical fx port.
   ============================================================ */

import {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react'

export const BRAILLE = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

/* latest-ref pattern (assignment deferred to an effect per react-hooks/refs) */
function useLatest<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref
}

export interface PromptSegment {
  t: string
  c?: string
}

export type StreamStep = {
  id?: string
  gap?: number
  sanity?: string
} & (
  | {kind: 'prompt'; segments: PromptSegment[]}
  | {kind: 'think'; duration?: number}
  | {kind: 'tools'; label?: string; collapsedLabel?: string; actions: string[]}
  | {kind: 'lines'; lines: ReactNode[]; chunk?: number}
  | {kind: 'node'; node: ReactNode; delay?: number}
)

type StepState = 'active' | 'settled'

/* ---------- Cursor ---------- */
export function Cursor({thin}: {thin?: boolean}) {
  return <span className={'cursor' + (thin ? ' thin' : '')} aria-hidden="true" />
}

/* ---------- Spinner (braille) ---------- */
export function Spinner() {
  const [f, setF] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setF((x) => (x + 1) % BRAILLE.length), 80)
    return () => clearInterval(id)
  }, [])
  return <span className="spin">{BRAILLE[f]}</span>
}

/* ---------- Typewriter (multi-segment, colored) ---------- */
export function Typewriter({
  segments,
  speed = 16,
  onDone,
}: {
  segments: PromptSegment[]
  speed?: number
  onDone?: () => void
}) {
  const chars = useMemo(() => {
    const out: {ch: string; c?: string}[] = []
    segments.forEach((s) => {
      for (const ch of s.t) out.push({ch, c: s.c})
    })
    return out
  }, [segments])
  const [n, setN] = useState(0)
  const doneRef = useLatest(onDone)
  useEffect(() => {
    let i = 0
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      i++
      setN(i)
      if (i < chars.length) t = setTimeout(tick, speed + Math.random() * speed)
      else if (doneRef.current) doneRef.current()
    }
    t = setTimeout(tick, speed)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars])
  const shown = chars.slice(0, n)
  // group consecutive same-color chars
  const groups: {c?: string; t: string}[] = []
  shown.forEach((c) => {
    const last = groups[groups.length - 1]
    if (last && last.c === c.c) last.t += c.ch
    else groups.push({c: c.c, t: c.ch})
  })
  return (
    <span>
      {groups.map((g, i) => (
        <span key={i} className={g.c || ''}>
          {g.t}
        </span>
      ))}
      {n < chars.length && <Cursor />}
    </span>
  )
}

export function StaticPrompt({segments}: {segments: PromptSegment[]}) {
  return (
    <span>
      {segments.map((s, i) => (
        <span key={i} className={s.c || ''}>
          {s.t}
        </span>
      ))}
    </span>
  )
}

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
  collapsedLabel,
  actions,
  state,
  onDone,
}: {
  label?: string
  collapsedLabel?: string
  actions: string[]
  state: StepState
  onDone?: () => void
}) {
  const animate = state === 'active'
  const [running, setRunning] = useState(animate ? 0 : actions.length)
  const [collapsed, setCollapsed] = useState(!animate)
  const [open, setOpen] = useState(false) // user expand override
  const doneRef = useLatest(onDone)

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
  }, [animate, actions.length, doneRef])

  const showList = !collapsed || open
  // eslint-disable-next-line react-hooks/purity -- decorative fake tool timings, intentionally random (template behavior)
  const ms = useMemo(() => actions.map(() => 120 + Math.floor(Math.random() * 900)), [actions])

  return (
    <div className="tool reveal">
      <button
        className={'tool-head' + (showList ? ' open' : '')}
        onClick={() => (collapsed ? setOpen((o) => !o) : null)}
        aria-expanded={showList}
      >
        <span className="bullet">●</span>
        <span>{collapsed ? collapsedLabel || label : label}</span>
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
  const doneRef = useLatest(onDone)
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
  const doneRef = useLatest(onDone)
  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => doneRef.current && doneRef.current(), delay)
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
  const [t0] = useState(() => (typeof performance !== 'undefined' ? performance.now() : 0))
  const [now, setNow] = useState(0)
  const doneRef = useLatest(onDone)

  useEffect(() => {
    if (!animate) return
    const swap = setInterval(() => setPhrase((p) => (p + 1) % THINK_PHRASES.length), 280)
    const tick = setInterval(() => setNow(performance.now()), 60)
    const done = setTimeout(() => doneRef.current && doneRef.current(), duration)
    return () => {
      clearInterval(swap)
      clearInterval(tick)
      clearTimeout(done)
    }
  }, [animate, duration, doneRef])

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
  const onCompleteRef = useLatest(onComplete)

  // when not animating, every step renders settled (derived — no state sync)
  const shownActive = animate ? active : steps.length

  const advance = useCallback(() => {
    setActive((a) => {
      const n = a + 1
      if (n >= steps.length && !completedRef.current) {
        completedRef.current = true
        setTimeout(() => onCompleteRef.current && onCompleteRef.current(), 0)
      }
      return n
    })
  }, [steps.length, onCompleteRef])

  // if not animating, fire complete once
  useEffect(() => {
    if (!animate && !completedRef.current) {
      completedRef.current = true
      if (onCompleteRef.current) onCompleteRef.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // token meter — increments while stream is active, freezes when settled
  useEffect(() => {
    if (!animate) return
    if (startRef.current == null) startRef.current = performance.now()
    if (shownActive >= steps.length) return
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      setTokens((t) => t + Math.max(1, Math.floor(36 * dt + Math.random() * 6)))
      setElapsed((now - (startRef.current ?? now)) / 1000)
    }, 70)
    return () => clearInterval(id)
  }, [animate, active, shownActive, steps.length])

  const streaming = animate && shownActive < steps.length

  return (
    <div className="stream">
      {steps.map((s, i) => {
        if (i > shownActive) return null
        const state: StepState = i < shownActive ? 'settled' : animate ? 'active' : 'settled'
        const wrap = (child: ReactNode) => (
          <div
            key={s.id || i}
            style={{marginTop: i === 0 ? 0 : s.gap != null ? s.gap : 18}}
            data-sanity={s.sanity}
          >
            {child}
          </div>
        )
        if (s.kind === 'prompt')
          return wrap(<PromptView segments={s.segments} state={state} onDone={advance} />)
        if (s.kind === 'tools')
          return wrap(
            <ToolUseBlock
              label={s.label}
              collapsedLabel={s.collapsedLabel}
              actions={s.actions}
              state={state}
              onDone={advance}
            />,
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
