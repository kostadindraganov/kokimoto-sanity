'use client'

import {useEffect, useMemo, useRef, useState} from 'react'

import {Cursor} from './Cursor'

/** One colored segment of a prompt/typewriter line. `c` is a CSS class (who/path/cmd/flag/…). */
export type PromptSegment = {t: string; c?: string}

/** Multi-segment colored typewriter (template: streaming.jsx). */
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
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])
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

/** Settled (non-animated) render of the same segment list. */
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

export default Typewriter
