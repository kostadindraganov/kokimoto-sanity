import {stegaClean} from 'next-sanity'

/* ============================================================
   Shared presentational primitives (ported verbatim from the
   template's ui.jsx) used by the portfolio pages.
   ============================================================ */

/** Status pill — `.pill .live|.shipped|.active|.archived` */
export function Pill({status}: {status?: string | null}) {
  const clean = stegaClean(status ?? '') || ''
  const label =
    ({live: 'live', shipped: 'shipped', active: 'in progress', archived: 'archived'} as const)[
      clean as 'live' | 'shipped' | 'active' | 'archived'
    ] || clean
  return <span className={'pill ' + clean}>{label}</span>
}

/** Section header — index + title + trailing rule */
export function SecHead({idx, title, dataSanity}: {idx?: string; title: string; dataSanity?: string}) {
  return (
    <div className="sec-head">
      {idx && <span className="idx tnum">{idx}</span>}
      <h2 data-sanity={dataSanity}>{title}</h2>
      <span className="rule" />
    </div>
  )
}

/** CTA command button — external anchor variant */
export function CmdBtn({
  cmd,
  flag,
  sub,
  primary,
  href,
  dataSanity,
}: {
  cmd: string
  flag?: string
  sub?: string
  primary?: boolean
  href: string
  dataSanity?: string
}) {
  return (
    <a
      className={'btn' + (primary ? ' primary' : '')}
      href={href}
      target="_blank"
      rel="noreferrer"
      data-sanity={dataSanity}
    >
      <span className="car">›</span>
      <span>
        <span className="cmd">{cmd}</span>
        {flag && <span className="acc"> {flag}</span>}
      </span>
      {sub && <span className="meta">{sub}</span>}
    </a>
  )
}
