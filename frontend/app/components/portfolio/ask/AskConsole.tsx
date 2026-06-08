'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {type QaEntry, matchQA} from './kwMatch'
import {NEW_SESSION_EVENT} from '../shell/CommandPalette'

export type {QaEntry}

export interface AskConsoleSettings {
  heading?: string | null
  description?: string | null
  placeholder?: string | null
  emptyMessage?: string | null
  suggestions?: string[] | null
  fallback?: string[] | null
}

interface NavItem {
  label: string
  command: string
  route: string
}

interface HistoryEntry {
  uid: number
  q: string
  lines: string[]
  action?: QaEntry['action']
  tools: string[]
  done: boolean
}

const QA_TOOLS_SETS = [
  ['Searching field notes', 'Matching intent', 'Composing reply'],
  ['Indexing profile.md', 'Ranking answers', 'Streaming response'],
  ['Reading knowledge base', 'Resolving context'],
  ['Grepping ./notes', 'Scoring relevance', 'Drafting'],
]

function qaTools(): string[] {
  return QA_TOOLS_SETS[Math.floor(Math.random() * QA_TOOLS_SETS.length)]
}

let __askUid = 0

/* animated terminal placeholder — scrambles in left→right */
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
      <span className="ask-ph-cursor">&#9613;</span>
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

/* tool-use animation block */
function ToolBlock({tools, done}: {tools: string[]; done: boolean}) {
  return (
    <div className="tool">
      <div className="tool-head">
        <span className={done ? 'ok' : 'acc'} style={{marginRight: 8}}>
          {done ? '✓' : '◌'}
        </span>
        <span className="faint">running tools</span>
      </div>
      {tools.map((t, i) => (
        <div key={i} className="tool-line">
          <span className="faint">  └─ </span>
          {t}
        </div>
      ))}
    </div>
  )
}

/* streamed answer lines */
function AnswerLines({lines, done, onDone}: {lines: string[]; done: boolean; onDone: () => void}) {
  const [shown, setShown] = useState<string[]>(done ? lines : [])
  const [settled, setSettled] = useState(done)

  useEffect(() => {
    if (done) return
    let i = 0
    const id = setInterval(() => {
      i++
      setShown(lines.slice(0, i))
      if (i >= lines.length) {
        clearInterval(id)
        setSettled(true)
        onDone()
      }
    }, 38)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="out" style={{marginTop: 10}}>
      {shown.map((line, i) => (
        <div key={i} className="muted">
          {line}
        </div>
      ))}
      {!settled && <span className="cursor" style={{display: 'inline-block'}} />}
    </div>
  )
}

/* think pill */
function ThinkPill() {
  return (
    <div className="think" style={{marginBottom: 8}}>
      <span className="think-glyph">●</span> thinking
    </div>
  )
}

/* single Q/A entry renderer */
function EntryView({
  entry,
  handle,
  onDone,
}: {
  entry: HistoryEntry
  handle: string
  onDone: () => void
}) {
  const [phase, setPhase] = useState<'think' | 'tools' | 'lines'>(entry.done ? 'lines' : 'think')

  useEffect(() => {
    if (entry.done) return
    const t1 = setTimeout(() => setPhase('tools'), 1200)
    const t2 = setTimeout(() => setPhase('lines'), 2400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [entry.done])

  return (
    <div className="qa-entry">
      <div className="q-echo">
        <span className="who">{handle}</span>
        <span className="pct">:~ %</span>
        <span className="q"> {entry.q}</span>
      </div>
      <div className="qa-answer">
        {!entry.done && phase === 'think' && <ThinkPill />}
        {(phase === 'tools' || phase === 'lines') && (
          <ToolBlock tools={entry.tools} done={phase === 'lines' || entry.done} />
        )}
        {phase === 'lines' && (
          <AnswerLines lines={entry.lines} done={entry.done} onDone={onDone} />
        )}
        {phase === 'lines' && entry.action?.route && (
          <div style={{marginTop: 14}}>
            <button
              className="btn ghost"
              onClick={() => {
                if (entry.action?.route) {
                  window.location.href = '/' + entry.action.route
                }
              }}
            >
              <span className="car">›</span> {entry.action.cmd}
              {entry.action.flag && <span className="flag" style={{marginLeft: 8}}>{entry.action.flag}</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export interface AskConsoleProps {
  entries: QaEntry[]
  settings: AskConsoleSettings
  handle: string
  navItems?: NavItem[]
}

export default function AskConsole({entries, settings, handle, navItems = []}: AskConsoleProps) {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [focus, setFocus] = useState(false)
  const [hist, setHist] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const fallback = useMemo(
    () => settings.fallback ?? ["I don't have a note on that yet — try asking about experience, stack, or availability."],
    [settings.fallback],
  )

  const placeholder = useMemo(() => {
    const raw = settings.placeholder ?? 'Ask me something'
    return stegaClean(raw)
  }, [settings.placeholder])

  const suggestions = useMemo(() => (settings.suggestions ?? []).slice(0, 6), [settings.suggestions])

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() =>
      window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'}),
    )
  }, [])

  const markDone = useCallback((uid: number) => {
    setHistory((es) => es.map((e) => (e.uid === uid ? {...e, done: true} : e)))
    scrollBottom()
  }, [scrollBottom])

  const push = useCallback(
    (q: string, lines: string[], opts: {action?: QaEntry['action']; noTools?: boolean} = {}) => {
      const uid = ++__askUid
      setHistory((es) => [
        ...es,
        {uid, q, lines, action: opts.action, tools: opts.noTools ? [] : qaTools(), done: false},
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
        setHistory([])
        return
      }

      if (lower === 'ls' || lower === 'ls ./' || lower === 'ls .') {
        const routes = navItems.length
          ? navItems.map((n) => n.route + '/').join('   ')
          : 'home/   portfolio/   about/   blog/   contact/'
        push(text, [routes], {noTools: true})
        return
      }

      // Navigation commands like /home, /portfolio etc.
      const navMap: Record<string, string> = {}
      navItems.forEach((n) => {
        navMap['/' + n.route] = n.route
        navMap[n.route] = n.route
        if (n.command) navMap[n.command] = n.route
      })
      // Fallback defaults
      const defaultNavMap: Record<string, string> = {
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
      const merged = {...defaultNavMap, ...navMap}
      if (merged[lower]) {
        push(text, ['→ opening /' + merged[lower] + ' …'], {noTools: true})
        setTimeout(() => router.push('/' + merged[lower]), 280)
        return
      }

      const res = matchQA(entries, fallback, text)
      push(text, res.lines, {action: res.action})
    },
    [entries, fallback, navItems, push, router],
  )

  // "New session" (command palette / mobile console) resets the ask console:
  // clears the previous answers and the input back to the empty listening state.
  useEffect(() => {
    const reset = () => {
      setHistory([])
      setInput('')
      setHist([])
      setHistIdx(-1)
    }
    window.addEventListener(NEW_SESSION_EVENT, reset)
    return () => window.removeEventListener(NEW_SESSION_EVENT, reset)
  }, [])

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

  // suppress unused warning
  void histIdx

  return (
    <section className="ask-wrap" aria-label="Ask the console">
      <div className="sec-head">
        <span className="idx">»</span>
        <h2>ask the console</h2>
      </div>
      {settings.description && (
        <p className="muted" style={{fontSize: 13, margin: '-6px 0 18px', maxWidth: '64ch'}}>
          {settings.description}
        </p>
      )}

      {history.length === 0 ? (
        <div className="qa-empty">
          {'// '}{settings.emptyMessage ?? 'session listening — the prompt is at the bottom.'}
        </div>
      ) : (
        <div className="qa-transcript">
          {history.map((e) => (
            <EntryView
              key={e.uid}
              entry={e}
              handle={handle}
              onDone={() => markDone(e.uid)}
            />
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
            <span className="ret">&#8629;</span>
          </div>
        </form>
      </div>
    </section>
  )
}
