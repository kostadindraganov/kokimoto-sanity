'use client'

interface ErrorProps {
  error: Error & {digest?: string}
  reset: () => void
}

export default function ContactError({error, reset}: ErrorProps) {
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
          <span className="meta err">exit 1</span>
        </div>
        <div className="panel-body">
          <div className="out">
            <div className="err">&#10007; process exited with code 1</div>
            {error.message && (
              <div className="faint" style={{marginTop: 4, fontSize: 12}}>
                {error.message}
              </div>
            )}
          </div>
          <div style={{marginTop: 18}}>
            <button className="btn ghost" onClick={reset}>
              <span className="car">&#8635;</span> retry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
