'use client'

/* ============================================================
   HomePage.tsx — live coding-session home page.
   Verbatim TSX port of docs/kokikillara-porfolio/js/home.jsx with
   the boot orchestration from js/app.jsx scoped to this route:
   BootLoader (first load only, in-memory "seen" tracking, skipped
   under prefers-reduced-motion) → HeroAscii sweep → hero stream
   (prompt → think → tool-use → name/bio → success lines) →
   rest stream (selected work → at a glance → next steps) →
   AskConsole reveal. All copy arrives via CMS props.
   ============================================================ */

import {type ReactNode, useEffect, useMemo, useState} from 'react'
import {stegaClean} from 'next-sanity'

import {dataAttr} from '@/sanity/lib/utils'

import AskConsole, {type QaEntry} from '../ask/AskConsole'
import AsciiReveal from './fx/AsciiReveal'
import BootLoader from './fx/BootLoader'
import HeroAscii from './fx/HeroAscii'
import {bootSeen, markBoot, prefersReduced} from './fx/session'
import {shellPrompt, Stream, type StreamStep} from './fx/Streaming'
import type {HomePageQueryResult, HomeSettings} from './queries'
import {FeaturedGrid, MetricsGrid, NextSteps, SystemCard} from './sections'
import {SecHead} from './ui'

const PAGE_ID = 'home'

/* ---------- helpers ---------- */

/* "✓ experience loaded · 15+ years in production" →
   <span.ok>✓</span> experience loaded <span.faint>· …</span> */
function renderOutLine(raw: string, key: number): ReactNode {
  let rest = raw
  let glyph: ReactNode = null
  if (rest.startsWith('✓')) {
    glyph = <span className="ok">✓</span>
    rest = rest.slice(1).trimStart()
  } else if (rest.startsWith('●')) {
    glyph = <span className="warn">●</span>
    rest = rest.slice(1).trimStart()
  }
  const dot = rest.indexOf(' · ')
  if (dot >= 0) {
    const main = rest.slice(0, dot)
    const faint = rest.slice(dot + 1).trimStart()
    return (
      <span key={key}>
        {glyph} {main} <span className="faint">{faint}</span>
      </span>
    )
  }
  return (
    <span key={key}>
      {glyph} {rest}
    </span>
  )
}

function interpolateCounts(line: string, projects: number, posts: number): string {
  return line.replace('{projects}', String(projects)).replace('{posts}', String(posts))
}

/* ---------- entry ---------- */

export default function HomePage({
  home,
  qaEntries,
}: {
  home: HomePageQueryResult | null
  qaEntries: QaEntry[]
}) {
  if (!home || !home.settings) {
    // dataset not seeded yet — render an empty shell, editable via Presentation
    return <div className="page" />
  }
  return <HomeSession home={home} settings={home.settings} qaEntries={qaEntries} />
}

/* ---------- boot orchestration (from app.jsx, scoped to this route) ---------- */

function HomeSession({
  home,
  settings,
  qaEntries,
}: {
  home: HomePageQueryResult
  settings: HomeSettings
  qaEntries: QaEntry[]
}) {
  // 'boot' is deterministic for SSR/hydration; the effect resolves
  // reduced-motion and "already seen" before the next paint cycle.
  const [phase, setPhase] = useState<'boot' | 'stream' | 'static'>('boot')

  useEffect(() => {
    // one-shot resolution of reduced-motion / already-seen straight after
    // hydration — deliberate sync state seed, mirrors the template's app.jsx
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (prefersReduced() || bootSeen(PAGE_ID)) setPhase('static')
  }, [])

  const chrome = home.chrome
  const name = stegaClean(settings.name ?? '')
  const brandName = (name.split(/\s+/)[0] || '').toLowerCase()
  const brandMark = brandName.slice(0, 1)
  const bootLines = chrome.bootLines.map((l) =>
    interpolateCounts(stegaClean(l), home.projectCount, home.postCount),
  )

  if (phase === 'boot') {
    return (
      <BootLoader
        lines={bootLines}
        brandMark={brandMark}
        brandName={brandName}
        brandSuffix={chrome.bootBrandSuffix}
        versionLabel={chrome.bootVersionLabel}
        bootingLabel={chrome.bootingLabel}
        readyLabel={chrome.bootReadyLabel}
        onDone={() => setPhase('stream')}
      />
    )
  }

  return (
    <HomeBody
      key={phase}
      home={home}
      settings={settings}
      qaEntries={qaEntries}
      animate={phase === 'stream'}
    />
  )
}

/* ---------- the page body (home.jsx HomePage, verbatim) ---------- */

function HomeBody({
  home,
  settings,
  qaEntries,
  animate,
}: {
  home: HomePageQueryResult
  settings: HomeSettings
  qaEntries: QaEntry[]
  animate: boolean
}) {
  const [asciiDone, setAsciiDone] = useState(!animate)
  const [heroDone, setHeroDone] = useState(!animate)
  const [ready, setReady] = useState(false)

  const chrome = home.chrome
  const handle = stegaClean(settings.handle ?? '')
  const heroLayout = stegaClean(settings.heroLayout)
  const heroWord = stegaClean(home.heroWord ?? '')

  const attrHome = (path: string) =>
    dataAttr({id: home._id, type: home._type, path}).toString()
  const attrSettings = (path: string) =>
    dataAttr({id: settings._id, type: settings._type, path}).toString()

  const toolActions = useMemo(() => home.toolActions ?? [], [home.toolActions])

  const heroSteps = useMemo<StreamStep[]>(
    () => [
      {
        kind: 'prompt',
        segments: shellPrompt(handle, stegaClean(home.promptCommand ?? '')),
        sanity: attrHome('promptCommand'),
      },
      {kind: 'think', duration: 1000},
      {
        kind: 'tools',
        label: chrome.toolsLabel,
        collapsedLabel: chrome.toolUsesLabel.replace('{n}', String(toolActions.length)),
        actions: toolActions,
        sanity: attrHome('toolActions'),
      },
      {
        kind: 'node',
        delay: 520,
        node: (
          <div>
            <h1 className="h-display hero-name" data-sanity={attrSettings('name')}>
              {settings.name}
            </h1>
            <div className="hero-sub" data-sanity={attrSettings('headline')}>
              {settings.headline}
            </div>
            <p className="hero-bio" data-sanity={attrSettings('shortBio')}>
              {settings.shortBio}
            </p>
          </div>
        ),
      },
      {
        kind: 'lines',
        chunk: 90,
        sanity: attrHome('successLines'),
        lines: (home.successLines ?? []).map((l, i) =>
          renderOutLine(
            interpolateCounts(stegaClean(l), home.projectCount, home.postCount),
            i,
          ),
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [home, settings, handle, toolActions],
  )

  /* portrait caption: "▍ k. draganov // IRL.png" → mark / name / tag spans */
  const cap = stegaClean(home.portraitCaption ?? '')
  let capMark = ''
  let capName = cap
  let capTag = ''
  if (capName.startsWith('▍')) {
    capMark = '▍'
    capName = capName.slice(1).trim()
  }
  const slash = capName.indexOf('//')
  if (slash >= 0) {
    capTag = capName.slice(slash).trim()
    capName = capName.slice(0, slash).trim()
  }

  const restSteps = useMemo<StreamStep[]>(
    () => [
      {
        kind: 'node',
        delay: 200,
        gap: 0,
        node: (
          <SecHead
            idx="01"
            title={<span data-sanity={attrHome('featuredHeading')}>{home.featuredHeading}</span>}
          />
        ),
      },
      {
        kind: 'prompt',
        segments: shellPrompt(handle, chrome.featuredPromptCmd, chrome.featuredPromptFlag),
      },
      {kind: 'think', duration: 3000},
      {
        kind: 'node',
        delay: 2000,
        node: (
          <FeaturedGrid
            docId={home._id}
            docType={home._type}
            projects={home.featuredProjects ?? []}
          />
        ),
      },
      {
        kind: 'node',
        delay: 160,
        gap: 52,
        node: (
          <SecHead
            idx="02"
            title={<span data-sanity={attrHome('metricsHeading')}>{home.metricsHeading}</span>}
          />
        ),
      },
      {kind: 'prompt', segments: shellPrompt(handle, chrome.metricsPromptCmd)},
      {kind: 'think', duration: 700},
      {
        kind: 'node',
        delay: 300,
        node: <MetricsGrid docId={home._id} docType={home._type} metrics={home.metrics ?? []} />,
      },
      {
        kind: 'node',
        delay: 160,
        gap: 52,
        node: (
          <SecHead
            idx="03"
            title={<span data-sanity={attrHome('nextStepsHeading')}>{home.nextStepsHeading}</span>}
          />
        ),
      },
      {kind: 'prompt', segments: shellPrompt(handle, chrome.nextStepsPromptCmd)},
      {kind: 'think', duration: 800},
      {
        kind: 'node',
        delay: 200,
        node: <NextSteps docId={home._id} docType={home._type} ctas={home.nextSteps ?? []} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [home, handle],
  )

  const heroBlock = (
    <div className="panel" style={{background: 'var(--bg-1)'}}>
      <div className="panel-head">
        <span className="lights">
          <i />
          <i />
          <i />
        </span>
        <span className="title" data-sanity={attrHome('heroPanelTitle')}>
          {chrome.heroPanelTitle}
        </span>
        <span className="meta" data-sanity={attrHome('heroPanelMeta')}>
          {chrome.heroPanelMeta}
        </span>
      </div>
      <div className="panel-body hero-body">
        <div className="hero-stream">
          <Stream steps={heroSteps} animate={animate} onComplete={() => setHeroDone(true)} />
        </div>
        <aside className="hero-portrait" aria-hidden="true">
          <div className="hero-portrait-frame" data-sanity={attrSettings('portrait')}>
            {settings.portraitUrl && (
              <AsciiReveal
                src={`${stegaClean(settings.portraitUrl)}?w=800&q=80&auto=format`}
                alt={stegaClean(settings.portraitAlt ?? '')}
                columns={40}
              />
            )}
            <div className="hero-portrait-scan" />
            <div className="hero-portrait-grain" />
          </div>
          <div className="hero-portrait-caption" data-sanity={attrHome('portraitCaption')}>
            {capMark && <span className="hp-mark">{capMark}</span>}
            {capName && <span className="hp-name">{capName}</span>}
            {capTag && <span className="hp-tag">{capTag}</span>}
          </div>
        </aside>
      </div>
    </div>
  )

  const askConsole = settings.askConsole != null && settings.askConsole.enabled !== false && (
    <div className="reveal">
      <AskConsole entries={qaEntries} settings={settings.askConsole} handle={handle} />
    </div>
  )

  return (
    <div className="page">
      <div data-sanity={attrHome('heroWord')}>
        <HeroAscii
          word={heroWord}
          animate={animate}
          onDone={() => setAsciiDone(true)}
          capWho={handle}
          capCmd={chrome.asciiCapCmd}
          capFlag={chrome.asciiCapFlag}
        />
      </div>

      {asciiDone &&
        (heroLayout === 'split' ? (
          <div className="hero-split">
            {heroBlock}
            <div className="reveal hide-on-narrow">
              <SystemCard
                docId={home._id}
                docType={home._type}
                card={home.systemCard}
                settings={settings}
              />
            </div>
          </div>
        ) : (
          heroBlock
        ))}

      <div style={{marginTop: 40}}>
        {heroDone && (
          <Stream
            steps={restSteps}
            animate={animate}
            onComplete={() => {
              markBoot(PAGE_ID)
              setReady(true)
            }}
          />
        )}
      </div>

      {ready && askConsole}
    </div>
  )
}
