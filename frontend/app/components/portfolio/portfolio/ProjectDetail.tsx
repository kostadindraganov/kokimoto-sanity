import Image from 'next/image'
import Link from 'next/link'
import {stegaClean} from 'next-sanity'
import {type ReactNode} from 'react'

import {dataAttr, urlForImage} from '@/sanity/lib/utils'

import {displayUrl, hrefUrl, interpolate, shortHash} from './interpolate'
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
  const gallery = (project.gallery ?? []).filter((img) => img.asset).slice(0, 2)

  return (
    <div className="page">
      <Link className="crumb" href="/portfolio" data-sanity={pageAttr('detailLabels.backLabel')}>
        <span className="ar">←</span> {labels?.backLabel}
      </Link>

      <div style={{marginTop: 26}}>
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

      <div style={{marginTop: 30}}>
        <LogPanel page={page} project={project} pageAttr={pageAttr} />
      </div>

      <div style={{marginTop: 40}}>
        <SecHead idx="01" title={labels?.briefHeading ?? ''} dataSanity={pageAttr('detailLabels.briefHeading')} />
      </div>
      <div className="panel" style={{background: 'var(--bg-1)'}}>
        <div className="panel-body" style={{paddingTop: 6, paddingBottom: 6}}>
          <Field
            k={<span data-sanity={pageAttr('detailLabels.problemLabel')}>{labels?.problemLabel}</span>}
            dataSanity={projAttr('problem')}
          >
            {project.problem}
          </Field>
          <Field
            k={<span data-sanity={pageAttr('detailLabels.solutionLabel')}>{labels?.solutionLabel}</span>}
            dataSanity={projAttr('solution')}
          >
            {project.solution}
          </Field>
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

      <div style={{marginTop: 40}}>
        <SecHead idx="02" title={labels?.impactHeading ?? ''} dataSanity={pageAttr('detailLabels.impactHeading')} />
      </div>
      <div className="grid cols-3" data-sanity={projAttr('impact')}>
        {(project.impact ?? []).slice(0, 3).map((im, i) => (
          <div key={i} className="metric">
            <div className="diff" style={{fontSize: 14}}>
              <span className="add">+ </span>
              <span style={{color: 'var(--ink)'}}>{im}</span>
            </div>
          </div>
        ))}
      </div>

      {gallery.length > 0 && (
        <>
          <div style={{marginTop: 40}}>
            <SecHead
              idx="03"
              title={labels?.interfaceHeading ?? ''}
              dataSanity={pageAttr('detailLabels.interfaceHeading')}
            />
          </div>
          <div className="grid cols-2" data-sanity={projAttr('gallery')}>
            {gallery.map((img, i) => (
              <div
                key={img._key ?? i}
                className="ph"
                style={{aspectRatio: '16 / 10', position: 'relative', overflow: 'hidden'}}
                data-sanity={projAttr(img._key ? `gallery[_key=="${img._key}"]` : 'gallery')}
              >
                <Image
                  src={urlForImage(img).width(1280).height(800).fit('crop').url()}
                  alt={stegaClean(img.alt) || ''}
                  fill
                  style={{objectFit: 'cover'}}
                  sizes="(max-width: 880px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {(repoHref || liveHref) && (
        <div className="row wrap gap-10" style={{marginTop: 40}}>
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
      )}

      {(project.prev || project.next) && (
        <div style={{marginTop: 44}}>
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
      )}
    </div>
  )
}
