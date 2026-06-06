import type {Metadata} from 'next'
import {Suspense} from 'react'
import {draftMode} from 'next/headers'
import {CachedArticlePage} from '@/app/components/portfolio/article/CachedArticlePage'
import {getDynamicFetchOptions, sanityFetchStaticParams, sanityFetchMetadata} from '@/sanity/lib/live'
import {POSTS_SLUG_QUERY, POST_BY_SLUG_QUERY} from '@/sanity/lib/queries'

/** Pre-render all published post slugs at build time */
export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({query: POSTS_SLUG_QUERY})
  return data ?? []
}

export async function generateMetadata(props: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const {slug} = await props.params
  const {perspective} = await getDynamicFetchOptions()
  const {data: post} = await sanityFetchMetadata({
    query: POST_BY_SLUG_QUERY,
    params: {slug},
    perspective,
  })
  const p = post as {
    title?: string | null
    summary?: string | null
    seo?: {metaTitle?: string | null; metaDescription?: string | null} | null
  } | null

  if (!p) return {title: 'Post not found'}

  return {
    title: p.seo?.metaTitle ?? p.title ?? 'Field note',
    description: p.seo?.metaDescription ?? p.summary ?? '',
  }
}

export default async function ArticlePage(props: PageProps<'/blog/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  const {slug} = await props.params

  if (isDraftMode) {
    return (
      <Suspense fallback={<ArticleFallback />}>
        <DynamicArticlePage params={props.params} />
      </Suspense>
    )
  }

  return <CachedArticlePage slug={slug} perspective="published" stega={false} />
}

async function DynamicArticlePage({
  params,
}: Pick<PageProps<'/blog/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ])
  return <CachedArticlePage slug={slug} perspective={perspective} stega={stega} />
}

function ArticleFallback() {
  return (
    <div className="page">
      <div className="article-layout">
        <div className="article-main">
          <div className="panel" style={{marginTop: 16}}>
            <div className="panel-head">
              <span className="lights">
                <i />
                <i />
                <i />
              </span>
              <span className="title">~/blog/…</span>
              <span className="meta">loading</span>
            </div>
            <div className="panel-body">
              <div className="out muted">
                <span className="spinner" aria-hidden="true" /> resolving article…
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
