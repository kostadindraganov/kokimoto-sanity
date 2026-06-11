'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import Link from 'next/link'
import {fmtDate, formatReadTime} from './utils'
import {PostHoverPreview, type PreviewState} from './PostHoverPreview'
import type {BlogPost, BlogCategory, BlogPageData} from './types'

const BLOG_INITIAL = 10
const BLOG_STEP = 5
const BLOG_MAX = 80

interface BlogBoardProps {
  posts: BlogPost[]
  categories: BlogCategory[]
  blogPage: BlogPageData | null
  initialSearch?: string
  initialCategory?: string
}

function getReadTime(post: BlogPost): string {
  if (post.readTime) return formatReadTime(post.readTime)
  return formatReadTime(3) // fallback
}

export function BlogBoard({
  posts,
  categories,
  blogPage,
  initialSearch = '',
  initialCategory = 'All',
}: BlogBoardProps) {
  const [q, setQ] = useState(initialSearch)
  const [cat, setCat] = useState(initialCategory)
  const [preview, setPreview] = useState<PreviewState | null>(null)
  // filterKey tracks when the filter changes so we can reset count
  const [filterKey, setFilterKey] = useState(0)
  const [countPerKey, setCountPerKey] = useState<Record<number, number>>({0: BLOG_INITIAL})
  const count = countPerKey[filterKey] ?? BLOG_INITIAL
  const sentinelRef = useRef<HTMLDivElement>(null)

  const featured = useMemo(() => posts.find((p) => p.featured), [posts])

  const allCatLabels = useMemo(
    () => ['All', ...categories.map((c) => c.title)],
    [categories],
  )

  const baseList = useMemo(() => {
    const s = q.trim().toLowerCase()
    return posts
      .filter((p) => !p.featured)
      .filter(
        (p) =>
          cat === 'All' || p.category?.title === cat,
      )
      .filter(
        (p) =>
          !s ||
          (
            p.title +
            ' ' +
            (p.summary ?? '') +
            ' ' +
            (p.tags ?? []).map((t) => t.title).join(' ')
          )
            .toLowerCase()
            .includes(s),
      )
  }, [q, cat, posts])

  // Show each post once, revealed progressively up to `count`
  const list = useMemo(
    () => baseList.slice(0, Math.min(count, BLOG_MAX)),
    [baseList, count],
  )

  // Sentinel observer — load more when nearing the bottom
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    if (list.length >= BLOG_MAX) return
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setCountPerKey((prev) => ({
              ...prev,
              [filterKey]: Math.min(BLOG_MAX, (prev[filterKey] ?? BLOG_INITIAL) + BLOG_STEP),
            }))
          }
        }
      },
      {rootMargin: '0px 0px 500px 0px'},
    )
    io.observe(el)
    return () => io.disconnect()
  }, [list.length, count, filterKey])

  const atMax = list.length >= baseList.length || list.length >= BLOG_MAX

  const searchPlaceholder = blogPage?.searchPlaceholder ?? 'search field notes…'
  const loadingText = (blogPage?.loadingText ?? 'loading next {n} entries…').replace(
    '{n}',
    String(BLOG_STEP),
  )
  const endText = (blogPage?.endText ?? 'end of feed · {n} entries').replace(
    '{n}',
    String(list.length),
  )
  const noMatchesText =
    blogPage?.noMatchesText ?? '// no entries match — clear the filter or search again'

  return (
    <div className="blog-board">
      {/* Featured post */}
      {featured && (
        <FeaturedPost post={featured} blogPage={blogPage} />
      )}

      {/* Search */}
      <div
        className="row wrap gap-10"
        style={{margin: '26px 0 4px', alignItems: 'center'}}
      >
        <div className="field-prefix" style={{flex: '1 1 240px', maxWidth: 360}}>
          <span className="pfx">/</span>
          <input
            className="tinput"
            placeholder={searchPlaceholder}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setFilterKey((k) => k + 1)
            }}
            aria-label="Search posts"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="row wrap gap-8" style={{margin: '16px 0 8px'}}>
        {allCatLabels.map((c) => (
          <button
            key={c}
            className={'flag' + (cat === c ? ' on' : '')}
            onClick={() => {
              setCat(c)
              setFilterKey((k) => k + 1)
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        className="row"
        style={{
          justifyContent: 'space-between',
          margin: '20px 0 4px',
          alignItems: 'baseline',
        }}
      >
        <div className="sec-head">
          <span className="idx">02</span>
          <h2>log stream</h2>
        </div>
        <span className="faint" style={{fontSize: 12, whiteSpace: 'nowrap'}}>
          {list.length} / {baseList.length} loaded
        </span>
      </div>

      {/* Post list */}
      <div key={cat + q} className="post-list">
        {baseList.length === 0 && (
          <div className="faint" style={{padding: '24px 0'}}>
            {noMatchesText}
          </div>
        )}
        {list.map((p, i) => (
          <Link
            key={p._id}
            href={`/blog/${p.slug}`}
            className="post-row reveal"
            style={{
              animationDelay: i % BLOG_INITIAL * 45 + 'ms',
              borderBottom: '1px solid var(--line-soft)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) =>
              setPreview({
                id: p._id,
                assetRef: p.coverImage?.asset?._ref ?? null,
                x: e.clientX,
                y: e.clientY,
              })
            }
            onMouseMove={(e) =>
              setPreview((cur) =>
                cur && cur.id === p._id
                  ? {...cur, x: e.clientX, y: e.clientY}
                  : cur,
              )
            }
            onMouseLeave={() => setPreview(null)}
          >
            <PostThumb post={p} />
            <span>
              <h4>{p.title}</h4>
              <p className="psum">{p.summary}</p>
              <span className="pmeta" style={{marginTop: 8}}>
                <span className="cat">{p.category?.title}</span>
                <span>·</span>
                <span>
                  {(p.tags ?? []).map((t) => '#' + t.title).join(' ')}
                </span>
              </span>
            </span>
            <span className="read">{getReadTime(p)} ↗</span>
          </Link>
        ))}
      </div>

      {/* Sentinel / load more */}
      {baseList.length > 0 && (
        <div
          ref={sentinelRef}
          className="bento-sentinel"
          aria-live="polite"
          style={{minHeight: 64}}
        >
          {atMax ? (
            <span className="bento-sentinel-end">
              <span className="bs-dot">●</span> {endText}
            </span>
          ) : (
            <span className="bento-sentinel-loading">
              <span className="spinner" aria-hidden="true" />
              <span>{loadingText}</span>
              <span className="bs-meta">·</span>
              <span className="bs-meta">
                {list.length}/{Math.min(BLOG_MAX, count + BLOG_STEP)}
              </span>
            </span>
          )}
        </div>
      )}

      {/* Cursor-following hover preview */}
      <PostHoverPreview preview={preview} />

      {/* Archive note */}
      <div
        className="row gap-10 metarow"
        style={{
          marginTop: 24,
          color: 'var(--ink-4)',
          fontSize: 12.5,
          flexWrap: 'wrap',
        }}
      >
        <span>{blogPage?.archiveLabel ?? '// archive'}</span>
        <span className="faint">
          {(blogPage?.archiveNote ?? '{n} unique entries · {year} · rss available')
            .replace('{n}', String(posts.length))
            .replace('{year}', String(new Date().getFullYear()))}
        </span>
      </div>
    </div>
  )
}

function FeaturedPost({
  post,
  blogPage,
}: {
  post: BlogPost
  blogPage: BlogPageData | null
}) {
  const readLabel = blogPage?.readButtonLabel ?? 'read article'
  const badge = blogPage?.featuredBadge ?? 'pinned'
  const panelTitle = blogPage?.featuredPanelTitle ?? '~/blog'

  return (
    <div className="panel feat">
      <div className="panel-head">
        <span className="lights">
          <i />
          <i />
          <i />
        </span>
        <span className="title">{panelTitle}</span>
        <span className="meta">{badge}</span>
      </div>
      <div className="panel-body feat-body">
        <div className="feat-text">
          <div
            className="row gap-10 metarow"
            style={{fontSize: 11.5, marginBottom: 14, flexWrap: 'wrap'}}
          >
            <span className="acc">{post.category?.title}</span>
            <span className="faint">·</span>
            <span className="faint tnum">{fmtDate(post.date)}</span>
            <span className="faint">·</span>
            <span className="faint">{post.readTime ? formatReadTime(post.readTime) : '3 min read'}</span>
          </div>
          <h3
            className="h-display"
            style={{fontSize: 'clamp(22px,3.4vw,32px)', lineHeight: 1.08}}
          >
            {post.title}
          </h3>
          <p className="hero-bio" style={{marginTop: 12, maxWidth: '62ch'}}>
            {post.summary}
          </p>
          <div className="row wrap gap-8" style={{marginTop: 16}}>
            <span className="chips">
              {(post.tags ?? []).map((t) => (
                <span key={t._id} className="chip">
                  #{t.title}
                </span>
              ))}
            </span>
          </div>
          <div style={{marginTop: 20}}>
            <Link
              href={`/blog/${post.slug}`}
              className="btn primary"
            >
              <span className="car">▸</span>
              {readLabel}
            </Link>
          </div>
        </div>
        {post.coverImage?.asset?._ref && (
          <div className="feat-cover" aria-hidden="true">
            <SanityImageFeatured assetRef={post.coverImage.asset._ref} alt={post.coverImage.alt ?? ''} />
            <div className="feat-cover-scan" />
            <div className="feat-cover-glow" />
          </div>
        )}
      </div>
    </div>
  )
}

/** Build a cropped Sanity CDN URL from an asset ref, or null if unavailable. */
function sanityImageUrl(
  assetRef: string | null | undefined,
  w: number,
  h: number,
): string | null {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId || !dataset || !assetRef) return null
  const [, hash, dims, ext] = assetRef.match(/^image-([a-z0-9]+)-(\d+x\d+)-(\w+)$/) ?? []
  if (!hash) return null
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${dims}.${ext}?w=${w}&h=${h}&fit=crop&auto=format`
}

// Log-stream row thumbnail: cover image, black gradient, white date, CLI scan line.
function PostThumb({post}: {post: BlogPost}) {
  const src = sanityImageUrl(post.coverImage?.asset?._ref, 200, 150)
  return (
    <span className="pthumb" aria-hidden="true">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" />
      )}
      <span className="pthumb-grad" />
      <span className="pthumb-scan" />
      <span className="pthumb-date tnum">{fmtDate(post.date)}</span>
    </span>
  )
}

// A simple wrapper to keep the featured post cover in line
function SanityImageFeatured({assetRef, alt}: {assetRef: string; alt: string}) {
  // We need the full URL for the image. Use the image URL pattern.
  // SanityImage is a client-side-compatible import here (no 'use server').
  // But SanityImage from sanity-image library needs to be imported here.
  // Rather than import the server component here, render a plain img tag
  // with the CDN URL pattern.
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId || !dataset || !assetRef) return null
  const base = `https://cdn.sanity.io/images/${projectId}/${dataset}/`
  // asset ref: "image-<hash>-<w>x<h>-<ext>"
  const [, hash, dims, ext] = assetRef.match(/^image-([a-z0-9]+)-(\d+x\d+)-(\w+)$/) ?? []
  if (!hash) return null
  const src = `${base}${hash}-${dims}.${ext}?w=600&h=400&fit=crop&auto=format`
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
}
