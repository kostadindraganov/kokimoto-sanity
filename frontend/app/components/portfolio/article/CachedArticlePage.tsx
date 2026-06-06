import {sanityFetch} from '@/sanity/lib/live'
import type {DynamicFetchOptions} from '@/sanity/lib/live'
import {
  POST_BY_SLUG_QUERY,
  BLOG_POSTS_QUERY,
  ALL_CATEGORIES_QUERY,
  BLOG_PAGE_QUERY,
  RECENT_POSTS_QUERY,
} from '@/sanity/lib/queries'
import {ArticleView} from './ArticleView'
import {notFound} from 'next/navigation'
import type {BlogPostDetail, BlogPost, BlogCategory, BlogTag, ArticleLabels} from '@/app/components/portfolio/blog/types'

interface CachedArticlePageProps extends DynamicFetchOptions {
  slug: string
}

export async function CachedArticlePage({
  slug,
  perspective,
  stega,
}: CachedArticlePageProps) {
  'use cache'

  const [postResult, allPostsResult, categoriesResult, blogPageResult, recentResult] =
    await Promise.all([
      sanityFetch({query: POST_BY_SLUG_QUERY, params: {slug}, perspective, stega}),
      sanityFetch({query: BLOG_POSTS_QUERY, perspective, stega}),
      sanityFetch({query: ALL_CATEGORIES_QUERY, perspective, stega}),
      sanityFetch({query: BLOG_PAGE_QUERY, perspective, stega}),
      sanityFetch({query: RECENT_POSTS_QUERY, perspective, stega}),
    ])

  const post = postResult.data as BlogPostDetail | null
  if (!post) notFound()

  const allPosts = (allPostsResult.data as BlogPost[] | null) ?? []
  const categories = (categoriesResult.data as BlogCategory[] | null) ?? []
  const recentPosts = (recentResult.data as Array<{
    _id: string
    title: string
    slug: string
    date: string
  }> | null) ?? []

  // Unique tags across all posts
  const tagMap = new Map<string, BlogTag>()
  for (const p of allPosts) {
    for (const t of p.tags ?? []) {
      tagMap.set(t._id, t)
    }
  }
  const allTags: BlogTag[] = [...tagMap.values()].sort((a, b) =>
    a.title.localeCompare(b.title),
  )

  // Sorted posts for prev/next navigation
  const sortedPosts = [...allPosts].sort((a, b) => (a.date < b.date ? 1 : -1))
  const idx = sortedPosts.findIndex((p) => p.slug === slug)
  const prevPost = idx > 0 ? (sortedPosts[idx - 1] ?? null) : null
  const nextPost = idx < sortedPosts.length - 1 ? (sortedPosts[idx + 1] ?? null) : null

  // Category counts for sidebar
  const catCounts: Record<string, number> = {}
  for (const p of allPosts) {
    if (p.category?.title) {
      catCounts[p.category.title] = (catCounts[p.category.title] ?? 0) + 1
    }
  }
  const sidebarCategories = categories.map((c) => ({
    title: c.title,
    slug: c.slug,
    count: catCounts[c.title] ?? 0,
  }))

  const blogPageData = blogPageResult.data as {articleLabels?: ArticleLabels | null} | null
  const labels: ArticleLabels | null = blogPageData?.articleLabels ?? null

  // Serialize perspective for ArticleView (which accepts string, not LivePerspective)
  const perspectiveStr = Array.isArray(perspective)
    ? 'published'
    : (perspective as string)

  return (
    <ArticleView
      post={post}
      prevPost={prevPost}
      nextPost={nextPost}
      allPosts={allPosts}
      categories={sidebarCategories}
      allTags={allTags}
      recentPosts={recentPosts}
      labels={labels}
      perspective={perspectiveStr}
      stega={stega}
    />
  )
}
