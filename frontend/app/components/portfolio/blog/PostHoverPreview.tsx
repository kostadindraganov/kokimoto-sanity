'use client'

import {useState} from 'react'
import SanityImage from '@/app/components/SanityImage'

interface PreviewState {
  id: string
  assetRef: string | null
  x: number
  y: number
}

interface PostHoverPreviewProps {
  preview: PreviewState | null
}

function isCoarsePointer(): boolean {
  try {
    return typeof window !== 'undefined' &&
      window.matchMedia != null &&
      window.matchMedia('(pointer: coarse)').matches
  } catch {
    return false
  }
}

/** Cursor-following floating image preview for blog list rows.
 *  Implements DESIGN.md §7 interaction #8: spring pop + idle breathing.
 *  Disabled on coarse pointer devices (touchscreens). */
export function PostHoverPreview({preview}: PostHoverPreviewProps) {
  // Lazy initial state — read matchMedia once on first render
  const [coarse] = useState(isCoarsePointer)

  if (!preview || coarse) return null

  const W = 248
  const H = 168
  const GAP = 20
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Sit just to the right of the cursor; flip left near the right edge
  let left = preview.x + GAP
  if (left + W + 12 > vw) left = preview.x - W - GAP
  left = Math.min(vw - W - 12, Math.max(12, left))

  // Vertically centred on the cursor, kept on-screen
  const top = Math.min(vh - H - 12, Math.max(12, preview.y - H / 2))

  return (
    <div
      key={preview.id}
      className="post-preview"
      style={{left, top, width: W, height: H}}
    >
      {preview.assetRef ? (
        <SanityImage
          id={preview.assetRef}
          alt=""
          width={W}
          height={H}
          mode="cover"
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : (
        <div className="post-preview-placeholder" aria-hidden="true" />
      )}
      <div className="post-preview-scan" aria-hidden="true" />
    </div>
  )
}

export type {PreviewState}
