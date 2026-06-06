/**
 * Manual type definitions for SEO-related Sanity queries.
 * These will be replaced by sanity typegen once the schema is deployed (Phase 1).
 */

// Minimal image reference shape accepted by resolveOpenGraphImage / AnyImageSource
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyImageSource = any

export type SeoObject = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: AnyImageSource | null
}

export type SiteSettingsSeoData = {
  name?: string | null
  headline?: string | null
  shortBio?: string | null
  github?: string | null
  linkedin?: string | null
  seo?: SeoObject | null
}

export type PageSeoData = {
  heading?: string | null
  intro?: string | null
  seo?: SeoObject | null
}

export type ProjectMetaData = {
  title?: string | null
  slug?: string | null
  _updatedAt?: string | null
  coverImage?: AnyImageSource | null
  seo?: SeoObject | null
}

export type PostMetaData = {
  title?: string | null
  summary?: string | null
  slug?: string | null
  date?: string | null
  _updatedAt?: string | null
  coverImage?: AnyImageSource | null
  seo?: SeoObject | null
}

export type SlugItem = {
  slug: string
  _updatedAt?: string | null
  date?: string | null
}

export type RssPostItem = {
  title?: string | null
  slug: string
  summary?: string | null
  date?: string | null
  categoryTitle?: string | null
}
