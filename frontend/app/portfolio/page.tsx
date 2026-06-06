import type {Metadata} from 'next'
import {stegaClean} from 'next-sanity'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

import {PortfolioBoard} from '@/app/components/portfolio/portfolio/PortfolioBoard'
import type {
  PortfolioPageData,
  ProjectListItem,
  TagDoc,
} from '@/app/components/portfolio/portfolio/types'
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from '@/sanity/lib/live'
import {
  PORTFOLIO_PAGE_QUERY,
  PORTFOLIO_PROJECTS_QUERY,
  PORTFOLIO_TAGS_QUERY,
} from '@/sanity/lib/queries'
import {dataAttr, resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const {data} = await sanityFetchMetadata({query: PORTFOLIO_PAGE_QUERY, perspective})
  const page = data as PortfolioPageData | null
  const ogImage = resolveOpenGraphImage(page?.seo?.ogImage)
  return {
    title: page?.seo?.metaTitle || stegaClean(page?.heading) || undefined,
    description: page?.seo?.metaDescription || stegaClean(page?.intro) || undefined,
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

export default async function PortfolioPage() {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<div className="page" />}>
        <DynamicPortfolio />
      </Suspense>
    )
  }
  return <CachedPortfolio perspective="published" stega={false} />
}

async function DynamicPortfolio() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedPortfolio perspective={perspective} stega={stega} />
}

async function CachedPortfolio({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const [{data: pageData}, {data: projectsData}, {data: tagsData}] = await Promise.all([
    sanityFetch({query: PORTFOLIO_PAGE_QUERY, perspective, stega}),
    sanityFetch({query: PORTFOLIO_PROJECTS_QUERY, perspective, stega}),
    sanityFetch({query: PORTFOLIO_TAGS_QUERY, perspective, stega}),
  ])
  const page = pageData as PortfolioPageData | null
  const projects = (projectsData ?? []) as ProjectListItem[]
  const tags = (tagsData ?? []) as TagDoc[]

  const pageAttr = (path: string) =>
    page ? dataAttr({id: page._id, type: page._type, path}).toString() : undefined

  return (
    <div className="page">
      <div>
        <div className="eyebrow" data-sanity={pageAttr('eyebrow')}>
          {page?.eyebrow}
        </div>
        <h1
          className="h-display"
          style={{fontSize: 'clamp(28px,5vw,46px)', marginTop: 12}}
          data-sanity={pageAttr('heading')}
        >
          {page?.heading}
        </h1>
        <p className="hero-bio" style={{marginTop: 10}} data-sanity={pageAttr('intro')}>
          {page?.intro}
        </p>
      </div>

      <div style={{marginTop: 28}}>
        <PortfolioBoard page={page} projects={projects} tags={tags} />
      </div>
    </div>
  )
}
