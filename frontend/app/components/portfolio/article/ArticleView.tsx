import {extractHeadings, formatReadTime, computeReadTime, countWordsInBody} from '@/app/components/portfolio/blog/utils'
import {ArticleSidebar} from './ArticleSidebar'
import {ArticleMainStream} from './ArticleMainStream'
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
          <ArticleMainStream
            post={post}
            prevPost={prevPost}
            nextPost={nextPost}
            readTime={readTime}
            backLabel={backLabel}
            moreNotesHeading={moreNotesHeading}
            figCaptionPrefix={figCaptionPrefix}
            titleDataAttr={titleDataAttr}
            bodyDataAttr={bodyDataAttr}
          />
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

