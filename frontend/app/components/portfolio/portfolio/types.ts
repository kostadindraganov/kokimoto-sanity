/* ============================================================
   Portfolio data shapes (manual interfaces — the portfolio
   schema types are not yet part of the generated typegen map)
   ============================================================ */

export interface ProjectTag {
  _key: string
  _id: string
  title: string
  slug: string
}

export interface TagDoc {
  _id: string
  title: string
  slug: string
}

export interface SanityImageValue {
  asset?: {_ref: string; _type: 'reference'} | null
  hotspot?: {x: number; y: number; height: number; width: number} | null
  crop?: {top: number; bottom: number; left: number; right: number} | null
  alt?: string | null
  caption?: string | null
  _key?: string
}

export interface SeoFields {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: SanityImageValue | null
}

export interface PortfolioDetailLabels {
  deployLogTitle?: string | null
  deployLogLines?: string[] | null
  briefHeading?: string | null
  problemLabel?: string | null
  solutionLabel?: string | null
  stackLabel?: string | null
  roleLabel?: string | null
  impactHeading?: string | null
  interfaceHeading?: string | null
  cloneLabel?: string | null
  openLiveLabel?: string | null
  backLabel?: string | null
  prevLabel?: string | null
  nextLabel?: string | null
}

export interface PortfolioPageData {
  _id: string
  _type: string
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  filterLabel?: string | null
  matchesText?: string | null
  loadingText?: string | null
  endText?: string | null
  detailLabels?: PortfolioDetailLabels | null
  seo?: SeoFields | null
}

export interface ProjectListItem {
  _id: string
  _type: string
  title: string
  slug: string
  commit?: string | null
  status?: string | null
  problem?: string | null
  coverImage?: SanityImageValue | null
  tags?: ProjectTag[] | null
  order?: number | null
}

export interface ProjectPagerEntry {
  title: string
  slug: string
}

export interface ProjectDetailData extends ProjectListItem {
  role?: string | null
  solution?: string | null
  stack?: string[] | null
  impact?: string[] | null
  repo?: string | null
  live?: string | null
  gallery?: SanityImageValue[] | null
  seo?: SeoFields | null
  prev?: ProjectPagerEntry | null
  next?: ProjectPagerEntry | null
}
