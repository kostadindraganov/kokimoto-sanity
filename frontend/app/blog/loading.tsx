export default function BlogLoading() {
  return (
    <div className="page">
      <div className="panel" style={{marginTop: 32}}>
        <div className="panel-head">
          <span className="lights">
            <i />
            <i />
            <i />
          </span>
          <span className="title">~/blog</span>
          <span className="meta">loading</span>
        </div>
        <div className="panel-body">
          <div className="out muted">
            <span className="spinner" aria-hidden="true" /> streaming field notes…
          </div>
        </div>
      </div>
    </div>
  )
}
