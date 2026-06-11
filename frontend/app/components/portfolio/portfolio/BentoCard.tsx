'use client'

import Image from 'next/image'
import Link from 'next/link'
import {stegaClean} from 'next-sanity'
import {type CSSProperties, useEffect, useMemo, useRef} from 'react'

import {dataAttr, urlForImage} from '@/sanity/lib/utils'

import {shortHash} from './interpolate'
import {Pill} from './primitives'
import type {ProjectListItem} from './types'
import {useOptimisticTags} from './useOptimisticTags'

export type BentoSize = 'xl' | 'wide' | 'tall' | 's' | 'm'

/* asymmetric bento sizes — applied positionally so the grid stays balanced */
export const BENTO_SIZES_FULL: BentoSize[] = ['xl', 'wide', 'tall', 's', 'wide', 's']

const TONES = ['a', 'b', 'c', 'd', 'e', 'f'] as const

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reveal = () => el.classList.add('in')
    if (typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal()
            io.unobserve(e.target)
          }
        }
      },
      // reveal cards as they approach (positive bottom margin) so the grid
      // isn't a wall of blank shells just below the fold
      {threshold: 0.18, rootMargin: '0px 0px 20% 0px'},
    )
    io.observe(el)
    // safety net: never leave a card blank even if it's never scrolled into view
    const fallback = window.setTimeout(reveal, 1200)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])
  return ref
}

export function BentoCard({p, size, idx}: {p: ProjectListItem; size: BentoSize; idx: number}) {
  const ref = useScrollReveal<HTMLAnchorElement>()
  const tone = TONES[idx % 6]
  const cleanTitle = stegaClean(p.title) || ''
  // split into chars (with non-breaking-space for spaces) so we can stagger reveal
  const titleChars = useMemo(() => Array.from(cleanTitle), [cleanTitle])
  const tags = useOptimisticTags(p._id, p.tags ?? [])
  const coverUrl = p.coverImage?.asset
    ? urlForImage(p.coverImage).width(1200).height(900).fit('crop').url()
    : null

  return (
    <Link
      ref={ref}
      href={`/portfolio/${stegaClean(p.slug)}`}
      className={'bento bento-' + size + ' bento-tone-' + tone}
      style={{'--i': idx, '--delay': idx * 70 + 'ms'} as CSSProperties}
    >
      <div className="bento-art">
        <div
          className="bento-art-inner"
          data-sanity={dataAttr({id: p._id, type: p._type, path: 'coverImage'}).toString()}
        >
          {coverUrl ? (
            <Image
              className="bento-img"
              src={coverUrl}
              alt={stegaClean(p.coverImage?.alt) || cleanTitle + ' cover'}
              width={1200}
              height={900}
            />
          ) : (
            <div className="ph" style={{minHeight: '100%'}} aria-hidden="true" />
          )}
          <div className="bento-art-scan" aria-hidden="true" />
          <div className="bento-art-glow" aria-hidden="true" />
        </div>
      </div>

      <div className="bento-meta">
        <div className="bento-head" data-r="0">
          <span className="commit tnum">{shortHash(stegaClean(p.slug) || p._id)}</span>
          <span
            className="bento-status"
            data-sanity={dataAttr({id: p._id, type: p._type, path: 'status'}).toString()}
          >
            <Pill status={p.status} />
          </span>
        </div>

        <h3
          className="bento-title"
          aria-label={cleanTitle}
          data-r="1"
          data-sanity={dataAttr({id: p._id, type: p._type, path: 'title'}).toString()}
        >
          {titleChars.map((ch, i) => (
            <span key={i} className="bento-ch" style={{'--ci': i} as CSSProperties}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
          <span className="bento-title-cursor" aria-hidden="true">
            ▍
          </span>
        </h3>

        <div className="bento-commit" data-r="2">
          <span className="acc">◇</span>
          <span
            className="bento-commit-msg"
            data-sanity={dataAttr({id: p._id, type: p._type, path: 'commit'}).toString()}
          >
            {p.commit}
          </span>
        </div>

        {p.summary && (
          <p
            className="bento-problem"
            data-r="3"
            data-sanity={dataAttr({id: p._id, type: p._type, path: 'description'}).toString()}
          >
            {p.summary}
          </p>
        )}

        <div className="bento-foot" data-r="4">
          <div
            className="bento-tags"
            data-sanity={dataAttr({id: p._id, type: p._type, path: 'tags'}).toString()}
          >
            {tags.slice(0, size === 's' ? 2 : 3).map((t, ti) => (
              <span
                key={t._key}
                className="bento-tag"
                style={{'--ti': ti} as CSSProperties}
                data-sanity={dataAttr({
                  id: p._id,
                  type: p._type,
                  path: `tags[_key=="${t._key}"]`,
                }).toString()}
              >
                #{stegaClean(t.title)}
              </span>
            ))}
          </div>
          <span className="bento-cta" aria-hidden="true">
            <span className="bento-cta-label">open</span>
            <span className="bento-cta-line" />
            <span className="bento-cta-arr">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
