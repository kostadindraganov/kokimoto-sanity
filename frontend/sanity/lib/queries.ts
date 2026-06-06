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

// ============================================================
// Portfolio-specific queries (PRD §4.1 / §4.2)
// ============================================================

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    _id,
    siteTitle,
    tagline,
    bio,
    email,
    github,
    linkedin,
    twitter,
    "portrait": portrait{asset, alt, crop, hotspot},
    "seo": seo{title, description, ogImage},
    "theme": theme{accentColor, grain, heroLayout},
    "homePage": homePage{
      heroHeading,
      heroSub,
      heroBio,
      "metrics": metrics[]{_key, number, unit, label},
      "nextSteps": nextSteps[]{_key, cmd, flag, description},
      "featuredProjects": featuredProjects[]->{_id, title, "slug": slug.current, commit, status, tags},
      "systemCard": systemCard{
        "kvRows": kvRows[]{_key, key, value}
      }
    }
  }
`)

export const navigationQuery = defineQuery(`
  *[_type == "navigation"][0]{
    "items": items[]{_key, label, command, route}
  }
`)

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0]{
    _id,
    heroHeading,
    heroSub,
    heroBio,
    "metrics": metrics[]{_key, number, unit, label},
    "nextSteps": nextSteps[]{_key, cmd, flag, description},
    "featuredProjects": featuredProjects[]->{_id, title, "slug": slug.current, commit, status, tags},
    "systemCard": systemCard{
      "kvRows": kvRows[]{_key, key, value}
    }
  }
`)

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0]{
    _id,
    "bioParagraphs": bioParagraphs[],
    "timeline": timeline[]{_key, year, title, company, description, lit},
    "values": values[]{_key, title, description},
    "stackRows": stackRows[]{_key, category, tools[]},
    "ctas": ctas[]{_key, label, href, primary}
  }
`)

export const portfolioPageQuery = defineQuery(`
  *[_type == "portfolioPage"][0]{
    _id,
    eyebrow,
    heading,
    intro,
    filterLabel,
    "detailLabels": detailLabels{
      role,
      problem,
      solution,
      stack,
      impact
    }
  }
`)

export const blogPageQuery = defineQuery(`
  *[_type == "blogPage"][0]{
    _id,
    heading,
    intro,
    "articleLabels": articleLabels{
      recentHeading,
      featuredLabel,
      readMore,
      minRead
    }
  }
`)

export const contactPageQuery = defineQuery(`
  *[_type == "contactPage"][0]{
    _id,
    heading,
    intro,
    "formFields": formFields{
      namePlaceholder,
      emailPlaceholder,
      messagePlaceholder,
      submitLabel
    },
    "validationMessages": validationMessages{
      nameRequired,
      emailInvalid,
      messageRequired
    },
    "successLines": successLines[]
  }
`)

export const projectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    commit,
    status,
    tags,
    role,
    "problem": problem[],
    "solution": solution[],
    "stack": stack[],
    "impact": impact[],
    "coverImage": coverImage{asset, alt, crop, hotspot},
    "gallery": gallery[]{_key, "image": image{asset, alt, crop, hotspot}},
    repo,
    live,
    order,
    "seo": seo{title, description, ogImage}
  }
`)

export const allProjectsQuery = defineQuery(`
  *[_type == "project"] | order(order asc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    commit,
    status,
    tags,
    role,
    "problem": problem[],
    "coverImage": coverImage{asset, alt, crop, hotspot},
    repo,
    live,
    order
  }
`)

export const portfolioPostQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    "date": coalesce(date, _updatedAt),
    category,
    tags,
    readTime,
    featured,
    "coverImage": coverImage{asset, alt, crop, hotspot},
    body,
    "seo": seo{title, description, ogImage}
  }
`)

export const qaEntryQuery = defineQuery(`
  *[_type == "qaEntry" && enabled != false] | order(_createdAt asc){
    _id,
    title,
    "keywords": keywords[],
    "answer": answer[],
    "action": action{cmd, flag, route},
    enabled
  }
`)
