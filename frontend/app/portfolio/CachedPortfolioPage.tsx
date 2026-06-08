import {sanityFetch} from '@/sanity/lib/live'
import type {DynamicFetchOptions} from '@/sanity/lib/live'

import {PortfolioBoard} from '@/app/components/portfolio/portfolio/PortfolioBoard'
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
      {/* Page header — copy from the portfolioPage singleton */}
      <div>
        <div className="eyebrow">{page?.eyebrow}</div>
        <h1 className="h-display" style={{fontSize: 'clamp(28px,5vw,46px)', marginTop: 12}}>
          {page?.heading}
        </h1>
        <p className="hero-bio" style={{marginTop: 10}}>
          {page?.intro}
        </p>
      </div>

      {/* Prompt line — who from CMS handle, command derived from the route */}
      <div className="prompt" style={{marginTop: 28}}>
        <span className="who">{page?.settingsHandle}</span>
        <span className="pct">:</span>
        <span className="path">~</span>
        <span className="pct"> % </span>
        <span className="cmd">ls ./portfolio</span>
        <span className="cursor" aria-hidden="true" />
      </div>

      {/* Bento board (client — flag filters, scroll reveal, infinite scroll) */}
      <div style={{marginTop: 28}}>
        <PortfolioBoard page={page} projects={projects} tags={tags} />
      </div>
    </div>
  )
}
