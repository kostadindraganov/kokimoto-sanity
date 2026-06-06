import {type LivePerspective, resolvePerspectiveFromCookies} from 'next-sanity/live'
import {cookies, draftMode} from 'next/headers'
import {Suspense} from 'react'

import type {QaEntry} from '@/app/components/portfolio/ask/AskConsole'
import HomePage from '@/app/components/portfolio/home/HomePage'
import {
  HOME_PAGE_QUERY,
  type HomePageQueryResult,
  QA_ENTRIES_QUERY,
} from '@/app/components/portfolio/home/queries'
import StreamFallback from '@/app/components/portfolio/home/StreamFallback'
import {sanityFetch} from '@/sanity/lib/live'

/* ============================================================
   / — Home. Three-layer pattern per the
   sanity-live-cache-components skill:
   Layer 1 (Page): draftMode branch only — no 'use cache'.
   Layer 2 (DynamicHome): resolves perspective/stega from cookies
   inside the Suspense boundary (draft mode only).
   Layer 3 (CachedHome): 'use cache' + sanityFetch with
   perspective/stega passed as plain props (never hardcoded
   together outside the Layer-1 published branch).
   ============================================================ */

export default async function Page() {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<StreamFallback />}>
        <DynamicHome />
      </Suspense>
    )
  }
  return <CachedHome perspective="published" stega={false} />
}

interface DynamicFetchOptions {
  perspective: LivePerspective
  stega: boolean
}

/* TODO(data-layer workstream): replace with
   `import {getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/lib/live'`
   once the shared helper lands in sanity/lib/live.ts. */
async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return {perspective: 'published', stega: false}
  }
  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', stega: true}
}

async function DynamicHome() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedHome perspective={perspective} stega={stega} />
}

async function CachedHome({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const [{data: home}, {data: qaEntries}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY, perspective, stega}),
    sanityFetch({query: QA_ENTRIES_QUERY, perspective, stega}),
  ])

  return (
    <HomePage
      home={home as HomePageQueryResult | null}
      qaEntries={(qaEntries ?? []) as QaEntry[]}
    />
  )
}
