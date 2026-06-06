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

/* ============================================================
   Portfolio (kokikillara) queries
   ============================================================ */

const projectListFields = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  commit,
  status,
  problem,
  coverImage,
  "tags": tags[]{_key, ...(@->{_id, title, "slug": slug.current})},
  order,
`

export const PORTFOLIO_PAGE_QUERY = defineQuery(`
  *[_type == "portfolioPage"][0]{
    _id,
    _type,
    eyebrow,
    heading,
    intro,
    filterLabel,
    matchesText,
    loadingText,
    endText,
    detailLabels{
      deployLogTitle,
      deployLogLines,
      briefHeading,
      problemLabel,
      solutionLabel,
      stackLabel,
      roleLabel,
      impactHeading,
      interfaceHeading,
      cloneLabel,
      openLiveLabel,
      backLabel,
      prevLabel,
      nextLabel
    },
    seo{metaTitle, metaDescription, ogImage}
  }
`)

export const PORTFOLIO_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc){
    ${projectListFields}
  }
`)

export const PORTFOLIO_TAGS_QUERY = defineQuery(`
  *[_type == "tag" && count(*[_type == "project" && references(^._id)]) > 0] | order(title asc){
    _id,
    title,
    "slug": slug.current
  }
`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    ${projectListFields}
    role,
    solution,
    stack,
    impact,
    repo,
    live,
    gallery[]{_key, asset, hotspot, crop, alt, caption},
    seo{metaTitle, metaDescription, ogImage},
    "prev": *[_type == "project" && defined(slug.current) && order < ^.order] | order(order desc)[0]{title, "slug": slug.current},
    "next": *[_type == "project" && defined(slug.current) && order > ^.order] | order(order asc)[0]{title, "slug": slug.current}
  }
`)

export const PROJECTS_SLUG_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  {"slug": slug.current}
`)
