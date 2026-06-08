/* ============================================================
   session.ts — boot/stream "seen" tracking (ported verbatim from
   docs/kokikillara-porfolio/js/streaming.jsx).
   In-memory Set (not sessionStorage) so a real page refresh
   re-runs the boot loader + streaming reveal, while client-side
   navigation within the same load remembers what's been seen.
   NOTE: swap imports to app/components/portfolio/fx/* once the
   frontend-foundation workstream lands its canonical fx port.
   ============================================================ */

const _bootSeen = new Set<string>()

export function bootSeen(key: string): boolean {
  return _bootSeen.has(key)
}

export function markBoot(key: string): void {
  _bootSeen.add(key)
}

export function clearAllBoots(): void {
  _bootSeen.clear()
  clearBootShown()
}

/* ------------------------------------------------------------
   Persistent boot flag — the terminal boot screen is a once-ever
   intro. We persist a flag in localStorage (the page-stream "seen"
   Set above stays in-memory, so other routes still reveal on a
   fresh load) so the boot runs only on the very first visit and
   never replays on refresh or when navigating back to Home.
   ------------------------------------------------------------ */
const BOOT_SHOWN_KEY = 'portfolio:boot-shown'

export function bootShown(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(BOOT_SHOWN_KEY) === '1'
  } catch {
    return false
  }
}

export function markBootShown(): void {
  try {
    window.localStorage.setItem(BOOT_SHOWN_KEY, '1')
  } catch {
    /* storage unavailable (private mode / blocked) — boot just replays, harmless */
  }
}

export function clearBootShown(): void {
  try {
    window.localStorage.removeItem(BOOT_SHOWN_KEY)
  } catch {
    /* ignore */
  }
}

export function prefersReduced(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
