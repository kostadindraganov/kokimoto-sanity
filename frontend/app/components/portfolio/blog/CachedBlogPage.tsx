import {sanityFetch} from '@/sanity/lib/live'
import type {DynamicFetchOptions} from '@/sanity/lib/live'
import {BLOG_PAGE_QUERY, BLOG_POSTS_QUERY, ALL_CATEGORIES_QUERY} from '@/sanity/lib/queries'
import {BlogStream} from './BlogStream'
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
      <BlogStream
        blogPage={blogPage}
        posts={posts}
        categories={categories}
        initialSearch={initialSearch}
        initialCategory={initialCategory}
        eyebrow={eyebrow}
        heading={heading}
        intro={intro}
      />
    </div>
  )
}
