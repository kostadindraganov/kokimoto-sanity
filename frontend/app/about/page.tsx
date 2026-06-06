/* ============================================================
   /about — three-layer pattern (Page → Dynamic → Cached)
   Data: ABOUT_PAGE_QUERY + SETTINGS_ABOUT_QUERY + QA_ENTRIES_QUERY
   Live editing: dataAttr on all editable wrappers,
                 useOptimistic for timeline/values/stackRows/ctas
   ============================================================ */

import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {createDataAttribute, type CreateDataAttribute, type CreateDataAttributeProps} from 'next-sanity'
import {Suspense} from 'react'

import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {ABOUT_PAGE_QUERY, QA_ENTRIES_QUERY, SETTINGS_ABOUT_QUERY} from '@/sanity/lib/queries'
import {studioUrl} from '@/sanity/lib/api'
import {AboutContent} from '@/app/components/portfolio/about/AboutContent'
import type {AboutPageData, AskConsoleSettings, QaEntry} from '@/app/components/portfolio/about/types'
import AboutLoading from './loading'

// ---------- generateMetadata ----------

interface SeoData {
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    ogImage?: {asset?: {url?: string} | null} | null
  } | null
}

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetchMetadata({query: ABOUT_PAGE_QUERY, perspective}),
    sanityFetchMetadata({query: SETTINGS_ABOUT_QUERY, perspective}),
  ])
  const p = page as SeoData | null
  const s = settings as SeoData | null
  const title = p?.seo?.metaTitle ?? s?.seo?.metaTitle ?? 'About'
  const description = p?.seo?.metaDescription ?? s?.seo?.metaDescription ?? undefined
  const ogImage = p?.seo?.ogImage?.asset?.url ?? s?.seo?.ogImage?.asset?.url
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

// ---------- Layer 3: Cached component ----------

async function CachedAboutPage({perspective, stega}: DynamicFetchOptions) {
  'use cache'

  const [{data: page}, {data: settings}, {data: qaRaw}] = await Promise.all([
    sanityFetch({query: ABOUT_PAGE_QUERY, perspective, stega}),
    sanityFetch({query: SETTINGS_ABOUT_QUERY, perspective, stega}),
    sanityFetch({query: QA_ENTRIES_QUERY, perspective, stega}),
  ])

  const aboutPage = page as AboutPageData | null
  const settingsData = settings as {
    handle?: string | null
    askConsole?: AskConsoleSettings | null
  } | null

  const handle = settingsData?.handle ?? 'kostadin@portfolio'
  const askSettings: AskConsoleSettings = settingsData?.askConsole ?? {}
  const qaEntries: QaEntry[] = (qaRaw as QaEntry[] | null) ?? []

  // Build dataAttribute factory for visual editing
  const da = stega
    ? (createDataAttribute({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
        baseUrl: studioUrl,
        id: 'aboutPage',
        type: 'aboutPage',
      }) as CreateDataAttribute<CreateDataAttributeProps & {id: string; type: string}>)
    : null

  const emptyPage: AboutPageData = {
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

  return (
    <AboutContent
      page={aboutPage ?? emptyPage}
      qaEntries={qaEntries}
      askSettings={askSettings}
      handle={handle}
      dataAttr={da}
      stega={stega}
    />
  )
}

// ---------- Layer 2: Dynamic component ----------

async function DynamicAboutPage() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedAboutPage perspective={perspective} stega={stega} />
}

// ---------- Layer 1: Page ----------

export default async function AboutPage() {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense fallback={<AboutLoading />}>
        <DynamicAboutPage />
      </Suspense>
    )
  }

  return <CachedAboutPage perspective="published" stega={false} />
}
