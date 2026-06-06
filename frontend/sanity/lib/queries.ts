import {defineQuery, groq} from 'next-sanity'

// ─── Singletons ──────────────────────────────────────────────────────────────

export const SETTINGS_QUERY = defineQuery(groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    name,
    handle,
    headline,
    shortBio,
    email,
    github,
    linkedin,
    location,
    availability,
    availabilityStatus,
    cv,
    portrait{asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt},
    theme{
      accentColor,
      grain,
      heroLayout
    },
    askConsole{
      enabled,
      heading,
      description,
      placeholder,
      emptyMessage,
      suggestions,
      fallback
    },
    statusbar{
      branchLabel,
      statusText
    },
    uiText{
      notFoundTitle,
      notFoundBody,
      commandPalettePlaceholder,
      mobileConsolePrompt,
      newSessionLabel,
      copyEmailLabel
    },
    seo{
      metaTitle,
      metaDescription,
      ogImage{asset->{_id,url},alt,metadataBase}
    }
  }
`)

export const NAVIGATION_QUERY = defineQuery(groq`
  *[_type == "navigation" && _id == "navigation"][0]{
    items[]{
      label,
      command,
      route
    }
  }
`)

export const HOME_PAGE_QUERY = defineQuery(groq`
  {
    "homePage": *[_type == "homePage" && _id == "homePage"][0]{
      heroWord,
      promptCommand,
      toolActions,
      successLines,
      portraitCaption,
      featuredHeading,
      featuredProjects[]->{
        title,
        "slug": slug.current,
        commit,
        status,
        tags[]->{_id,title,"slug": slug.current},
        coverImage{asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt},
        role,
        problem,
        solution,
        stack,
        impact,
        repo,
        live,
        order
      },
      metricsHeading,
      metrics[]{
        _key,
        value,
        unit,
        label
      },
      nextStepsHeading,
      nextSteps[]{
        _key,
        cmd,
        flag,
        sub,
        primary,
        route
      },
      systemCard{
        roleLine,
        kvRows[]{_key,key,value}
      },
      seo{metaTitle,metaDescription,ogImage{asset->{_id,url},alt,metadataBase}}
    },
    "siteSettings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
      askConsole{
        enabled,
        heading,
        description,
        placeholder,
        emptyMessage,
        suggestions,
        fallback
      },
      theme{accentColor,grain,heroLayout},
      portrait{asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt},
      name,
      handle,
      availabilityStatus
    }
  }
`)

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

export const PORTFOLIO_PAGE_QUERY = defineQuery(groq`
  *[_type == "portfolioPage" && _id == "portfolioPage"][0]{
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
    seo{metaTitle,metaDescription,ogImage{asset->{_id,url},alt,metadataBase}}
  }
`)

export const PORTFOLIO_PROJECTS_QUERY = defineQuery(groq`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    commit,
    status,
    tags[]->{_id,title,"slug": slug.current},
    role,
    problem,
    solution,
    stack,
    impact,
    coverImage{asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt},
    gallery[]{_key,asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt,caption},
    repo,
    live,
    order
  }
`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(groq`
  {
    "project": *[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      commit,
      status,
      tags[]->{_id,title,"slug": slug.current},
      role,
      problem,
      solution,
      stack,
      impact,
      coverImage{asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt},
      gallery[]{_key,asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt,caption},
      repo,
      live,
      order,
      seo{metaTitle,metaDescription,ogImage{asset->{_id,url},alt,metadataBase}}
    },
    "prev": *[_type == "project" && order < *[_type == "project" && slug.current == $slug][0].order] | order(order desc) [0]{
      title,
      "slug": slug.current,
      order
    },
    "next": *[_type == "project" && order > *[_type == "project" && slug.current == $slug][0].order] | order(order asc) [0]{
      title,
      "slug": slug.current,
      order
    }
  }
`)

export const BLOG_PAGE_QUERY = defineQuery(groq`
  *[_type == "blogPage" && _id == "blogPage"][0]{
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
    seo{metaTitle,metaDescription,ogImage{asset->{_id,url},alt,metadataBase}}
  }
`)

export const BLOG_POSTS_QUERY = defineQuery(groq`
  *[_type == "post"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    date,
    category->{_id,title,"slug": slug.current},
    tags[]->{_id,title,"slug": slug.current},
    readTime,
    featured,
    coverImage{asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt}
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(groq`
  {
    "post": *[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      summary,
      date,
      category->{_id,title,"slug": slug.current},
      tags[]->{_id,title,"slug": slug.current},
      readTime,
      featured,
      coverImage{asset->{_id,url,metadata{dimensions,lqip}},hotspot,crop,alt},
      body[]{
        ...,
        _type == "image" => {
          ...,
          asset->{_id,url,metadata{dimensions,lqip}},
          alt,
          caption
        }
      },
      seo{metaTitle,metaDescription,ogImage{asset->{_id,url},alt,metadataBase}}
    },
    "prev": *[_type == "post" && date < *[_type == "post" && slug.current == $slug][0].date] | order(date desc) [0]{
      title,
      "slug": slug.current,
      date
    },
    "next": *[_type == "post" && date > *[_type == "post" && slug.current == $slug][0].date] | order(date asc) [0]{
      title,
      "slug": slug.current,
      date
    },
    "recent": *[_type == "post" && slug.current != $slug] | order(date desc) [0...5]{
      title,
      "slug": slug.current,
      date,
      category->{_id,title,"slug": slug.current}
    }
  }
`)

export const CONTACT_PAGE_QUERY = defineQuery(groq`
  *[_type == "contactPage" && _id == "contactPage"][0]{
    eyebrow,
    heading,
    intro,
    formTitle,
    formBadge,
    nameField{label,placeholder},
    emailField{label,placeholder},
    messageField{label,placeholder},
    submitLabel,
    formNote,
    validationMessages{
      nameRequired,
      emailRequired,
      emailInvalid,
      messageRequired,
      messageTooShort
    },
    successPanelTitle,
    successLines,
    successGreeting,
    sendAnotherLabel,
    availabilityHeading,
    availabilityText,
    resumeLabel,
    seo{metaTitle,metaDescription,ogImage{asset->{_id,url},alt,metadataBase}}
  }
`)

export const ALL_TAGS_QUERY = defineQuery(groq`
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`)

export const ALL_CATEGORIES_QUERY = defineQuery(groq`
  *[_type == "category"] {
    _id,
    title,
    "slug": slug.current,
    "postCount": count(*[_type == "post" && references(^._id)])
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

export const PROJECTS_SLUG_QUERY = defineQuery(groq`
  *[_type == "project"].slug.current
`)

export const POSTS_SLUG_QUERY = defineQuery(groq`
  *[_type == "post"].slug.current
`)

// ─── Legacy queries (kept for existing pages during migration) ────────────────

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
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
