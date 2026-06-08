import {defineQuery} from 'next-sanity'

/* ============================================================
   About route query + result type.
   Scoped to the /about route (file-ownership): the shared
   `aboutPageQuery` in sanity/lib/queries.ts predates the final
   aboutPage schema (it projects year/title/description/lit etc.)
   and does not match the AboutContent prop contract, so the
   route owns the correct projection here — same pattern as
   app/components/portfolio/home/queries.ts.

   `route` on ctaCommand is modeled as path segments (array of
   strings) in the schema; AboutContent expects a single string,
   so it is joined with "/" in the projection.
   ============================================================ */

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_id == "aboutPage"][0]{
    _id,
    _type,
    eyebrow,
    heading,
    portraitCaption,
    bioParagraphs,
    "timeline": timeline[]{_key, years, role, company, body, current},
    experiencePrompt,
    valuesPrompt,
    "values": values[]{_key, key, value},
    stackPrompt,
    "stackRows": stackRows[]{_key, term, items},
    "ctas": ctas[]{
      _key,
      cmd,
      flag,
      sub,
      primary,
      "route": select(defined(route) => array::join(route, "/")),
      "fileUrl": file.asset->url,
      "fileName": file.asset->originalFilename
    },
    "settings": *[_id == "siteSettings"][0]{
      handle,
      askConsole{
        enabled,
        heading,
        description,
        placeholder,
        emptyMessage,
        suggestions,
        fallback
      }
    }
  }
`)

/* ---------- hand-written result types (until typegen covers the new schema) ---------- */

import type {
  AboutPageData,
  AskConsoleSettings,
} from '@/app/components/portfolio/about/types'

export interface AboutSettingsData {
  handle: string | null
  askConsole: AskConsoleSettings | null
}

export interface AboutPageQueryResult extends AboutPageData {
  _id: string
  _type: string
  settings: AboutSettingsData | null
}
