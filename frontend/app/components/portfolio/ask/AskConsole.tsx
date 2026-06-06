'use client'

/* ============================================================
   AskConsole.tsx — interactive Claude-Code-style Q&A REPL.
   Ported 1:1 from ask-console.jsx + qa.jsx (keyword matcher).
   Entries are fetched server-side and passed as props.
   ============================================================ */

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'

import type {AskConsoleSettings, QaEntry} from '@/app/components/portfolio/about/types'

// ---------- keyword matcher (ported from qa.jsx) ----------

function kwScore(entry: QaEntry, query: string): number {
  const q = query.toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  let score = 0
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase()
    if (q === k) score += 12
    else if (q.includes(k) || k.includes(q)) score += 6
    else {
      for (const w of words) {
        if (k.includes(w) || w.includes(k)) score += 3
      }
    }
  }
  return score
}

function matchQA(
  entries: QaEntry[],
  query: string,
  fallback: string[],
): {lines: string[]; action?: QaEntry['action']} {
  if (!entries.length) return {lines: fallback.length ? fallback : ['No answer found.']}
  const scored = entries
    .map((e) => ({e, s: kwScore(e, query)}))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
  if (!scored.length) return {lines: fallback.length ? fallback : ['No answer found.']}
  const best = scored[0].e
  return {lines: best.answer, action: best.action ?? undefined}
}

function qaTools(): string[] {
  const pool = [
    'read_file(notes.md)',
    'search_docs(profile)',
    'grep -r "experience"',
    'cat timeline.json',
    'ls ./stack',
    'inspect engineering-values.json',
  ]
  const n = 1 + Math.floor(Math.random() * 2)
  return pool.sort(() => Math.random() - 0.5).slice(0, n)
}

// ---------- Animated placeholder ----------

function AskPlaceholder({text}: {text: string}) {
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%*+=:.'
  const [chars, setChars] = useState<string[]>(() => text.split(''))

  useEffect(() => {
    let settle: ReturnType<typeof setInterval> | null = null
    let loop: ReturnType<typeof setInterval> | null = null
    const scramble = () => {
      let frame = 0
      if (settle) clearInterval(settle)
      settle = setInterval(() => {
        frame++
        const settled = frame / 2
        setChars(
          text.split('').map((ch, i) => {
            if (ch === ' ') return ' '
            if (i < settled) return ch
            return GLYPHS[(Math.random() * GLYPHS.length) | 0]
          }),
        )
        if (settled >= text.length + 1) {
          if (settle) clearInterval(settle)
          setChars(text.split(''))
        }
      }, 38)
    }
    scramble()
    loop = setInterval(scramble, 5200)
    return () => {
      if (settle) clearInterval(settle)
      if (loop) clearInterval(loop)
    }
  }, [text])

  return (
    <span className="ask-ph" aria-hidden="true">
      <span className="ask-ph-cursor">▍</span>
      <span className="ask-ph-text">
        {chars.map((ch, i) => (
          <span key={i} className="ask-ph-ch" style={{animationDelay: i * 55 + 'ms'}}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </span>
  )
}

// ---------- Answer stream (inline, avoids circular dep on Stream) ----------

type QaQueueEntry = {
  uid: number
  q: string
  lines: string[]
  action?: QaEntry['action']
  tools: string[] | null
  done: boolean
}

function AnswerLines({lines, animate, onDone}: {lines: string[]; animate: boolean; onDone: () => void}) {
  const [shown, setShown] = useState(animate ? 0 : lines.length)
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
      setShown(i)
      if (i < lines.length) t = setTimeout(tick, 38 + Math.random() * 25)
      else doneRef.current()
    }
    t = setTimeout(tick, 38)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate])

  return (
    <div className="out">
      {lines.slice(0, shown).map((ln, i) => (
        <div key={i} className="ln reveal muted">
          {ln}
        </div>
      ))}
    </div>
  )
}

function AnswerStream({
  entry,
  animate,
  onDone,
}: {
  entry: QaQueueEntry
  animate: boolean
  onDone: () => void
}) {
  const [phase, setPhase] = useState<'tools' | 'lines'>(
    entry.tools && entry.tools.length > 0 && animate ? 'tools' : 'lines',
  )
  const [toolsDone, setToolsDone] = useState(!entry.tools || !animate)
  const [toolRunning, setToolRunning] = useState(animate ? 0 : (entry.tools?.length ?? 0))
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (!animate || !entry.tools || entry.tools.length === 0) return
    let idx = 0
    let t: ReturnType<typeof setTimeout>
    const step = () => {
      idx++
      setToolRunning(idx)
      if (idx < (entry.tools?.length ?? 0)) {
        t = setTimeout(step, 180 + Math.random() * 140)
      } else {
        t = setTimeout(() => {
          setToolsDone(true)
          setPhase('lines')
        }, 280)
      }
    }
    t = setTimeout(step, 220)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate])

  return (
    <div className="qa-answer-inner">
      {entry.tools && entry.tools.length > 0 && (
        <div className="tool reveal" style={{marginBottom: 10}}>
          <div className="tool-head open">
            <span className="bullet">●</span>
            <span>{toolsDone ? `${entry.tools.length} tool uses` : 'running tools'}</span>
          </div>
          {!toolsDone && (
            <div className="tool-list">
              {entry.tools.map((a, i) => {
                const done = i < toolRunning
                const run = i === toolRunning && animate
                return (
                  <div key={i} className={'tool-line' + (done ? ' done' : run ? ' run' : '')}>
                    <span className="ic">{done ? '✓' : '·'}</span>
                    <span>{a}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      {(phase === 'lines' || !animate) && (
        <AnswerLines lines={entry.lines} animate={animate && !entry.done} onDone={onDone} />
      )}
      {entry.action && entry.done && (
        <div style={{marginTop: 14}}>
          <button
            className={'btn' + (entry.action.cmd ? ' ghost' : '')}
            onClick={() => {
              if (entry.action?.route) {
                window.location.href = '/' + entry.action.route.replace(/^\//, '')
              }
            }}
          >
            <span className="car">›</span>
            {entry.action.cmd}
            {entry.action.flag && <span className="flag"> {entry.action.flag}</span>}
          </button>
        </div>
      )}
    </div>
  )
}

// ---------- AskConsole ----------

let __uid = 0

export interface AskConsoleProps {
  entries: QaEntry[]
  settings: AskConsoleSettings
  handle: string
}

export function AskConsole({entries, settings, handle}: AskConsoleProps) {
  const [input, setInput] = useState('')
  const [queue, setQueue] = useState<QaQueueEntry[]>([])
  const [focus, setFocus] = useState(false)
  const [hist, setHist] = useState<string[]>([])
  const [, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const fallback = useMemo(() => settings.fallback ?? [], [settings.fallback])
  const suggestions = useMemo(() => (settings.suggestions ?? []).slice(0, 6), [settings.suggestions])

  const placeholder = settings.placeholder ?? 'Ask me something'
  const emptyMessage = settings.emptyMessage ?? '// session listening — the prompt is at the bottom.'

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() =>
      window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'}),
    )
  }, [])

  const markDone = useCallback((uid: number) => {
    setQueue((qs) => qs.map((e) => (e.uid === uid ? {...e, done: true} : e)))
  }, [])

  const push = useCallback(
    (q: string, lines: string[], action?: QaEntry['action'], noTools?: boolean) => {
      const uid = ++__uid
      setQueue((qs) => [
        ...qs,
        {
          uid,
          q,
          lines,
          action,
          tools: noTools ? null : qaTools(),
          done: false,
        },
      ])
      scrollBottom()
    },
    [scrollBottom],
  )

  const run = useCallback(
    (raw: string) => {
      const text = (raw || '').trim()
      if (!text) return
      setHist((h) => [text, ...h].slice(0, 40))
      setHistIdx(-1)
      setInput('')

      const lower = text.toLowerCase()
      if (lower === 'clear' || lower === 'cls') {
        setQueue([])
        return
      }
      if (lower === 'ls' || lower === 'ls ./' || lower === 'ls .') {
        push(text, ['home/   portfolio/   about/   blog/   contact/'], undefined, true)
        return
      }
      const navMap: Record<string, string> = {
        '/home': 'home',
        '/portfolio': 'portfolio',
        '/about': 'about',
        '/blog': 'blog',
        '/contact': 'contact',
        home: 'home',
        portfolio: 'portfolio',
        about: 'about',
        blog: 'blog',
        contact: 'contact',
      }
      if (navMap[lower]) {
        push(text, ['→ opening /' + navMap[lower] + ' …'], undefined, true)
        setTimeout(() => {
          window.location.href = '/' + navMap[lower]
        }, 280)
        return
      }
      const res = matchQA(entries, text, fallback)
      push(text, res.lines, res.action ?? undefined)
    },
    [entries, fallback, push],
  )

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistIdx((i) => {
        const n = Math.min(i + 1, hist.length - 1)
        if (hist[n] != null) setInput(hist[n])
        return n
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIdx((i) => {
        const n = Math.max(i - 1, -1)
        setInput(n === -1 ? '' : hist[n] || '')
        return n
      })
    }
  }

  const heading = settings.heading ?? 'ask the console'
  const description =
    settings.description ??
    "A live session — type below and it answers like a Claude-Code CLI, from Kostadin's notes. Replies stream in above the prompt. Try a suggestion, or ask about experience, stack, or values."

  return (
    <section className="ask-wrap" aria-label={heading}>
      <div className="sec-head">
        <span className="idx">»</span>
        <h2>{heading}</h2>
        <span className="rule" aria-hidden="true" />
      </div>
      <p className="muted" style={{fontSize: 13, margin: '-6px 0 18px', maxWidth: '64ch'}}>
        {description}
      </p>

      {queue.length === 0 ? (
        <div className="qa-empty">{emptyMessage}</div>
      ) : (
        <div className="qa-transcript">
          {queue.map((e) => (
            <div key={e.uid} className="qa-entry">
              <div className="q-echo">
                <span className="who">{handle}</span>
                <span className="pct">:~ %</span>
                <span className="q"> {e.q}</span>
              </div>
              <div className="qa-answer">
                <AnswerStream
                  entry={e}
                  animate={!e.done}
                  onDone={() => markDone(e.uid)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ask-dock">
        <div className="ask-suggest">
          {suggestions.map((s, i) => (
            <button key={i} className="s" onClick={() => run(s)}>
              <span className="q">?</span>
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            run(input)
          }}
        >
          <div
            className={'ask-input-row' + (focus ? ' focus' : '')}
            onClick={() => inputRef.current?.focus()}
          >
            <span className="who">{handle}</span>
            <span className="pct">:~ %</span>
            <span className="ask-field">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                aria-label="Ask a question"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {!focus && input.length === 0 && <AskPlaceholder text={placeholder} />}
            </span>
            <span className="ret">↵</span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AskConsole
