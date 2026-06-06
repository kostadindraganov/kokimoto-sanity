'use client'

/* /about error boundary — terminal exit-code aesthetic */
export default function AboutError({reset}: {reset: () => void}) {
  return (
    <div className="page">
      <div className="out" style={{marginTop: 32}}>
        <div className="ln err">✗ process exited with code 1</div>
        <div className="ln muted" style={{marginTop: 8}}>
          failed to load about page — check connection and retry
        </div>
      </div>
      <button className="btn ghost" style={{marginTop: 20}} onClick={reset}>
        <span className="car">›</span> retry
      </button>
    </div>
  )
}
