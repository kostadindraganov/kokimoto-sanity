'use client'

/* ============================================================
   AboutContent.tsx — client component for /about
   Ported 1:1 from about.jsx template.
   All copy from CMS props, no hardcoded strings.
   useOptimistic: timeline[], values[], stackRows[], ctas[]
   dataAttr on bioParagraphs container and all field wrappers
   ============================================================ */

import {useMemo, useState, useOptimistic} from 'react'
import {stegaClean} from 'next-sanity'
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
import {shellPrompt, Stream, type StreamStep} from '../home/fx/Streaming'
import {useStreamReveal} from '../fx/useStreamReveal'

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

  const reveal = useStreamReveal('about')
  // AskConsole is in the SSR/settled output (ready via !animate); while the
  // stream is animating it's hidden until onComplete flips `ready`, so it
  // doesn't float beneath the half-revealed sections (mirrors Home).
  const [ready, setReady] = useState(false)

  const steps = useMemo<StreamStep[]>(
    () => [
      // 1. Hero header
      {
        kind: 'node',
        gap: 0,
        delay: 160,
        node: (
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
        ),
      },
      // 2. Bio paragraphs
      {
        kind: 'lines',
        gap: 24,
        chunk: 70,
        sanity: attr(da, 'bioParagraphs')['data-sanity'],
        lines: (page.bioParagraphs ?? []).map((para, i) => (
          <span key={i} className="muted" style={{display: 'block', marginTop: i > 0 ? 12 : 0}}>
            {para}
          </span>
        )),
      },
      // 3. Experience section header
      {
        kind: 'node',
        gap: 52,
        delay: 160,
        node: <SecHead idx="01" title="experience" />,
      },
      // 4. Experience prompt
      {
        kind: 'prompt',
        sanity: attr(da, 'experiencePrompt')['data-sanity'],
        segments: shellPrompt(handle, page.experiencePrompt ?? 'grep "experience" profile.md'),
      },
      // 5. Think before timeline
      {kind: 'think', duration: 800},
      // 6. Timeline
      {
        kind: 'node',
        delay: 320,
        node: (
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
        ),
      },
      // 7. Values section header
      {
        kind: 'node',
        gap: 52,
        delay: 160,
        node: <SecHead idx="02" title="values" />,
      },
      // 8. Values prompt
      {
        kind: 'prompt',
        sanity: attr(da, 'valuesPrompt')['data-sanity'],
        segments: shellPrompt(handle, page.valuesPrompt ?? 'inspect engineering-values.json'),
      },
      // 9. Think before values panel
      {kind: 'think', duration: 700},
      // 10. Values panel
      {
        kind: 'node',
        delay: 300,
        node: (
          <div style={{marginTop: 14}}>
            <ValuesPanel values={values} da={da} />
          </div>
        ),
      },
      // 11. Stack section header
      {
        kind: 'node',
        gap: 52,
        delay: 160,
        node: <SecHead idx="03" title="stack" />,
      },
      // 12. Stack prompt
      {
        kind: 'prompt',
        sanity: attr(da, 'stackPrompt')['data-sanity'],
        segments: shellPrompt(handle, page.stackPrompt ?? 'ls -R ./stack'),
      },
      // 13. Think before stack
      {kind: 'think', duration: 700},
      // 14. Stack kv list
      {
        kind: 'node',
        delay: 300,
        node: (
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
        ),
      },
      // 15. CTAs
      {
        kind: 'node',
        gap: 52,
        delay: 200,
        node: (
          <div className="row wrap gap-10" {...attr(da, 'ctas')}>
            {ctas.map((cta) => {
              // an uploaded file (e.g. CV PDF) turns the button into a download:
              // ?dl= sets Content-Disposition so it downloads cross-origin with
              // the original filename instead of opening inline.
              const fileUrl = cta.fileUrl ? stegaClean(cta.fileUrl) : null
              const fileName = stegaClean(cta.fileName ?? '') || 'cv.pdf'
              const downloadHref = fileUrl
                ? `${fileUrl}?dl=${encodeURIComponent(fileName)}`
                : null
              const href =
                downloadHref ?? cta.sub ?? (cta.route ? '/' + cta.route.replace(/^\//, '') : '#')
              return (
                <a
                  key={cta._key}
                  href={href}
                  {...(downloadHref ? {download: fileName, rel: 'noopener'} : {})}
                  className={'btn' + (cta.primary ? ' primary' : ' ghost')}
                  {...attr(da, `ctas[_key=="${cta._key}"]`)}
                >
                  <span className="car">›</span>
                  <span className="cmd">{cta.cmd}</span>
                  {cta.flag && <span className="flag"> {cta.flag}</span>}
                  {cta.sub && <span className="sub"> {cta.sub}</span>}
                </a>
              )
            })}
          </div>
        ),
      },
    ],
    [da, handle, page, timeline, values, stackRows, ctas],
  )

  return (
    <div className="page">
      <Stream
        key={reveal.streamKey}
        steps={steps}
        animate={reveal.animate}
        onComplete={() => {
          reveal.onComplete()
          setReady(true)
        }}
      />
      {(!reveal.animate || ready) && (askSettings.enabled ?? true) && (
        <div style={{marginTop: 64}} className={reveal.animate ? 'reveal' : undefined}>
          <AskConsole entries={qaEntries} settings={askSettings} handle={handle} />
        </div>
      )}
    </div>
  )
}

export default AboutContent
