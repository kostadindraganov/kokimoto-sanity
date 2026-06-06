/* ============================================================
   ui.tsx — small shared presentational helpers.
   Verbatim TSX port of docs/kokikillara-porfolio/js/ui.jsx
   (SecHead, Metric, Pill, CmdBtn) scoped to the home workstream.
   NOTE: dedupe into a shared portfolio/ui module once the other
   page workstreams land (each ports its own copy for merge safety).
   ============================================================ */

import Link from 'next/link'
import type {ReactNode} from 'react'

export function SecHead({idx, title}: {idx?: string; title: ReactNode}) {
  return (
    <div className="sec-head">
      {idx && <span className="idx tnum">{idx}</span>}
      <h2>{title}</h2>
      <span className="rule" />
    </div>
  )
}

export function Metric({n, u, l}: {n: string; u?: string; l: string}) {
  return (
    <div className="metric">
      <div className="n tnum">
        {n}
        <span className="u">{u}</span>
      </div>
      <div className="l">{l}</div>
    </div>
  )
}

const PILL_LABELS: Record<string, string> = {
  live: 'live',
  shipped: 'shipped',
  active: 'in progress',
  archived: 'archived',
}

export function Pill({status}: {status: string}) {
  const label = PILL_LABELS[status] || status
  return <span className={'pill ' + status}>{label}</span>
}

/* internal route name (home/portfolio/about/blog/contact) → app route */
export function routeHref(route: string): string {
  if (/^https?:\/\//.test(route)) return route
  const r = route.replace(/^\//, '')
  return r === 'home' || r === '' ? '/' : `/${r}`
}

/* CTA command button */
export function CmdBtn({
  cmd,
  flag,
  sub,
  href,
  download,
  primary,
  dataSanity,
}: {
  cmd: string
  flag?: string
  sub?: string
  href: string
  download?: boolean | string
  primary?: boolean
  dataSanity?: string
}) {
  const inner = (
    <>
      <span className="car">›</span>
      <span>
        <span className="cmd">{cmd}</span>
        {flag && <span className="acc"> {flag}</span>}
      </span>
      {sub && <span className="meta">{sub}</span>}
    </>
  )
  const className = 'btn' + (primary ? ' primary' : '')
  const external = /^https?:\/\//.test(href)
  if (external || download) {
    const extra = download
      ? {download: typeof download === 'string' ? download : true}
      : {target: '_blank', rel: 'noreferrer'}
    return (
      <a className={className} href={href} data-sanity={dataSanity} {...extra}>
        {inner}
      </a>
    )
  }
  return (
    <Link className={className} href={href} data-sanity={dataSanity}>
      {inner}
    </Link>
  )
}
