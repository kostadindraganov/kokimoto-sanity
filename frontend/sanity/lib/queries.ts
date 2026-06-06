import {defineQuery, groq} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

// ─── Portfolio CMS queries ──────────────────────────────────────────────────

/** Site-wide settings singleton */
export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    name,
    headline,
    shortBio,
    github,
    linkedin,
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`)

/** Home page singleton */
export const HOME_PAGE_META_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`)

/** About page singleton */
export const ABOUT_PAGE_META_QUERY = defineQuery(`
  *[_id == "aboutPage"][0]{
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`)

/** Portfolio page singleton */
export const PORTFOLIO_PAGE_META_QUERY = defineQuery(`
  *[_id == "portfolioPage"][0]{
    heading,
    intro,
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`)

/** Blog page singleton */
export const BLOG_PAGE_META_QUERY = defineQuery(`
  *[_id == "blogPage"][0]{
    heading,
    intro,
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`)

/** Contact page singleton */
export const CONTACT_PAGE_META_QUERY = defineQuery(`
  *[_id == "contactPage"][0]{
    heading,
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`)

/** Project detail metadata */
export const PROJECT_META_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    _updatedAt,
    coverImage,
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`)

/** Post detail metadata */
export const POST_META_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    title,
    summary,
    "slug": slug.current,
    date,
    _updatedAt,
    coverImage,
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`)

/** All project slugs for sitemap/generateStaticParams */
export const PROJECTS_SLUG_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`)

/** All post slugs for sitemap/generateStaticParams */
export const POSTS_SLUG_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current,
    date,
    _updatedAt
  }
`)

/** Posts for RSS feed (last 20, date desc) */
export const RSS_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc) [0...20] {
    title,
    "slug": slug.current,
    summary,
    date,
    "categoryTitle": category->title
  }
`)

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
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    _id,
    "status": select(_originalId in path("drafts.**") => "draft", "published"),
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    excerpt,
    coverImage,
    "date": coalesce(date, _updatedAt),
    "author": author->{firstName, lastName, picture},
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    _id,
    "status": select(_originalId in path("drafts.**") => "draft", "published"),
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    excerpt,
    coverImage,
    "date": coalesce(date, _updatedAt),
    "author": author->{firstName, lastName, picture},
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          "page": page->slug.current,
          "post": post->slug.current
        }
      }
    },
    _id,
    "status": select(_originalId in path("drafts.**") => "draft", "published"),
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    excerpt,
    coverImage,
    "date": coalesce(date, _updatedAt),
    "author": author->{firstName, lastName, picture},
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
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
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

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0]{
    formTitle,
    formBadge,
    nameField,
    emailField,
    messageField,
    submitLabel,
    formNote,
    validationMessages,
    successPanelTitle,
    successLines,
    successGreeting,
    sendAnotherLabel,
    availabilityHeading,
    availabilityText,
    resumeLabel,
  }
`)

export const SITE_SETTINGS_CONTACT_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    email,
    github,
    linkedin,
    cv,
    availabilityStatus,
    availability,
    location,
  }
`)

export const QA_ENTRIES_QUERY = defineQuery(`
  *[_type == "qaEntry" && enabled != false] | order(_createdAt asc) {
    _id,
    title,
    "keywords": keywords,
    "answer": answer,
    action,
  }
`)

export const SITE_SETTINGS_ASK_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    handle,
    "askConsole": askConsole{
      enabled,
      heading,
      description,
      placeholder,
      emptyMessage,
      suggestions,
      fallback,
    },
  }
`)
