import type {Metadata} from 'next'

import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {ABOUT_PAGE_META_QUERY, SETTINGS_QUERY} from '@/sanity/lib/queries'
import type {SiteSettingsSeoData, PageSeoData} from '@/sanity/lib/seo-types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''
const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const [{data: rawSettings}, {data: rawPage}] = await Promise.all([
    sanityFetchMetadata({query: SETTINGS_QUERY, perspective}),
    sanityFetchMetadata({query: ABOUT_PAGE_META_QUERY, perspective}),
  ])
  const settings = rawSettings as SiteSettingsSeoData | null
  const page = rawPage as PageSeoData | null

  const title = page?.seo?.metaTitle || settings?.seo?.metaTitle || settings?.name || ''
  const description =
    page?.seo?.metaDescription || settings?.seo?.metaDescription || settings?.shortBio || ''
  const ogImage =
    resolveOpenGraphImage(page?.seo?.ogImage) || resolveOpenGraphImage(settings?.seo?.ogImage)

  return {
    title,
    description,
    alternates: {canonical: SITE_URL + '/about'},
    openGraph: {
      type: 'website',
      url: SITE_URL + '/about',
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

function PersonJsonLd({
  name,
  url,
  jobTitle,
  github,
  linkedin,
}: {
  name: string
  url: string
  jobTitle: string
  github?: string | null
  linkedin?: string | null
}) {
  const sameAs: string[] = []
  if (github) sameAs.push(github)
  if (linkedin) sameAs.push(linkedin)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    jobTitle,
    ...(sameAs.length > 0 ? {sameAs} : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
    />
  )
}

export default async function AboutPage() {
  const {perspective} = await getDynamicFetchOptions()
  const {data: rawSettings} = await sanityFetchMetadata({query: SETTINGS_QUERY, perspective})
  const settings = rawSettings as SiteSettingsSeoData | null

  return (
    <>
      {settings?.name && (
        <PersonJsonLd
          name={settings.name}
          url={SITE_URL + '/'}
          jobTitle={settings.headline || ''}
          github={settings.github}
          linkedin={settings.linkedin}
        />
      )}
      {/* Phase 4 will replace this with the full about page UI */}
      <main />
    </>
  )
}
