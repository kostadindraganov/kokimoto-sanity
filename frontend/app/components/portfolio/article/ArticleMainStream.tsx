'use client'

/* ============================================================
   ArticleMainStream.tsx — streaming reveal for .article-main.
   Client component: runs useStreamReveal + builds StreamStep[]
   from serializable props passed down by the server ArticleView.
   Only .article-main streams; .article-aside stays static.
   ============================================================ */

import {useMemo} from 'react'
import Link from 'next/link'
import {stegaClean} from 'next-sanity'

import {useStreamReveal} from '../fx/useStreamReveal'
import {shellPrompt, Stream, type StreamStep} from '../home/fx/Streaming'
import {fmtDate} from '../blog/utils'
import {ArticlePortableText} from './ArticlePortableText'
import type {BlogPostDetail, BlogPost} from '../blog/types'

/* ---------- ArticleHeroImage (moved here — client-safe, uses env vars + img) ---------- */

function ArticleHeroImage({assetRef, alt}: {assetRef: string; alt: string}) {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId || !dataset) return null
  const base = `https://cdn.sanity.io/images/${projectId}/${dataset}/`
  const match = assetRef.match(/^image-([a-z0-9]+)-(\d+x\d+)-(\w+)$/)
  if (!match) return null
  const [, hash, dims, ext] = match
  const src = `${base}${hash}-${dims}.${ext}?w=1200&h=600&fit=crop&auto=format`
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" style={{width: '100%', height: 'auto'}} />
}

/* ---------- props ---------- */

export interface ArticleMainStreamProps {
  post: BlogPostDetail
  prevPost: BlogPost | null
  nextPost: BlogPost | null
  readTime: string
  backLabel: string
  moreNotesHeading: string
  figCaptionPrefix: string
  titleDataAttr: {'data-sanity'?: string}
  bodyDataAttr: {'data-sanity'?: string}
}

/* ---------- component ---------- */

export function ArticleMainStream({
  post,
  prevPost,
  nextPost,
  readTime,
  backLabel,
  moreNotesHeading,
  figCaptionPrefix,
  titleDataAttr,
  bodyDataAttr,
}: ArticleMainStreamProps) {
  const slug = stegaClean(post.slug)
  const {animate, streamKey, onComplete} = useStreamReveal(`blog/${slug}`)

  const steps = useMemo<StreamStep[]>(() => {
    const hasCover = Boolean(post.coverImage?.asset?._ref)

    const baseSteps: StreamStep[] = [
      /* 1 — breadcrumb */
      {
        kind: 'node',
        gap: 0,
        delay: 140,
        node: (
          <Link href="/blog" className="crumb">
            <span className="ar">←</span> cd ../blog
          </Link>
        ),
      },

      /* 2 — post header */
      {
        kind: 'node',
        gap: 26,
        delay: 180,
        node: (
          <div>
            <div className="amast">
              <span className="cat">{post.category?.title}</span>
              <span className="faint">·</span>
              <span className="faint tnum">{fmtDate(post.date)}</span>
              <span className="faint">·</span>
              <span className="faint">{readTime}</span>
            </div>
            <h1
              className="h-display"
              style={{
                fontSize: 'clamp(28px,5vw,48px)',
                marginTop: 14,
                lineHeight: 1.05,
                maxWidth: '20ch',
              }}
              {...titleDataAttr}
            >
              {post.title}
            </h1>
            <div className="row gap-10" style={{marginTop: 18}}>
              <span className="mark" style={{width: 30, height: 30, fontSize: 14}}>
                k
              </span>
              <span>
                <span style={{color: 'var(--ink)'}}>Kostadin Draganov</span>
                <span className="faint" style={{display: 'block', fontSize: 12}}>
                  Senior · AI-Native Engineer
                </span>
              </span>
            </div>
          </div>
        ),
      },

      /* 3 — shell prompt */
      {
        kind: 'prompt',
        gap: 30,
        segments: shellPrompt('kostadin', `cat ./blog/${slug}.md`),
      },

      /* 4 — tools: generating cover image */
      {
        kind: 'tools',
        label: 'generating cover image',
        collapsedLabel: '4 tool uses',
        actions: [
          'Sampling palette from post',
          'Compositing diagram layers',
          'Rendering 1600×800 cover',
          'Encoding + optimizing',
        ],
      },

      /* 5 — think */
      {kind: 'think', duration: 1000},
    ]

    /* 6 — hero cover (conditional) */
    if (hasCover) {
      baseSteps.push({
        kind: 'node',
        gap: 24,
        delay: 240,
        node: (
          <figure className="article-hero" style={{marginTop: 24}}>
            <ArticleHeroImage
              assetRef={post.coverImage!.asset._ref}
              alt={post.coverImage!.alt ?? post.title}
            />
            <div className="article-hero-scan" aria-hidden="true" />
            <div className="article-hero-glow" aria-hidden="true" />
            <figcaption className="article-hero-cap">
              <span className="acc">▸</span> {post.coverImage!.alt ?? post.title}
            </figcaption>
          </figure>
        ),
      })
    }

    /* 7 — tools: running tools */
    baseSteps.push({
      kind: 'tools',
      label: 'running tools',
      collapsedLabel: '4 tool uses',
      actions: [
        'Resolving article',
        'Rendering markdown',
        'Computing reading time',
        'Linking references',
      ],
    })

    /* 8 — body */
    baseSteps.push({
      kind: 'node',
      delay: 320,
      node: (
        <div {...bodyDataAttr}>
          <ArticlePortableText
            value={post.body as Parameters<typeof ArticlePortableText>[0]['value']}
            figCaptionPrefix={figCaptionPrefix}
          />
        </div>
      ),
    })

    /* 9 — tags + more notes + pager + back */
    baseSteps.push({
      kind: 'node',
      gap: 44,
      delay: 160,
      node: (
        <div>
          <div className="chips" style={{marginBottom: 28}}>
            {(post.tags ?? []).map((t) => (
              <span key={t._id} className="chip">
                #{t.title}
              </span>
            ))}
          </div>

          <div className="sec-head">
            <span className="idx">—</span>
            <h2>{moreNotesHeading}</h2>
          </div>

          <div className="pager">
            {prevPost ? (
              <Link className="prev" href={`/blog/${prevPost.slug}`}>
                <span className="pk">
                  <span className="ar">←</span> previous
                </span>
                <span className="pt">{prevPost.title}</span>
              </Link>
            ) : (
              <span className="prev empty" />
            )}
            {nextPost ? (
              <Link className="next" href={`/blog/${nextPost.slug}`}>
                <span className="pk">
                  next <span className="ar">→</span>
                </span>
                <span className="pt">{nextPost.title}</span>
              </Link>
            ) : (
              <span className="next empty" />
            )}
          </div>

          <div style={{marginTop: 22}}>
            <Link href="/blog" className="btn ghost">
              <span className="car">▸</span>
              {backLabel}
            </Link>
          </div>
        </div>
      ),
    })

    return baseSteps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, prevPost, nextPost, readTime, slug, figCaptionPrefix, backLabel, moreNotesHeading])

  return <Stream key={streamKey} steps={steps} animate={animate} onComplete={onComplete} />
}
