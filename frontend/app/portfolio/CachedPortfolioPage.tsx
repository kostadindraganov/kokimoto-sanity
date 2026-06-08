import {sanityFetch} from '@/sanity/lib/live'
import type {DynamicFetchOptions} from '@/sanity/lib/live'

import {PortfolioStream} from '@/app/components/portfolio/portfolio/PortfolioStream'
import type {
  PortfolioPageData,
  ProjectListItem,
  TagDoc,
} from '@/app/components/portfolio/portfolio/types'

import {PORTFOLIO_PAGE_QUERY, PORTFOLIO_TAGS_QUERY, PROJECTS_QUERY} from './queries'

type PortfolioPageResult = (PortfolioPageData & {settingsHandle: string | null}) | null

export async function CachedPortfolioPage({perspective, stega}: DynamicFetchOptions) {
  'use cache'

  const [pageResult, projectsResult, tagsResult] = await Promise.all([
    sanityFetch({query: PORTFOLIO_PAGE_QUERY, perspective, stega}),
    sanityFetch({query: PROJECTS_QUERY, perspective, stega}),
    sanityFetch({query: PORTFOLIO_TAGS_QUERY, perspective, stega}),
  ])

  const page = pageResult.data as PortfolioPageResult
  const projects = (projectsResult.data as ProjectListItem[] | null) ?? []
  const tags = (tagsResult.data as TagDoc[] | null) ?? []

  return (
    <div className="page">
      <PortfolioStream page={page} projects={projects} tags={tags} />
    </div>
  )
}
