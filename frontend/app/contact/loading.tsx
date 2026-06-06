export default function ContactLoading() {
  return (
    <div className="page">
      <div className="panel" style={{background: 'var(--bg-1)'}}>
        <div className="panel-head">
          <span className="lights">
            <i />
            <i />
            <i />
          </span>
          <span className="title">~/connect.sh</span>
          <span className="meta acc">streaming…</span>
        </div>
        <div className="panel-body">
          <div className="out">
            <div className="muted">
              <span className="cursor" style={{display: 'inline-block'}} /> loading contact form…
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
