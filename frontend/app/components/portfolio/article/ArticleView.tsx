import Link from 'next/link'
import {fmtDate, extractHeadings, formatReadTime, computeReadTime, countWordsInBody} from '@/app/components/portfolio/blog/utils'
import {ArticleSidebar} from './ArticleSidebar'
import {ArticlePortableText} from './ArticlePortableText'
import type {BlogPostDetail, BlogPost, BlogTag, ArticleLabels} from '@/app/components/portfolio/blog/types'
import {dataAttr} from '@/sanity/lib/utils'

interface RecentPost {
  _id: string
  title: string
  slug: string
  date: string
}

interface ArticleViewProps {
  post: BlogPostDetail
  prevPost: BlogPost | null
  nextPost: BlogPost | null
  allPosts: BlogPost[]
  categories: Array<{title: string; slug: string; count: number}>
  allTags: BlogTag[]
  recentPosts: RecentPost[]
  labels: ArticleLabels | null
  perspective: string
  stega: boolean
}

export function ArticleView({
  post,
  prevPost,
  nextPost,
  allPosts,
  categories,
  allTags,
  recentPosts,
  labels,
  stega,
}: ArticleViewProps) {
  // Derive TOC from body headings
  const tocItems = extractHeadings(post.body as unknown[] | null | undefined)

  // Compute archive entries from all posts
  const archiveMap: Record<string, number> = {}
  for (const p of allPosts) {
    if (p.date) {
      const dt = new Date(p.date + 'T00:00:00')
      const key = dt.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})
      archiveMap[key] = (archiveMap[key] ?? 0) + 1
    }
  }
  const archiveEntries = Object.entries(archiveMap) as Array<[string, number]>

  // Reading time
  const readTime = post.readTime
    ? formatReadTime(post.readTime)
    : formatReadTime(computeReadTime(countWordsInBody(post.body as unknown[] | null | undefined)))

  const backLabel = labels?.backLabel ?? 'back to blog'
  const moreNotesHeading = labels?.moreNotesHeading ?? 'more notes'
  const figCaptionPrefix = labels?.figCaptionPrefix ?? 'fig.'

  const bodyDataAttr = stega
    ? {
        'data-sanity': dataAttr({
          id: post._id,
          type: post._type,
          path: 'body',
        }).toString(),
      }
    : {}

  const titleDataAttr = stega
    ? {
        'data-sanity': dataAttr({
          id: post._id,
          type: post._type,
          path: 'title',
        }).toString(),
      }
    : {}

  return (
    <div className="page">
      <div className="article-layout">
        <div className="article-main">
          {/* Breadcrumb */}
          <Link href="/blog" className="crumb">
            <span className="ar">←</span> cd ../blog
          </Link>

          {/* Post header */}
          <div style={{marginTop: 26}}>
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
                <span
                  className="faint"
                  style={{display: 'block', fontSize: 12}}
                >
                  Senior · AI-Native Engineer
                </span>
              </span>
            </div>
          </div>

          {/* Hero cover image */}
          {post.coverImage?.asset?._ref && (
            <figure className="article-hero" style={{marginTop: 24}}>
              <ArticleHeroImage
                assetRef={post.coverImage.asset._ref}
                alt={post.coverImage.alt ?? post.title}
              />
              <div className="article-hero-scan" aria-hidden="true" />
              <div className="article-hero-glow" aria-hidden="true" />
              <figcaption className="article-hero-cap">
                <span className="acc">▸</span> {post.coverImage.alt ?? post.title}
              </figcaption>
            </figure>
          )}

          {/* Body */}
          <div {...bodyDataAttr}>
            <ArticlePortableText
              value={post.body as Parameters<typeof ArticlePortableText>[0]['value']}
              figCaptionPrefix={figCaptionPrefix}
            />
          </div>

          {/* Tags + pagination */}
          <div style={{marginTop: 44}}>
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
        </div>

        {/* Sidebar */}
        <aside className="article-aside">
          <ArticleSidebar
            post={post}
            tocItems={tocItems}
            categories={categories}
            allTags={allTags}
            recentPosts={recentPosts}
            archiveEntries={archiveEntries}
            labels={labels}
          />
        </aside>
      </div>
    </div>
  )
}

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
