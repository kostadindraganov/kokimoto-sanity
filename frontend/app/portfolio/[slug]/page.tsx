import type {Metadata} from 'next'
import {stegaClean} from 'next-sanity'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import {ProjectDetail} from '@/app/components/portfolio/portfolio/ProjectDetail'
import type {
  PortfolioPageData,
  ProjectDetailData,
} from '@/app/components/portfolio/portfolio/types'
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from '@/sanity/lib/live'
import {
  PORTFOLIO_PAGE_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECTS_SLUG_QUERY,
} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({query: PROJECTS_SLUG_QUERY})
  return ((data ?? []) as {slug: string}[]).map(({slug}) => ({slug}))
}

export async function generateMetadata(props: PageProps<'/portfolio/[slug]'>): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([props.params, getDynamicFetchOptions()])
  const {data} = await sanityFetchMetadata({
    query: PROJECT_BY_SLUG_QUERY,
    params: {slug},
    perspective,
  })
  const project = data as ProjectDetailData | null
  const ogImage = resolveOpenGraphImage(project?.seo?.ogImage ?? project?.coverImage)
  return {
    title: project?.seo?.metaTitle || stegaClean(project?.title) || undefined,
    description: project?.seo?.metaDescription || stegaClean(project?.problem) || undefined,
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

export default async function ProjectPage(props: PageProps<'/portfolio/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<div className="page" />}>
        <DynamicProject params={props.params} />
      </Suspense>
    )
  }
  const {slug} = await props.params
  return <CachedProject slug={slug} perspective="published" stega={false} />
}

async function DynamicProject({params}: Pick<PageProps<'/portfolio/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedProject slug={slug} perspective={perspective} stega={stega} />
}

async function CachedProject({
  slug,
  perspective,
  stega,
}: {slug: string} & DynamicFetchOptions) {
  'use cache'
  const [{data: projectData}, {data: pageData}] = await Promise.all([
    sanityFetch({query: PROJECT_BY_SLUG_QUERY, params: {slug}, perspective, stega}),
    sanityFetch({query: PORTFOLIO_PAGE_QUERY, perspective, stega}),
  ])
  const project = projectData as ProjectDetailData | null
  const page = pageData as PortfolioPageData | null

  if (!project?._id) {
    notFound()
  }

  return <ProjectDetail page={page} project={project} />
}
