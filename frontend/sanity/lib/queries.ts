import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

// ─── Blog / Portfolio queries ──────────────────────────────────────────────

export const BLOG_PAGE_QUERY = defineQuery(`
  *[_type == "blogPage"][0]{
    _id,
    eyebrow,
    heading,
    intro,
    featuredPanelTitle,
    featuredBadge,
    readButtonLabel,
    searchPlaceholder,
    noMatchesText,
    loadingText,
    endText,
    archiveLabel,
    archiveNote,
    articleLabels{
      tocHeading,
      searchHeading,
      categoriesHeading,
      tagsHeading,
      recentHeading,
      archivesHeading,
      readingTimeHeading,
      categoryHeading,
      moreNotesHeading,
      backLabel,
      figCaptionPrefix
    },
    seo
  }
`)

export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    summary,
    date,
    featured,
    readTime,
    "category": category->{_id, title, "slug": slug.current},
    "tags": tags[]->{_id, title, "slug": slug.current},
    coverImage
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    summary,
    date,
    featured,
    readTime,
    "category": category->{_id, title, "slug": slug.current},
    "tags": tags[]->{_id, title, "slug": slug.current},
    coverImage,
    body,
    seo
  }
`)

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "count": count(*[_type == "post" && references(^._id)])
  }
`)

export const POSTS_SLUG_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const RECENT_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc) [0...5] {
    _id,
    title,
    "slug": slug.current,
    date
  }
`)
