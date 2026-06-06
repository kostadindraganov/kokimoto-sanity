/* ============================================================
   StreamFallback — bootloader-aesthetic skeleton shared by
   app/loading.tsx and the draft-mode Suspense boundary on /.
   (Route chrome: the "streaming…" label is loading-state copy
   that renders before any CMS data exists, per the route spec.)
   ============================================================ */

import {Spinner} from './fx/Streaming'

export default function StreamFallback() {
  return (
    <div className="page">
      <div className="panel" style={{background: 'var(--bg-1)'}}>
        <div className="panel-head">
          <span className="lights">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="panel-body">
          <div className="think" role="status" aria-live="polite">
            <span className="think-glyph">
              <Spinner />
            </span>
            <span className="think-label">streaming…</span>
          </div>
        </div>
      </div>
    </div>
  )
}
