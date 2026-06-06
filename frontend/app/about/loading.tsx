/* /about loading skeleton — terminal/stream aesthetic */
export default function AboutLoading() {
  return (
    <div className="page">
      <div className="panel" style={{marginTop: 32}}>
        <div className="panel-head">
          <span className="lights">
            <i />
            <i />
            <i />
          </span>
          <span className="title">about.md</span>
          <span className="meta">streaming…</span>
        </div>
        <div className="panel-body">
          <div className="think" role="status" aria-live="polite">
            <span className="think-glyph">✻</span>
            <span className="think-label">Loading…</span>
          </div>
        </div>
      </div>
    </div>
  )
}
