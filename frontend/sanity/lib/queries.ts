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
`

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

// ─── Aliases expected by portfolio components ─────────────────────────────────
export const POST_BY_SLUG_QUERY = portfolioPostQuery
export const BLOG_PAGE_QUERY = blogPageQuery

export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc){
    _id,
    title,
    "slug": slug.current,
    summary,
    "date": coalesce(date, _updatedAt),
    category,
    tags,
    readTime,
    featured,
    "coverImage": coverImage{asset, alt, crop, hotspot}
  }
`)

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc){
    _id,
    title,
    "slug": slug.current
  }
`)

export const RECENT_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc)[0...5]{
    _id,
    title,
    "slug": slug.current,
    "date": coalesce(date, _updatedAt),
    summary,
    readTime
  }
`)
