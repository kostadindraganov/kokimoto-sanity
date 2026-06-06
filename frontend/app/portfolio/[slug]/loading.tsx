import {Spinner} from '@/app/components/portfolio/portfolio/Spinner'

/** Stream-skeleton loading state — glyphs only, no hardcoded copy. */
export default function Loading() {
  return (
    <div className="page" aria-busy="true">
      <div className="panel">
        <div className="panel-head">
          <span className="lights">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="panel-body">
          <div className="prompt">
            <Spinner /> <span className="cursor" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
