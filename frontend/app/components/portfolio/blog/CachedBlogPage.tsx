import {sanityFetch} from '@/sanity/lib/live'
import type {DynamicFetchOptions} from '@/sanity/lib/live'
import {BLOG_PAGE_QUERY, BLOG_POSTS_QUERY, ALL_CATEGORIES_QUERY} from '@/sanity/lib/queries'
import {BlogBoard} from './BlogBoard'
import type {BlogPageData, BlogPost, BlogCategory} from './types'

interface CachedBlogPageProps extends DynamicFetchOptions {
  initialSearch?: string
  initialCategory?: string
}

export async function CachedBlogPage({
  perspective,
  stega,
  initialSearch,
  initialCategory,
}: CachedBlogPageProps) {
  'use cache'

  const [blogPageResult, postsResult, categoriesResult] = await Promise.all([
    sanityFetch({query: BLOG_PAGE_QUERY, perspective, stega}),
    sanityFetch({query: BLOG_POSTS_QUERY, perspective, stega}),
    sanityFetch({query: ALL_CATEGORIES_QUERY, perspective, stega}),
  ])

  const blogPage = blogPageResult.data as BlogPageData | null
  const posts = (postsResult.data as BlogPost[] | null) ?? []
  const categories = (categoriesResult.data as BlogCategory[] | null) ?? []

  const eyebrow = blogPage?.eyebrow ?? '/blog'
  const heading = blogPage?.heading ?? 'Field notes'
  const intro =
    blogPage?.intro ??
    'Engineering intelligence feed — articles, AI-native notes, framework observations, and the occasional update.'

  return (
    <div className="page">
      {/* Page header */}
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1
          className="h-display"
          style={{fontSize: 'clamp(28px,5vw,46px)', marginTop: 12}}
        >
          {heading}
        </h1>
        <p className="hero-bio" style={{marginTop: 10}}>
          {intro}
        </p>
      </div>

      {/* Prompt line */}
      <div className="prompt" style={{marginTop: 28}}>
        <span className="who">kostadin</span>
        <span className="path">~/blog</span>
        <span className="cmd">tail -f ./blog</span>
        <span className="flag">--latest</span>
        <span className="cursor" aria-hidden="true" />
      </div>

      {/* Blog board (client — handles search, filter, infinite scroll, hover preview) */}
      <BlogBoard
        posts={posts}
        categories={categories}
        blogPage={blogPage}
        initialSearch={initialSearch}
        initialCategory={initialCategory}
      />
    </div>
  )
}
