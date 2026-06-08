import type {Metadata} from 'next'
import {stegaClean} from 'next-sanity'

import AboutClient from '@/app/about/AboutClient'
import {ABOUT_PAGE_QUERY, type AboutPageQueryResult} from '@/app/about/queries'
import type {
  AboutPageData,
  AskConsoleSettings,
  QaEntry,
} from '@/app/components/portfolio/about/types'
import {QA_ENTRIES_QUERY} from '@/app/components/portfolio/home/queries'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
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

const EMPTY_ABOUT_PAGE: AboutPageData = {
  eyebrow: null,
  heading: null,
  portraitCaption: null,
  bioParagraphs: null,
  experiencePrompt: null,
  timeline: null,
  valuesPrompt: null,
  values: null,
  stackPrompt: null,
  stackRows: null,
  ctas: null,
}

/* Cached server wrapper — mirrors CachedBlogPage's three-layer Cache
   Components pattern: dynamic options resolved in the page, data fetched
   inside 'use cache' with perspective/stega as cache keys. */
async function CachedAboutPage({perspective, stega}: DynamicFetchOptions) {
  'use cache'

  const [aboutResult, qaResult] = await Promise.all([
    sanityFetch({query: ABOUT_PAGE_QUERY, perspective, stega}),
    sanityFetch({query: QA_ENTRIES_QUERY, perspective, stega}),
  ])

  const about = aboutResult.data as AboutPageQueryResult | null
  const qaEntries = (qaResult.data as QaEntry[] | null) ?? []

  const handle = stegaClean(about?.settings?.handle ?? '')
  const askSettings: AskConsoleSettings = about?.settings?.askConsole ?? {}

  return (
    <AboutClient
      page={about ?? EMPTY_ABOUT_PAGE}
      qaEntries={qaEntries}
      askSettings={askSettings}
      handle={handle}
      documentId={about?._id ?? null}
      documentType={about?._type ?? null}
      stega={stega}
    />
  )
}

export default async function AboutPage() {
  const fetchOptions = await getDynamicFetchOptions()
  const {data: rawSettings} = await sanityFetchMetadata({
    query: SETTINGS_QUERY,
    perspective: fetchOptions.perspective,
  })
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
      <CachedAboutPage {...fetchOptions} />
    </>
  )
}
