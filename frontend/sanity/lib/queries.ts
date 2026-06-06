import {defineQuery, groq} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

// ─── Portfolio queries ────────────────────────────────────────────────────────

export const ABOUT_PAGE_QUERY = defineQuery(groq`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    eyebrow,
    heading,
    portraitCaption,
    bioParagraphs,
    experiencePrompt,
    timeline[]{
      _key,
      years,
      role,
      company,
      body,
      current
    },
    valuesPrompt,
    values[]{
      _key,
      key,
      value
    },
    stackPrompt,
    stackRows[]{
      _key,
      term,
      items
    },
    ctas[]{
      _key,
      cmd,
      flag,
      sub,
      primary,
      route
    },
    seo{metaTitle,metaDescription,ogImage{asset->{_id,url},alt,metadataBase}}
  }
`)

export const SETTINGS_ABOUT_QUERY = defineQuery(groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    name,
    handle,
    availabilityStatus,
    askConsole{
      enabled,
      heading,
      description,
      placeholder,
      emptyMessage,
      suggestions,
      fallback
    },
    seo{metaTitle,metaDescription,ogImage{asset->{_id,url},alt,metadataBase}}
  }
`)

export const QA_ENTRIES_QUERY = defineQuery(groq`
  *[_type == "qaEntry" && enabled == true] {
    _id,
    title,
    keywords,
    answer,
    action{cmd,flag,route}
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
