'use client'

import Link from 'next/link'
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
  stegaClean,
} from 'next-sanity'
import {type ReactNode, useMemo} from 'react'

import {dataAttr, urlForImage} from '@/sanity/lib/utils'
import YouTubeEmbed from '@/app/components/YouTubeEmbed'

import AsciiImageReveal from '../fx/AsciiImageReveal'
import {useStreamReveal} from '../fx/useStreamReveal'
import {shellPrompt, Stream, type StreamStep} from '../home/fx/Streaming'
import {displayUrl, hrefUrl, interpolate, shortHash} from './interpolate'
import {ParallaxGallery} from './ParallaxGallery'
import {CmdBtn, Pill, SecHead} from './primitives'
import {ProjectHeaderTags} from './ProjectHeaderTags'
import type {PortfolioPageData, ProjectDetailData} from './types'

/* ============================================================
   Project detail — single portfolio "deployment" record,
   ported verbatim from the template's project.jsx.
   All copy comes from portfolioPage.detailLabels (CMS).
   ============================================================ */

/** Colorizes a deploy-log line by its terminal prefix (derived styling, not copy). */
function LogLine({line}: {line: string}) {
  if (line.startsWith('#')) {
    return <span className="cmt">{line}</span>
  }
  if (line.startsWith('$ ')) {
    const rest = line.slice(2)
    const sp = rest.indexOf(' ')
    const cmd = sp === -1 ? rest : rest.slice(0, sp)
    const tail = sp === -1 ? '' : rest.slice(sp)
    return (
      <>
        {'$ '}
        <span className="kw">{cmd}</span>
        {tail}
      </>
    )
  }
  if (line.startsWith('✓ ') || line.startsWith('▸ ')) {
    const cls = line.startsWith('✓ ') ? 'st' : 'nm'
    const rest = line.slice(2)
    const sp = rest.indexOf(' ')
    const word = sp === -1 ? rest : rest.slice(0, sp)
    const tail = sp === -1 ? '' : rest.slice(sp)
    return (
      <>
        <span className={cls}>
          {line.slice(0, 2)}
          {word}
        </span>
        {tail}
      </>
    )
  }
  return <>{line}</>
}

function LogPanel({
  page,
  project,
  pageAttr,
}: {
  page: PortfolioPageData | null
  project: ProjectDetailData
  pageAttr: (path: string) => string | undefined
}) {
  const tokens = {
    slug: stegaClean(project.slug) || '',
    repo: displayUrl(stegaClean(project.repo)) || stegaClean(project.slug) || '',
    status: stegaClean(project.status) || '',
  }
  const labels = page?.detailLabels
  const lines = (labels?.deployLogLines ?? []).map((line) => interpolate(stegaClean(line), tokens))

  return (
    <div className="codeblock">
      <div className="ch">
        <span className="lights">
          <i />
          <i />
          <i />
        </span>
        <span data-sanity={pageAttr('detailLabels.deployLogTitle')}>
          {interpolate(labels?.deployLogTitle, tokens)}
        </span>
        <span style={{marginLeft: 'auto', color: 'var(--green)'}}>exit 0</span>
      </div>
      <pre data-sanity={pageAttr('detailLabels.deployLogLines')}>
        {lines.map((line, i) => (
          <span key={i}>
            <LogLine line={line} />
            {i < lines.length - 1 ? '\n' : ''}
          </span>
        ))}
      </pre>
    </div>
  )
}

function Field({k, children, dataSanity}: {k: ReactNode; children: ReactNode; dataSanity?: string}) {
  return (
    <div className="field" style={{gridTemplateColumns: '104px 1fr'}}>
      <span className="fk">{k}</span>
      <span className="fv" data-sanity={dataSanity}>
        {children}
      </span>
    </div>
  )
}

/** Compact Portable Text renderer for the brief description (no prose chrome). */
const briefComponents: PortableTextComponents = {
  types: {
    youTube: ({value}: {value: {url?: string}}) => <YouTubeEmbed url={value?.url} />,
  },
  marks: {
    link: ({children, value}) => {
      const internal = value?.linkType === 'internal'
      const href = internal ? `/${(value?.route ?? '').replace(/^\//, '')}` : (value?.href ?? '#')
      return (
        <a
          href={href}
          target={value?.newTab ? '_blank' : undefined}
          rel={value?.newTab ? 'noreferrer' : undefined}
          style={{color: 'var(--blue)'}}
        >
          {children}
        </a>
      )
    },
  },
}

/** Brief description row: label left, rendered rich text right (block-level). */
function DescriptionField({
  label,
  value,
  dataSanity,
}: {
  label: ReactNode
  value: PortableTextBlock[]
  dataSanity?: string
}) {
  return (
    <div className="field" style={{gridTemplateColumns: '104px 1fr'}}>
      <span className="fk">{label}</span>
      <div className="fv brief-desc" data-sanity={dataSanity}>
        <PortableText value={value} components={briefComponents} />
      </div>
    </div>
  )
}

export function ProjectDetail({
  page,
  project,
}: {
  page: PortfolioPageData | null
  project: ProjectDetailData
}) {
  const labels = page?.detailLabels
  const pageAttr = (path: string) =>
    page ? dataAttr({id: page._id, type: page._type, path}).toString() : undefined
  const projAttr = (path: string) =>
    dataAttr({id: project._id, type: project._type, path}).toString()

  const repoHref = project.repo ? hrefUrl(stegaClean(project.repo)) : null
  const liveHref = project.live ? hrefUrl(stegaClean(project.live)) : null
  const gallery = (project.gallery ?? []).filter((img) => img.asset)
  // NOTE: covers are uploaded as SVG. Sanity only rasterizes an SVG when a
  // format is set explicitly (fm=png); width/height/crop alone keep it SVG,
  // which loads with naturalWidth 0 and can't be sampled for the ASCII decode.
  const coverUrl = project.coverImage?.asset
    ? urlForImage(project.coverImage).width(1600).height(900).fit('crop').format('png').url()
    : null

  const steps = useMemo<StreamStep[]>(() => {
    const s: StreamStep[] = []

    // 1. back crumb
    s.push({
      kind: 'node',
      gap: 0,
      delay: 140,
      node: (
        <Link className="crumb" href="/portfolio" data-sanity={pageAttr('detailLabels.backLabel')}>
          <span className="ar">←</span> {labels?.backLabel}
        </Link>
      ),
    })

    // 2. header block
    s.push({
      kind: 'node',
      gap: 26,
      delay: 180,
      node: (
        <div>
          <div className="row gap-10 metarow" style={{flexWrap: 'wrap', fontSize: 12}}>
            <span className="commit tnum acc">{shortHash(stegaClean(project.slug) || project._id)}</span>
            <span className="faint" data-sanity={projAttr('commit')}>
              {project.commit}
            </span>
            <span style={{marginLeft: 'auto'}} data-sanity={projAttr('status')}>
              <Pill status={project.status} />
            </span>
          </div>
          <h1
            className="h-display"
            style={{fontSize: 'clamp(30px,5.5vw,52px)', marginTop: 14}}
            data-sanity={projAttr('title')}
          >
            {project.title}
          </h1>
          <div
            className="role"
            style={{fontSize: 13.5, color: 'var(--ink-3)', marginTop: 6}}
            data-sanity={projAttr('role')}
          >
            {project.role}
          </div>
          <ProjectHeaderTags
            projectId={project._id}
            projectType={project._type}
            tags={project.tags ?? []}
          />
        </div>
      ),
    })

    // 2b. cover image — full-width hero band below the title, decoding in
    //     from scrambling ASCII characters (codegrid-style reveal)
    if (coverUrl) {
      s.push({
        kind: 'node',
        gap: 22,
        delay: 240,
        node: (
          <div
            className="ph"
            style={{
              aspectRatio: '16 / 9',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              background: 'var(--bg-1)',
            }}
            data-sanity={projAttr('coverImage')}
          >
            <AsciiImageReveal
              src={coverUrl}
              alt={
                stegaClean(project.coverImage?.alt) ||
                (stegaClean(project.title) || '') + ' cover'
              }
              columns={120}
            />
          </div>
        ),
      })
    }

    // 3. shell prompt
    s.push({
      kind: 'prompt',
      gap: 30,
      segments: shellPrompt('kostadin', 'open ./portfolio/' + (stegaClean(project.slug) || project._id)),
    })

    // 4. think
    s.push({kind: 'think', duration: 1000})

    // 5. tools
    s.push({
      kind: 'tools',
      label: 'running tools',
      collapsedLabel: '4 tool uses',
      actions: ['Cloning repository', 'Reading manifest', 'Resolving build status', 'Computing impact deltas'],
    })

    // 6. deploy log panel
    s.push({
      kind: 'node',
      delay: 280,
      node: <LogPanel page={page} project={project} pageAttr={pageAttr} />,
    })

    // 7. brief section heading
    s.push({
      kind: 'node',
      gap: 40,
      delay: 200,
      node: (
        <SecHead
          idx="01"
          title={labels?.briefHeading ?? ''}
          dataSanity={pageAttr('detailLabels.briefHeading')}
        />
      ),
    })

    // 8. brief panel
    s.push({
      kind: 'node',
      delay: 240,
      node: (
        <div className="panel" style={{background: 'var(--bg-1)'}}>
          <div className="panel-body" style={{paddingTop: 6, paddingBottom: 6}}>
            {(project.description?.length ?? 0) > 0 && (
              <DescriptionField
                label={
                  <span data-sanity={pageAttr('detailLabels.descriptionLabel')}>
                    {labels?.descriptionLabel || '# description'}
                  </span>
                }
                value={project.description ?? []}
                dataSanity={projAttr('description')}
              />
            )}
            <Field
              k={<span data-sanity={pageAttr('detailLabels.stackLabel')}>{labels?.stackLabel}</span>}
              dataSanity={projAttr('stack')}
            >
              <span className="chips">
                {(project.stack ?? []).map((s, i) => (
                  <span key={i} className="chip">
                    {s}
                  </span>
                ))}
              </span>
            </Field>
            <Field
              k={<span data-sanity={pageAttr('detailLabels.roleLabel')}>{labels?.roleLabel}</span>}
              dataSanity={projAttr('role')}
            >
              {project.role}
            </Field>
          </div>
        </div>
      ),
    })

    // 9. gallery (conditional)
    if (gallery.length > 0) {
      s.push({
        kind: 'node',
        gap: 40,
        delay: 160,
        node: (
          <SecHead
            idx="02"
            title={labels?.interfaceHeading ?? ''}
            dataSanity={pageAttr('detailLabels.interfaceHeading')}
          />
        ),
      })
      s.push({
        kind: 'node',
        delay: 240,
        node: <ParallaxGallery images={gallery} projAttr={projAttr} />,
      })
    }

    // 10. repo/live links (conditional)
    if (repoHref || liveHref) {
      s.push({
        kind: 'node',
        gap: 40,
        delay: 200,
        node: (
          <div className="row wrap gap-10">
            {repoHref && (
              <CmdBtn
                cmd={stegaClean(labels?.cloneLabel) || ''}
                sub={displayUrl(stegaClean(project.repo))}
                primary
                href={repoHref}
                dataSanity={projAttr('repo')}
              />
            )}
            {liveHref && (
              <CmdBtn
                cmd={stegaClean(labels?.openLiveLabel) || ''}
                sub={displayUrl(stegaClean(project.live))}
                href={liveHref}
                dataSanity={projAttr('live')}
              />
            )}
          </div>
        ),
      })
    }

    // 13. pager (conditional)
    if (project.prev || project.next) {
      s.push({
        kind: 'node',
        gap: 44,
        delay: 160,
        node: (
          <div>
            <SecHead idx="—" title="more work" />
            <div className="pager">
              {project.prev ? (
                <Link className="prev" href={`/portfolio/${stegaClean(project.prev.slug)}`}>
                  <span className="pk" data-sanity={pageAttr('detailLabels.prevLabel')}>
                    <span className="ar">←</span> {labels?.prevLabel}
                  </span>
                  <span className="pt">{project.prev.title}</span>
                </Link>
              ) : (
                <span className="prev empty" />
              )}
              {project.next ? (
                <Link className="next" href={`/portfolio/${stegaClean(project.next.slug)}`}>
                  <span className="pk" data-sanity={pageAttr('detailLabels.nextLabel')}>
                    {labels?.nextLabel} <span className="ar">→</span>
                  </span>
                  <span className="pt">{project.next.title}</span>
                </Link>
              ) : (
                <span className="next empty" />
              )}
            </div>
            <div style={{marginTop: 22}}>
              <Link className="btn" href="/portfolio" data-sanity={pageAttr('detailLabels.backLabel')}>
                <span className="car">›</span>
                <span>
                  <span className="cmd">{labels?.backLabel}</span>
                </span>
              </Link>
            </div>
          </div>
        ),
      })
    }

    return s
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, project, labels])

  const {animate, streamKey, onComplete} = useStreamReveal(
    `portfolio/${stegaClean(project.slug) || project._id}`,
  )

  return (
    <div className="page">
      <Stream key={streamKey} steps={steps} animate={animate} onComplete={onComplete} />
    </div>
  )
}
