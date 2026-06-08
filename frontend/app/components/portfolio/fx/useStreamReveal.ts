'use client'

/* ============================================================
   useStreamReveal — drives Home's once-per-session streaming
   reveal for the other routes (portfolio, about, blog, contact,
   project, article).

   SSR + the first client render report animate=false, so the
   page is server-rendered settled (full content in the HTML →
   no SEO regression) and hydration matches with no content flash.
   After hydration a layout effect (runs before the browser
   paints) checks prefers-reduced-motion and the in-memory "seen"
   Set; when this page hasn't streamed yet this session it flips
   to animate=true and bumps `streamKey` so the <Stream> remounts
   from step 0 before paint — the visitor sees the stream start,
   not the settled content.

   markBoot() on complete suppresses re-animation when navigating
   back to an already-seen page; the Set lives in module memory
   (see home/fx/session), so a real page refresh replays it.
   This mirrors app.jsx's `animate = !reduced && !booting &&
   !bootSeen(pageId)` from the source template.
   ============================================================ */

import {useEffect, useLayoutEffect, useState} from 'react'

import {bootSeen, markBoot, prefersReduced} from '../home/fx/session'

// useLayoutEffect warns during SSR; fall back to useEffect on the server
// (where it never runs anyway). The reveal decision is client-only.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface StreamReveal {
  animate: boolean
  /** changes false→true so <Stream key={streamKey}> remounts from step 0 */
  streamKey: string
  /** pass to <Stream onComplete> — records this page as seen for the session */
  onComplete: () => void
}

export function useStreamReveal(pageId: string): StreamReveal {
  const [animate, setAnimate] = useState(false)

  useIsomorphicLayoutEffect(() => {
    // one-shot resolution of reduced-motion / already-seen, before first paint
    if (!prefersReduced() && !bootSeen(pageId)) setAnimate(true)
  }, [])

  return {
    animate,
    streamKey: animate ? `${pageId}:stream` : `${pageId}:static`,
    onComplete: () => markBoot(pageId),
  }
}
