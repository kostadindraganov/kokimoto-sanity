import {defineQuery} from 'next-sanity'

/* ============================================================
   Portfolio route queries.
   CONTRACT: these are the portfolio queries the execution plan
   assigns to frontend/sanity/lib/queries.ts. They live here
   (portfolio workstream file scope — same pattern as
   app/components/portfolio/home/queries.ts) because the existing
   `portfolioPageQuery` / `projectQuery` / `allProjectsQuery` in
   sanity/lib/queries.ts project a stale draft of the schema
   (detailLabels keys, `problem[]` on a text field, raw tag
   references, gallery `image` sub-key) and don't match the
   component contracts in app/components/portfolio/portfolio/types.ts.
   Integration is a move + import-path swap.
   ============================================================ */

/** Portfolio page singleton — board copy + all detail-view labels. */
export const PORTFOLIO_PAGE_QUERY = defineQuery(`
  *[_id == "portfolioPage"][0]{
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
      // seeded docs store keyed {_key, value} objects; the schema (and the
      // component contract) declare plain strings — normalize to string[]
      "deployLogLines": select(
        defined(deployLogLines[0].value) => deployLogLines[].value,
        deployLogLines
      ),
      briefHeading,
      descriptionLabel,
      stackLabel,
      roleLabel,
      interfaceHeading,
      cloneLabel,
      openLiveLabel,
      backLabel,
      prevLabel,
      nextLabel
    },
    "settingsHandle": *[_id == "siteSettings"][0].handle
  }
`)

/** All projects for the bento grid, in manual order (order asc, newest first). */
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc){
    _id,
    _type,
    title,
    "slug": slug.current,
    commit,
    status,
    "summary": pt::text(description),
    coverImage{asset, hotspot, crop, alt},
    "tags": tags[]{_key, ...@->{_id, title, "slug": slug.current}},
    order
  }
`)

/** Tag docs referenced by at least one project — drives the --flag filters. */
export const PORTFOLIO_TAGS_QUERY = defineQuery(`
  *[_type == "tag" && count(*[_type == "project" && references(^._id)]) > 0] | order(title asc){
    _id,
    title,
    "slug": slug.current
  }
`)

/** Single project detail by slug. */
export const PROJECT_DETAIL_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    commit,
    status,
    role,
    description,
    stack,
    coverImage{asset, hotspot, crop, alt},
    "gallery": gallery[]{_key, asset, hotspot, crop, alt, caption},
    repo,
    live,
    order,
    "tags": tags[]{_key, ...@->{_id, title, "slug": slug.current}}
  }
`)

/** Ordered title/slug list (same ordering as the grid) for prev/next paging. */
export const PROJECT_PAGER_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc){
    title,
    "slug": slug.current
  }
`)
