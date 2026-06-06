export default function ArticleLoading() {
  return (
    <div className="page">
      <div className="article-layout">
        <div className="article-main">
          <div className="panel" style={{marginTop: 16}}>
            <div className="panel-head">
              <span className="lights">
                <i />
                <i />
                <i />
              </span>
              <span className="title">~/blog/…</span>
              <span className="meta">loading</span>
            </div>
            <div className="panel-body">
              <div className="out muted">
                <span className="spinner" aria-hidden="true" /> resolving article…
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
