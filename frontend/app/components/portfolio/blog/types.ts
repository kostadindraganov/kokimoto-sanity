// Shared types for blog components
// These mirror what GROQ returns; real types will come from sanity.types.ts after typegen

export interface BlogCategory {
  _id: string
  title: string
  slug: string
  description?: string | null
  count?: number
}

export interface BlogTag {
  _id: string
  title: string
  slug: string
}

export interface BlogPost {
  _id: string
  _type: 'post'
  title: string
  slug: string
  summary: string
  date: string
  featured?: boolean | null
  readTime?: number | null
  category: BlogCategory | null
  tags: BlogTag[] | null
  coverImage?: {
    _type: 'image'
    asset: {_ref: string; _type: 'reference'}
    alt?: string
    crop?: unknown
    hotspot?: unknown
  } | null
}

export interface BlogPostDetail extends BlogPost {
  body?: unknown[] | null
  seo?: unknown | null
}

export interface ArticleLabels {
  tocHeading?: string | null
  searchHeading?: string | null
  categoriesHeading?: string | null
  tagsHeading?: string | null
  recentHeading?: string | null
  archivesHeading?: string | null
  readingTimeHeading?: string | null
  categoryHeading?: string | null
  moreNotesHeading?: string | null
  backLabel?: string | null
  figCaptionPrefix?: string | null
}

export interface BlogPageData {
  _id: string
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  featuredPanelTitle?: string | null
  featuredBadge?: string | null
  readButtonLabel?: string | null
  searchPlaceholder?: string | null
  noMatchesText?: string | null
  loadingText?: string | null
  endText?: string | null
  archiveLabel?: string | null
  archiveNote?: string | null
  articleLabels?: ArticleLabels | null
}
