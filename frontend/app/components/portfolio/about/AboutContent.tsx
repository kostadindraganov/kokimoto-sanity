'use client'

/* ============================================================
   AboutContent.tsx — client component for /about
   Ported 1:1 from about.jsx template.
   All copy from CMS props, no hardcoded strings.
   useOptimistic: timeline[], values[], stackRows[], ctas[]
   dataAttr on bioParagraphs container and all field wrappers
   ============================================================ */

import {useOptimistic} from 'react'
import type {CreateDataAttribute, CreateDataAttributeProps} from 'next-sanity'

import type {
  AboutPageData,
  AskConsoleSettings,
  CtaCommand,
  QaEntry,
  StackRow,
  TimelineEntry,
  ValueItem,
} from '@/app/components/portfolio/about/types'
import AskConsole from '@/app/components/portfolio/ask/AskConsole'

// ---------- helpers ----------

/**
 * Builds the data-sanity spread object for a field path.
 * Returns an empty object when da is null (published/no stega).
 */
function attr(
  da: CreateDataAttribute<CreateDataAttributeProps & {id: string; type: string}> | null,
  path: string,
): {'data-sanity'?: string} {
  if (!da) return {}
  return {'data-sanity': (da as (path: string) => string)(path)}
}

// ---------- Sub-components ----------

function SecHead({idx, title}: {idx: string; title: string}) {
  return (
    <div className="sec-head">
      <span className="idx">{idx}</span>
      <h2>{title}</h2>
      <span className="rule" aria-hidden="true" />
    </div>
  )
}

function ShellPrompt({handle, promptText}: {handle: string; promptText: string}) {
  return (
    <div className="prompt">
      <span className="who">{handle}</span>
      <span className="pct">:</span>
      <span className="path">~</span>
      <span className="pct"> % </span>
      <span className="cmd">{promptText}</span>
      <span className="cursor" aria-hidden="true" />
    </div>
  )
}

function ValuesPanel({
  values,
  da,
}: {
  values: ValueItem[]
  da: CreateDataAttribute<CreateDataAttributeProps & {id: string; type: string}> | null
}) {
  return (
    <div className="panel" style={{background: 'var(--bg)'}}>
      <div className="panel-head">
        <span className="lights">
          <i />
          <i />
          <i />
        </span>
        <span className="title">engineering-values.json</span>
        <span className="meta">read-only</span>
      </div>
      <div
        className="panel-body"
        style={{fontSize: 13.5, lineHeight: 1.9}}
        {...attr(da, 'values')}
      >
        <div className="faint">{'{'}</div>
        {values.map((v, i) => (
          <div
            key={v._key}
            style={{paddingLeft: 22}}
            {...attr(da, `values[_key=="${v._key}"]`)}
          >
            <span className="warn">&quot;{v.key}&quot;</span>
            <span className="faint">: </span>
            <span className="muted">&quot;{v.value}&quot;</span>
            <span className="faint">{i < values.length - 1 ? ',' : ''}</span>
          </div>
        ))}
        <div className="faint">{'}'}</div>
      </div>
    </div>
  )
}

// ---------- Props ----------

export interface AboutContentProps {
  page: AboutPageData
  qaEntries: QaEntry[]
  askSettings: AskConsoleSettings
  handle: string
  dataAttr: CreateDataAttribute<CreateDataAttributeProps & {id: string; type: string}> | null
  stega: boolean
}

// ---------- AboutContent ----------

export function AboutContent({
  page,
  qaEntries,
  askSettings,
  handle,
  dataAttr,
}: AboutContentProps) {
  const da = dataAttr

  // useOptimistic for keyed arrays
  const [timeline] = useOptimistic<TimelineEntry[]>(page.timeline ?? [])
  const [values] = useOptimistic<ValueItem[]>(page.values ?? [])
  const [stackRows] = useOptimistic<StackRow[]>(page.stackRows ?? [])
  const [ctas] = useOptimistic<CtaCommand[]>(page.ctas ?? [])

  return (
    <div className="page">
      {/* 1. Hero header */}
      <div className="about-hero">
        <div className="about-hero-text">
          <div className="eyebrow" {...attr(da, 'eyebrow')}>
            {page.eyebrow ?? '/about'}
          </div>
          <h1
            className="h-display"
            style={{fontSize: 'clamp(28px,5vw,46px)', marginTop: 12}}
            {...attr(da, 'heading')}
          >
            {page.heading ?? 'Session history'}
          </h1>
        </div>
      </div>

      {/* 2. Streaming bio */}
      <div
        className="out"
        style={{marginTop: 24}}
        {...attr(da, 'bioParagraphs')}
      >
        {(page.bioParagraphs ?? []).map((para, i) => (
          <span key={i} className="muted" style={{display: 'block', marginTop: i > 0 ? 12 : 0}}>
            {para}
          </span>
        ))}
      </div>

      {/* 3. Experience section */}
      <div style={{marginTop: 52}}>
        <SecHead idx="01" title="experience" />
        <div {...attr(da, 'experiencePrompt')}>
          <ShellPrompt
            handle={handle}
            promptText={page.experiencePrompt ?? 'grep "experience" profile.md'}
          />
        </div>
        <div className="trace" style={{marginTop: 18}} {...attr(da, 'timeline')}>
          {timeline.map((t) => (
            <div
              key={t._key}
              className={'trace-item' + (t.current ? ' lit' : '')}
              {...attr(da, `timeline[_key=="${t._key}"]`)}
            >
              <div className="yr tnum">{t.years}</div>
              <h4>{t.role}</h4>
              <div className="co">{t.company}</div>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Values section */}
      <div style={{marginTop: 52}}>
        <SecHead idx="02" title="values" />
        <div {...attr(da, 'valuesPrompt')}>
          <ShellPrompt
            handle={handle}
            promptText={page.valuesPrompt ?? 'inspect engineering-values.json'}
          />
        </div>
        <div style={{marginTop: 14}}>
          <ValuesPanel values={values} da={da} />
        </div>
      </div>

      {/* 5. Stack section */}
      <div style={{marginTop: 52}}>
        <SecHead idx="03" title="stack" />
        <div {...attr(da, 'stackPrompt')}>
          <ShellPrompt
            handle={handle}
            promptText={page.stackPrompt ?? 'ls -R ./stack'}
          />
        </div>
        <dl
          className="kv"
          style={{marginTop: 14, gridTemplateColumns: '160px 1fr', rowGap: 14}}
          {...attr(da, 'stackRows')}
        >
          {stackRows.map((s) => (
            <div
              key={s._key}
              style={{display: 'contents'}}
              {...attr(da, `stackRows[_key=="${s._key}"]`)}
            >
              <dt style={{paddingTop: 4}}>{s.term}</dt>
              <dd>
                <span className="chips">
                  {(s.items ?? []).map((x) => (
                    <span key={x} className="chip">
                      {x}
                    </span>
                  ))}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 6. CTAs */}
      <div className="row wrap gap-10" style={{marginTop: 52}} {...attr(da, 'ctas')}>
        {ctas.map((cta) => (
          <a
            key={cta._key}
            href={
              cta.sub ??
              (cta.route ? '/' + cta.route.replace(/^\//, '') : '#')
            }
            className={'btn' + (cta.primary ? ' primary' : ' ghost')}
            {...attr(da, `ctas[_key=="${cta._key}"]`)}
          >
            <span className="car">›</span>
            <span className="cmd">{cta.cmd}</span>
            {cta.flag && <span className="flag"> {cta.flag}</span>}
            {cta.sub && <span className="sub"> {cta.sub}</span>}
          </a>
        ))}
      </div>

      {/* 7. AskConsole */}
      {(askSettings.enabled ?? true) && (
        <div style={{marginTop: 64}}>
          <AskConsole entries={qaEntries} settings={askSettings} handle={handle} />
        </div>
      )}
    </div>
  )
}

export default AboutContent
