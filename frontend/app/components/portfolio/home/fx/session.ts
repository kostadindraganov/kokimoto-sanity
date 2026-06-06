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
}

export function prefersReduced(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
