'use client'

/* ============================================================
   AboutClient.tsx — client bridge for /about.
   AboutContent expects a `CreateDataAttribute` function, which
   cannot cross the server→client serialization boundary, so the
   cached server wrapper passes the document id/type and this
   bridge constructs the data-attribute builder on the client
   (only when stega/draft mode is active).
   ============================================================ */

import {useMemo} from 'react'
import {createDataAttribute} from 'next-sanity'
import type {CreateDataAttribute, CreateDataAttributeProps} from 'next-sanity'

import AboutContent from '@/app/components/portfolio/about/AboutContent'
import type {
  AboutPageData,
  AskConsoleSettings,
  QaEntry,
} from '@/app/components/portfolio/about/types'
import {dataset, projectId, studioUrl} from '@/sanity/lib/api'

interface AboutClientProps {
  page: AboutPageData
  qaEntries: QaEntry[]
  askSettings: AskConsoleSettings
  handle: string
  documentId: string | null
  documentType: string | null
  stega: boolean
}

export default function AboutClient({
  page,
  qaEntries,
  askSettings,
  handle,
  documentId,
  documentType,
  stega,
}: AboutClientProps) {
  const dataAttrFn = useMemo<CreateDataAttribute<
    CreateDataAttributeProps & {id: string; type: string}
  > | null>(() => {
    if (!stega || !documentId || !documentType) return null
    return createDataAttribute<CreateDataAttributeProps & {id: string; type: string}>({
      projectId,
      dataset,
      baseUrl: studioUrl,
      id: documentId,
      type: documentType,
    })
  }, [stega, documentId, documentType])

  return (
    <AboutContent
      page={page}
      qaEntries={qaEntries}
      askSettings={askSettings}
      handle={handle}
      dataAttr={dataAttrFn}
      stega={stega}
    />
  )
}
