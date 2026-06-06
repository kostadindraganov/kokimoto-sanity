'use client'

export default function ProjectError({
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  return (
    <div className="page">
      <div className="out err">✗ process exited with code 1</div>
      <div style={{marginTop: 18}}>
        <button className="btn" onClick={() => reset()}>
          <span className="car">›</span>
          <span>
            <span className="cmd">retry</span>
          </span>
        </button>
      </div>
    </div>
  )
}
