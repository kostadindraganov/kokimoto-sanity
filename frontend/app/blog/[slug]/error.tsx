'use client'

import {useEffect} from 'react'

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="page">
      <div className="article-layout">
        <div className="article-main">
          <div className="panel">
            <div className="panel-head">
              <span className="lights">
                <i />
                <i />
                <i />
              </span>
              <span className="title">~/blog/…</span>
              <span className="meta err">error</span>
            </div>
            <div className="panel-body">
              <div className="out err">✗ process exited with code 1</div>
              <div className="out muted" style={{marginTop: 8}}>
                {error.message ?? 'An unexpected error occurred'}
              </div>
              <div style={{marginTop: 20}}>
                <button className="btn ghost" onClick={reset}>
                  <span className="car">↻</span> retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
