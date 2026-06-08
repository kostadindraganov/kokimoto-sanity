import type {Metadata} from 'next'

import {CachedBlogPage} from '@/app/components/portfolio/blog/CachedBlogPage'
import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {BLOG_PAGE_META_QUERY, SETTINGS_QUERY} from '@/sanity/lib/queries'
import type {SiteSettingsSeoData, PageSeoData} from '@/sanity/lib/seo-types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''
const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const [{data: rawSettings}, {data: rawPage}] = await Promise.all([
    sanityFetchMetadata({query: SETTINGS_QUERY, perspective}),
    sanityFetchMetadata({query: BLOG_PAGE_META_QUERY, perspective}),
  ])
  const settings = rawSettings as SiteSettingsSeoData | null
  const page = rawPage as PageSeoData | null

  const title = page?.seo?.metaTitle || settings?.seo?.metaTitle || settings?.name || ''
  const description =
    page?.seo?.metaDescription ||
    settings?.seo?.metaDescription ||
    page?.intro ||
    settings?.shortBio ||
    ''
  const ogImage =
    resolveOpenGraphImage(page?.seo?.ogImage) || resolveOpenGraphImage(settings?.seo?.ogImage)

  return {
    title,
    description,
    alternates: {canonical: SITE_URL + '/blog'},
    openGraph: {
      type: 'website',
      url: SITE_URL + '/blog',
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

function CollectionPageJsonLd({
  name,
  url,
  description,
}: {
  name: string
  url: string
  description?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
    ...(description ? {description} : {}),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
    />
  )
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function BlogPage(props: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}) {
  const searchParams = await props.searchParams
  const initialSearch = firstParam(searchParams.search)
  const initialCategory = firstParam(searchParams.category)

  const {perspective, stega} = await getDynamicFetchOptions()
  const {data: rawPage} = await sanityFetchMetadata({query: BLOG_PAGE_META_QUERY, perspective})
  const page = rawPage as PageSeoData | null

  return (
    <>
      <CollectionPageJsonLd
        key="collection-jsonld"
        name={page?.heading || 'Blog'}
        url={SITE_URL + '/blog'}
        description={page?.intro || undefined}
      />
      <CachedBlogPage
        key="blog-body"
        perspective={perspective}
        stega={stega}
        initialSearch={initialSearch}
        initialCategory={initialCategory}
      />
    </>
  )
}
