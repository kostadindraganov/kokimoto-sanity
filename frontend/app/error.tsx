'use client'

import {useEffect} from 'react'

/* ============================================================
   / — error boundary. Terminal-style failure state per the
   route spec: `✗ process exited with code 1` + ghost retry
   button. (Error-boundary copy renders when CMS data may be
   unreachable, so it is route chrome by design.)
   ============================================================ */

export default function ErrorBoundary({
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
      <div className="out" role="alert">
        <div className="ln err">✗ process exited with code 1</div>
      </div>
      <div style={{marginTop: 18}}>
        <button className="btn ghost" onClick={() => reset()}>
          <span className="car">›</span>
          <span>
            <span className="cmd">retry</span>
          </span>
        </button>
      </div>
    </div>
  )
}
