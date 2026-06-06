import {defineQuery} from 'next-sanity'

/* ============================================================
   Home route queries + result types.
   CONTRACT: these are the HOME_PAGE_QUERY / QA_ENTRIES_QUERY the
   execution plan assigns to frontend/sanity/lib/queries.ts. They
   live here (home workstream file scope) until the data-layer
   workstream lands; integration is a move + import-path swap.
   The result types below are hand-written until `sanity typegen`
   runs against the new studio schema.

   Chrome strings that the PRD §4.1 homePage table doesn't (yet)
   model are projected with template-exact `coalesce` defaults so
   no copy is hardcoded in any component and the page stays
   pixel/copy-identical even before those fields are seeded.
   ============================================================ */

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    _id,
    _type,
    heroWord,
    promptCommand,
    toolActions,
    successLines,
    portraitCaption,
    featuredHeading,
    metricsHeading,
    metrics[]{_key, value, unit, label},
    nextStepsHeading,
    nextSteps[]{_key, cmd, flag, sub, primary, route},
    featuredProjects[]{
      _key,
      ...@->{
        _id,
        title,
        "slug": slug.current,
        commit,
        status,
        problem,
        "tags": tags[]->slug.current
      }
    },
    "systemCard": {
      "panelTitle": coalesce(systemCard.panelTitle, "~/system.card"),
      "panelMeta": coalesce(systemCard.panelMeta, "json"),
      "onlineLabel": coalesce(systemCard.onlineLabel, "online"),
      "roleLine": systemCard.roleLine,
      "kvRows": systemCard.kvRows[]{_key, key, value}
    },
    "chrome": {
      "heroPanelTitle": coalesce(heroPanelTitle, "~/portfolio"),
      "heroPanelMeta": coalesce(heroPanelMeta, "session · live"),
      "toolsLabel": coalesce(toolsLabel, "running tools"),
      "toolUsesLabel": coalesce(toolUsesLabel, "{n} tool uses"),
      "featuredPromptCmd": coalesce(featuredPromptCmd, "head -n 3 ./portfolio"),
      "featuredPromptFlag": coalesce(featuredPromptFlag, "--featured"),
      "metricsPromptCmd": coalesce(metricsPromptCmd, "ls --stat ./profile"),
      "nextStepsPromptCmd": coalesce(nextStepsPromptCmd, "cat ./next-steps.md"),
      "asciiCapCmd": coalesce(asciiCapCmd, "render"),
      "asciiCapFlag": coalesce(asciiCapFlag, "--hero"),
      "bootLines": coalesce(bootLines, [
        "mount /profile.md",
        "load runtime · node v22.3",
        "index ./portfolio · {projects} systems",
        "start field-notes feed · {posts} entries",
        "warm ai-native workflows",
        "establish secure session"
      ]),
      "bootBrandSuffix": coalesce(bootBrandSuffix, ".os"),
      "bootVersionLabel": coalesce(bootVersionLabel, "v2026.5 · session boot"),
      "bootingLabel": coalesce(bootingLabel, "booting session…"),
      "bootReadyLabel": coalesce(bootReadyLabel, "▸ ready — launching console")
    },
    "projectCount": count(*[_type == "project" && defined(slug.current)]),
    "postCount": count(*[_type == "post" && defined(slug.current)]),
    "settings": *[_id == "siteSettings"][0]{
      _id,
      _type,
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
      "portraitUrl": portrait.asset->url,
      "portraitAlt": coalesce(portrait.alt, name),
      "heroLayout": coalesce(theme.heroLayout, "boot"),
      askConsole{
        enabled,
        heading,
        description,
        placeholder,
        emptyMessage,
        suggestions,
        fallback
      }
    }
  }
`)

export const QA_ENTRIES_QUERY = defineQuery(`
  *[_type == "qaEntry" && enabled != false]{
    _id,
    title,
    keywords,
    answer,
    action{cmd, flag, route}
  }
`)

/* ---------- hand-written result types (until typegen covers the new schema) ---------- */

export interface HomeMetric {
  _key: string
  value: string | null
  unit: string | null
  label: string | null
}

export interface HomeCta {
  _key: string
  cmd: string | null
  flag: string | null
  sub: string | null
  primary: boolean | null
  /* schema models internal route as a (single-select) string list — seeded
     docs return `["portfolio"]`; external URLs arrive as a plain string */
  route: string | string[] | null
}

export interface HomeFeaturedProject {
  _key: string
  _id: string
  title: string | null
  slug: string | null
  commit: string | null
  status: string | null
  problem: string | null
  tags: string[] | null
}

export interface HomeKvRow {
  _key: string
  key: string | null
  value: string | null
}

export interface HomeSystemCard {
  panelTitle: string
  panelMeta: string
  onlineLabel: string
  roleLine: string | null
  kvRows: HomeKvRow[] | null
}

export interface HomeChrome {
  heroPanelTitle: string
  heroPanelMeta: string
  toolsLabel: string
  toolUsesLabel: string
  featuredPromptCmd: string
  featuredPromptFlag: string
  metricsPromptCmd: string
  nextStepsPromptCmd: string
  asciiCapCmd: string
  asciiCapFlag: string
  bootLines: string[]
  bootBrandSuffix: string
  bootVersionLabel: string
  bootingLabel: string
  bootReadyLabel: string
}

export interface HomeAskConsoleSettings {
  enabled: boolean | null
  heading: string | null
  description: string | null
  placeholder: string | null
  emptyMessage: string | null
  suggestions: string[] | null
  fallback: string[] | null
}

export interface HomeSettings {
  _id: string
  _type: string
  name: string | null
  handle: string | null
  headline: string | null
  shortBio: string | null
  email: string | null
  github: string | null
  linkedin: string | null
  location: string | null
  availability: string | null
  availabilityStatus: boolean | null
  portraitUrl: string | null
  portraitAlt: string | null
  heroLayout: string
  askConsole: HomeAskConsoleSettings | null
}

export interface HomePageQueryResult {
  _id: string
  _type: string
  heroWord: string | null
  promptCommand: string | null
  toolActions: string[] | null
  successLines: string[] | null
  portraitCaption: string | null
  featuredHeading: string | null
  metricsHeading: string | null
  metrics: HomeMetric[] | null
  nextStepsHeading: string | null
  nextSteps: HomeCta[] | null
  featuredProjects: HomeFeaturedProject[] | null
  systemCard: HomeSystemCard
  chrome: HomeChrome
  projectCount: number
  postCount: number
  settings: HomeSettings | null
}
