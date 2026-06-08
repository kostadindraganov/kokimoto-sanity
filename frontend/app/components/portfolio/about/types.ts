/* Types for the about page — derived from the GROQ ABOUT_PAGE_QUERY shape.
   Until typegen runs with the new schema these live here. */

export interface TimelineEntry {
  _key: string
  years: string
  role: string
  company: string
  body: string
  current?: boolean
}

export interface ValueItem {
  _key: string
  key: string
  value: string
}

export interface StackRow {
  _key: string
  term: string
  items: string[]
}

export interface CtaCommand {
  _key: string
  cmd: string
  flag?: string
  sub?: string
  primary?: boolean
  route?: string
  /** Asset URL of an uploaded file (e.g. CV PDF) — when set, the button downloads it. */
  fileUrl?: string | null
  /** Original filename of the uploaded file, used as the download name. */
  fileName?: string | null
}

export interface AboutPageData {
  eyebrow: string | null
  heading: string | null
  portraitCaption: string | null
  bioParagraphs: string[] | null
  experiencePrompt: string | null
  timeline: TimelineEntry[] | null
  valuesPrompt: string | null
  values: ValueItem[] | null
  stackPrompt: string | null
  stackRows: StackRow[] | null
  ctas: CtaCommand[] | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    ogImage?: {
      asset?: {_id: string; url: string} | null
      alt?: string | null
      metadataBase?: string | null
    } | null
  } | null
}

export interface QaAction {
  cmd?: string
  flag?: string
  route?: string
}

export interface QaEntry {
  _id: string
  title: string
  keywords: string[]
  answer: string[]
  action?: QaAction
}

export interface AskConsoleSettings {
  enabled?: boolean
  heading?: string | null
  description?: string | null
  placeholder?: string | null
  emptyMessage?: string | null
  suggestions?: string[] | null
  fallback?: string[] | null
}
