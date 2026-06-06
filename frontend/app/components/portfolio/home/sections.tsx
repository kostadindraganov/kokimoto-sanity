'use client'

/* ============================================================
   sections.tsx — home page sections ported from
   docs/kokikillara-porfolio/js/home.jsx (SystemCard, MiniWork)
   plus the featured / metrics / next-steps grids.
   Object/reference arrays (metrics, nextSteps, featuredProjects,
   systemCard.kvRows) use `useOptimistic` keyed by `_key` and a
   per-item `dataAttr`, per PRD §5.4.
   ============================================================ */

import Link from 'next/link'
import {type SanityDocument, stegaClean} from 'next-sanity'
import {useOptimistic} from 'next-sanity/hooks'

import {dataAttr} from '@/sanity/lib/utils'

import AsciiReveal from './fx/AsciiReveal'
import type {
  HomeCta,
  HomeFeaturedProject,
  HomeKvRow,
  HomeMetric,
  HomeSettings,
  HomeSystemCard,
} from './queries'
import {CmdBtn, Metric, Pill, routeHref} from './ui'

type HomeDocLike = {
  _id: string
  _type: string
  metrics?: HomeMetric[]
  nextSteps?: HomeCta[]
  featuredProjects?: {_key: string; _ref?: string}[]
  systemCard?: {kvRows?: HomeKvRow[]}
}

interface DocRef {
  docId: string
  docType: string
}

const attr = (docId: string, docType: string, path: string) =>
  dataAttr({id: docId, type: docType, path}).toString()

/* ---------- featured work ("selected work" mini deployment cards) ---------- */

export function MiniWork({p, dataSanity}: {p: HomeFeaturedProject; dataSanity?: string}) {
  return (
    <Link
      className="proj"
      href={`/portfolio/${stegaClean(p.slug ?? '')}`}
      data-sanity={dataSanity}
      style={{
        display: 'block',
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer',
        background: 'var(--bg-1)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div className="proj-head">
        <span className="commit">◇</span>
        <span className="commit commit-msg">{p.commit}</span>
        <span style={{marginLeft: 'auto'}}>
          {p.status && <Pill status={stegaClean(p.status)} />}
        </span>
      </div>
      <div className="proj-body" style={{padding: '14px 16px'}}>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'baseline', gap: 12}}>
          <h3 style={{fontSize: 17, margin: 0}}>{p.title}</h3>
          <span className="faint" style={{fontSize: 12}}>
            {(p.tags ?? []).map((t) => '#' + stegaClean(t)).join(' ')}
          </span>
        </div>
        <p className="muted" style={{fontSize: 13, margin: '8px 0 0', lineHeight: 1.55}}>
          {p.problem}
        </p>
      </div>
    </Link>
  )
}

export function FeaturedGrid({
  docId,
  docType,
  projects,
}: DocRef & {projects: HomeFeaturedProject[]}) {
  const items = useOptimistic<HomeFeaturedProject[], SanityDocument<HomeDocLike>>(
    projects,
    (current, action) => {
      if (action.id !== docId) return current
      if (action.document.featuredProjects) {
        // reference array — reconcile against the already-expanded items by _key
        return action.document.featuredProjects
          .map((ref) => current.find((p) => p._key === ref._key))
          .filter((p): p is HomeFeaturedProject => Boolean(p))
      }
      return current
    },
  )
  return (
    <div
      className="grid"
      style={{marginTop: 4}}
      data-sanity={attr(docId, docType, 'featuredProjects')}
    >
      {items.map((p) => (
        <MiniWork
          key={p._key}
          p={p}
          dataSanity={attr(docId, docType, `featuredProjects[_key=="${p._key}"]`)}
        />
      ))}
    </div>
  )
}

/* ---------- metrics ("at a glance") ---------- */

export function MetricsGrid({docId, docType, metrics}: DocRef & {metrics: HomeMetric[]}) {
  const items = useOptimistic<HomeMetric[], SanityDocument<HomeDocLike>>(
    metrics,
    (current, action) =>
      action.id === docId && action.document.metrics ? action.document.metrics : current,
  )
  return (
    <div className="grid cols-4" style={{marginTop: 4}} data-sanity={attr(docId, docType, 'metrics')}>
      {items.map((m) => (
        <div key={m._key} data-sanity={attr(docId, docType, `metrics[_key=="${m._key}"]`)}>
          <Metric n={m.value ?? ''} u={m.unit ?? ''} l={m.label ?? ''} />
        </div>
      ))}
    </div>
  )
}

/* ---------- next steps (CTA command buttons) ---------- */

export function NextSteps({docId, docType, ctas}: DocRef & {ctas: HomeCta[]}) {
  const items = useOptimistic<HomeCta[], SanityDocument<HomeDocLike>>(
    ctas,
    (current, action) =>
      action.id === docId && action.document.nextSteps ? action.document.nextSteps : current,
  )
  return (
    <div className="hero-cta" style={{marginTop: 4}} data-sanity={attr(docId, docType, 'nextSteps')}>
      {items.map((c) => {
        const route = Array.isArray(c.route) ? (c.route[0] ?? '') : (c.route ?? '')
        return (
          <CmdBtn
            key={c._key}
            cmd={c.cmd ?? ''}
            flag={c.flag ?? undefined}
            sub={c.sub ?? undefined}
            primary={c.primary ?? false}
            href={routeHref(stegaClean(route))}
            dataSanity={attr(docId, docType, `nextSteps[_key=="${c._key}"]`)}
          />
        )
      })}
    </div>
  )
}

/* ---------- system card (split hero layout) ---------- */

function hostLabel(url: string): string {
  try {
    const host = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`).hostname
    return host.replace(/^www\./, '').split('.')[0]
  } catch {
    return url
  }
}

function abbreviate(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2) return name
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`
}

export function SystemCard({
  docId,
  docType,
  card,
  settings,
}: DocRef & {card: HomeSystemCard; settings: HomeSettings}) {
  const kvRows = useOptimistic<HomeKvRow[], SanityDocument<HomeDocLike>>(
    card.kvRows ?? [],
    (current, action) =>
      action.id === docId && action.document.systemCard?.kvRows
        ? action.document.systemCard.kvRows
        : current,
  )
  const name = stegaClean(settings.name ?? '')
  const github = stegaClean(settings.github ?? '')
  const linkedin = stegaClean(settings.linkedin ?? '')
  const sAttr = (path: string) => attr(settings._id, settings._type, path)

  return (
    <aside className="panel" style={{alignSelf: 'start'}}>
      <div className="panel-head">
        <span className="lights">
          <i />
          <i />
          <i />
        </span>
        <span className="title" data-sanity={attr(docId, docType, 'systemCard.panelTitle')}>
          {card.panelTitle}
        </span>
        <span className="meta" data-sanity={attr(docId, docType, 'systemCard.panelMeta')}>
          {card.panelMeta}
        </span>
      </div>
      <div className="panel-body">
        {settings.portraitUrl ? (
          <div
            data-sanity={sAttr('portrait')}
            style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              marginBottom: 16,
              border: '1px solid var(--line)',
              borderRadius: 'var(--r)',
            }}
          >
            <AsciiReveal
              src={`${stegaClean(settings.portraitUrl)}?w=640&q=80&auto=format`}
              alt={stegaClean(settings.portraitAlt ?? '')}
              columns={36}
            />
          </div>
        ) : (
          <div
            className="ph"
            data-sanity={sAttr('portrait')}
            style={{aspectRatio: '1 / 1', marginBottom: 16}}
          />
        )}
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'baseline'}}>
          <strong
            style={{fontFamily: 'var(--display)', fontSize: 17}}
            data-sanity={sAttr('name')}
          >
            {abbreviate(name)}
          </strong>
          {settings.availabilityStatus !== false && (
            <span className="avail">
              <span className="dot" />
              <span
                style={{fontSize: 11, color: 'var(--ink-3)'}}
                data-sanity={attr(docId, docType, 'systemCard.onlineLabel')}
              >
                {card.onlineLabel}
              </span>
            </span>
          )}
        </div>
        <div
          className="muted"
          style={{fontSize: 12.5, marginTop: 2}}
          data-sanity={attr(docId, docType, 'systemCard.roleLine')}
        >
          {card.roleLine}
        </div>
        <dl
          className="kv"
          style={{marginTop: 16, gridTemplateColumns: '84px 1fr', fontSize: 12.5}}
          data-sanity={attr(docId, docType, 'systemCard.kvRows')}
        >
          {kvRows.map((row) => {
            const key = stegaClean(row.key ?? '')
            const ddClass = key === 'exp' ? 'acc' : key === 'status' ? 'ok' : undefined
            const rowPath = `systemCard.kvRows[_key=="${row._key}"]`
            return (
              <span key={row._key} style={{display: 'contents'}}>
                <dt data-sanity={attr(docId, docType, `${rowPath}.key`)}>{row.key}</dt>
                <dd className={ddClass} data-sanity={attr(docId, docType, `${rowPath}.value`)}>
                  {row.value}
                </dd>
              </span>
            )
          })}
        </dl>
        <div className="row wrap gap-8" style={{marginTop: 16}}>
          {github && (
            <a
              className="flag"
              href={/^https?:\/\//.test(github) ? github : `https://${github}`}
              target="_blank"
              rel="noreferrer"
              data-sanity={sAttr('github')}
            >
              {hostLabel(github)} ↗
            </a>
          )}
          {linkedin && (
            <a
              className="flag"
              href={/^https?:\/\//.test(linkedin) ? linkedin : `https://${linkedin}`}
              target="_blank"
              rel="noreferrer"
              data-sanity={sAttr('linkedin')}
            >
              {hostLabel(linkedin)} ↗
            </a>
          )}
        </div>
      </div>
    </aside>
  )
}
