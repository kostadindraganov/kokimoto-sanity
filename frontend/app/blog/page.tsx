import type {Metadata} from 'next'
import {Suspense} from 'react'
import {draftMode} from 'next/headers'
import {CachedBlogPage} from '@/app/components/portfolio/blog/CachedBlogPage'
import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {BLOG_PAGE_QUERY} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const {data} = await sanityFetchMetadata({query: BLOG_PAGE_QUERY, perspective})
  const page = data as {heading?: string | null; intro?: string | null; seo?: {metaTitle?: string | null; metaDescription?: string | null} | null} | null
  return {
    title: page?.seo?.metaTitle ?? page?.heading ?? 'Field notes',
    description: page?.seo?.metaDescription ?? page?.intro ?? 'Engineering intelligence feed',
  }
}

interface BlogPageProps {
  searchParams: Promise<{search?: string; category?: string}>
}

export default async function BlogPage({searchParams}: BlogPageProps) {
  const {isEnabled: isDraftMode} = await draftMode()
  const {search, category} = await searchParams

  if (isDraftMode) {
    return (
      <Suspense fallback={<BlogPageFallback />}>
        <DynamicBlogPage
          searchParams={searchParams}
        />
      </Suspense>
    )
  }

  return (
    <CachedBlogPage
      perspective="published"
      stega={false}
      initialSearch={search}
      initialCategory={category}
    />
  )
}

async function DynamicBlogPage({
  searchParams,
}: {
  searchParams: Promise<{search?: string; category?: string}>
}) {
  const [{perspective, stega}, {search, category}] = await Promise.all([
    getDynamicFetchOptions(),
    searchParams,
  ])
  return (
    <CachedBlogPage
      perspective={perspective}
      stega={stega}
      initialSearch={search}
      initialCategory={category}
    />
  )
}

function BlogPageFallback() {
  return (
    <div className="page">
      <div className="panel" style={{marginTop: 32}}>
        <div className="panel-head">
          <span className="lights">
            <i />
            <i />
            <i />
          </span>
          <span className="title">~/blog</span>
          <span className="meta">loading</span>
        </div>
        <div className="panel-body">
          <div className="out muted">
            <span className="spinner" aria-hidden="true" /> streaming field notes…
          </div>
        </div>
      </div>
    </div>
  )
}
