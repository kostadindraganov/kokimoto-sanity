import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import {sanityFetch} from '@/sanity/lib/live'
import type {DynamicFetchOptions} from '@/sanity/lib/live'

import {ProjectDetail} from '@/app/components/portfolio/portfolio/ProjectDetail'
import type {
  PortfolioPageData,
  ProjectDetailData,
  ProjectPagerEntry,
} from '@/app/components/portfolio/portfolio/types'

import {PORTFOLIO_PAGE_QUERY, PROJECT_DETAIL_QUERY, PROJECT_PAGER_QUERY} from '../queries'

interface CachedProjectPageProps extends DynamicFetchOptions {
  slug: string
}

export async function CachedProjectPage({slug, perspective, stega}: CachedProjectPageProps) {
  'use cache'

  const [pageResult, projectResult, pagerResult] = await Promise.all([
    sanityFetch({query: PORTFOLIO_PAGE_QUERY, perspective, stega}),
    sanityFetch({query: PROJECT_DETAIL_QUERY, params: {slug}, perspective, stega}),
    sanityFetch({query: PROJECT_PAGER_QUERY, perspective, stega}),
  ])

  const project = projectResult.data as ProjectDetailData | null
  if (!project) notFound()

  const page = pageResult.data as PortfolioPageData | null
  const pager = (pagerResult.data as ProjectPagerEntry[] | null) ?? []

  // prev/next by manual `order` — the pager query mirrors the grid ordering
  const idx = pager.findIndex((p) => stegaClean(p.slug) === slug)
  const prev = idx > 0 ? (pager[idx - 1] ?? null) : null
  const next = idx >= 0 && idx < pager.length - 1 ? (pager[idx + 1] ?? null) : null

  return <ProjectDetail page={page} project={{...project, prev, next}} />
}
