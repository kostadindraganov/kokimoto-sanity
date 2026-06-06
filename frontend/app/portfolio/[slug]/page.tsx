import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {getDynamicFetchOptions, sanityFetchMetadata, sanityFetchStaticParams} from '@/sanity/lib/live'
import {PROJECT_META_QUERY, PROJECTS_SLUG_QUERY, SETTINGS_QUERY} from '@/sanity/lib/queries'
import type {SiteSettingsSeoData, ProjectMetaData, SlugItem} from '@/sanity/lib/seo-types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''
const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({query: PROJECTS_SLUG_QUERY})
  return ((data as SlugItem[] | null) ?? []).map((item) => ({slug: item.slug}))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const {slug} = await props.params
  const {perspective} = await getDynamicFetchOptions()
  const [{data: rawSettings}, {data: rawProject}] = await Promise.all([
    sanityFetchMetadata({query: SETTINGS_QUERY, perspective}),
    sanityFetchMetadata({query: PROJECT_META_QUERY, params: {slug}, perspective}),
  ])
  const settings = rawSettings as SiteSettingsSeoData | null
  const project = rawProject as ProjectMetaData | null

  if (!project) return {}

  const title =
    project.seo?.metaTitle || project.title || settings?.seo?.metaTitle || settings?.name || ''
  const description =
    project.seo?.metaDescription || settings?.seo?.metaDescription || settings?.shortBio || ''
  const ogImage =
    resolveOpenGraphImage(project.seo?.ogImage) ||
    resolveOpenGraphImage(project.coverImage) ||
    resolveOpenGraphImage(settings?.seo?.ogImage)

  return {
    title,
    description,
    alternates: {canonical: `${SITE_URL}/portfolio/${slug}`},
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/portfolio/${slug}`,
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage.url] : [],
    },
    robots: IS_PRODUCTION ? 'index,follow' : 'noindex',
  }
}

export default async function ProjectPage(props: Props) {
  const {slug} = await props.params
  const {perspective} = await getDynamicFetchOptions()
  const {data: rawProject} = await sanityFetchMetadata({
    query: PROJECT_META_QUERY,
    params: {slug},
    perspective,
  })
  const project = rawProject as ProjectMetaData | null

  if (!project) return notFound()

  // Phase 4 will replace this with the full project detail UI
  return <main />
}
