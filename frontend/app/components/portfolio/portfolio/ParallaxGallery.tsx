'use client'

/* ============================================================
   ParallaxGallery — "03 interface" section.
   Horizontal parallax gallery adapted from David Faure's
   2D/DOM Codrops demo (horizontal-parallax-gallery). A tall
   scroll "track" pins a full-bleed viewport; vertical scroll
   progress pans a flex row of project screenshots, and each
   image counter-shifts inside an over-scaled layer for a
   maximised parallax depth.

   Reduced-motion / coarse-pointer / small screens fall back to
   a native horizontal swipe strip (no pin, no parallax).
   ============================================================ */

import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {useEffect, useRef, useState} from 'react'

import {urlForImage} from '@/sanity/lib/utils'

import type {SanityImageValue} from './types'

// Image layer is 160% wide (left:-30%). translateX(%) is relative to that
// width, so the no-gap ceiling is (160-100)/2 / (160/100) ≈ 18.75% → 18.
const MAX_SHIFT = 18
// Pin sits between the sticky topbar (52px) and statusbar (30px).
const TOPBAR_H = 52

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export function ParallaxGallery({
  images,
  projAttr,
}: {
  images: SanityImageValue[]
  projAttr: (path: string) => string | undefined
}) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const pinRef = useRef<HTMLDivElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  // Default to the pinned experience; downgrade on the client when the
  // environment can't support it well (touch, narrow, reduced-motion).
  const [pinned, setPinned] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse || window.innerWidth < 760) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPinned(false)
    }
  }, [])

  useEffect(() => {
    if (!pinned) return
    const track = trackRef.current
    const pin = pinRef.current
    const row = rowRef.current
    if (!track || !pin || !row) return

    let pan = 0 // horizontal distance the row must travel
    let raf = 0

    const measure = () => {
      pan = Math.max(0, row.scrollWidth - pin.clientWidth)
      // Track height = pinned viewport + pan distance, so scrolling the pan
      // distance vertically maps 1:1 to panning the row horizontally.
      track.style.height = `${pin.clientHeight + pan}px`
      update()
    }

    const update = () => {
      const rect = track.getBoundingClientRect()
      const range = track.offsetHeight - pin.clientHeight
      const scrolled = TOPBAR_H - rect.top
      const progress = range > 0 ? clamp(scrolled / range, 0, 1) : 0
      row.style.transform = `translate3d(${-(progress * pan)}px,0,0)`

      // Per-image counter-shift based on each frame's distance from the
      // panel centre (the panel is content-width, not the viewport).
      const pinRect = pin.getBoundingClientRect()
      const center = pinRect.left + pinRect.width * 0.5
      const half = pinRect.width * 0.5 || 1
      for (const layer of layerRefs.current) {
        const media = layer?.parentElement
        if (!layer || !media) continue
        const mr = media.getBoundingClientRect()
        const t = clamp((mr.left + mr.width * 0.5 - center) / half, -1, 1)
        layer.style.transform = `translate3d(${-t * MAX_SHIFT}%,0,0)`
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    measure()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(row)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      ro.disconnect()
      track.style.height = ''
    }
  }, [pinned, images.length])

  const frames = images.map((img, i) => {
    const src = urlForImage(img).width(1600).height(1000).fit('crop').url()
    const caption = stegaClean(img.caption)
    return (
      <figure
        className="pgal-media"
        key={img._key ?? i}
        data-sanity={projAttr(img._key ? `gallery[_key=="${img._key}"]` : 'gallery')}
      >
        <div className="pgal-layer" ref={(el) => void (layerRefs.current[i] = el)}>
          <Image
            src={src}
            alt={stegaClean(img.alt) || ''}
            fill
            sizes="(max-width: 760px) 86vw, 72vw"
            style={{objectFit: 'cover'}}
            draggable={false}
          />
        </div>
        {caption && <figcaption className="pgal-cap">{caption}</figcaption>}
      </figure>
    )
  })

  if (!pinned) {
    return (
      <div className="pgal-strip" data-sanity={projAttr('gallery')}>
        {frames}
      </div>
    )
  }

  return (
    <div className="pgal" ref={trackRef} data-sanity={projAttr('gallery')}>
      <div className="pgal-pin" ref={pinRef}>
        <div className="pgal-row" ref={rowRef}>
          {frames}
        </div>
      </div>
    </div>
  )
}

export default ParallaxGallery
