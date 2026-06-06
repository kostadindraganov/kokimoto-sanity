export const meta = {
  name: 'kokimoto-migration',
  description: 'Migrate Kokikillara portfolio template to Sanity CMS + Next.js with 1:1 visual parity',
  phases: [
    { title: 'P0 Setup', detail: 'Install deps, create inbox dataset, copy assets, update env files' },
    { title: 'P1 Schema + Studio', detail: 'Schema types (opus) + Studio config (sonnet) in parallel' },
    { title: 'P2 Seed', detail: 'Transcribe template data, write repeatable seed script, run it' },
    { title: 'P3 Foundation', detail: 'Design system + shell (opus) and data layer (sonnet) in parallel' },
    { title: 'P4 Pages', detail: '5 page workstreams in parallel with worktree isolation' },
    { title: 'P5 Contact Backend', detail: 'Server action, write client (inbox dataset), Resend email' },
    { title: 'P6 SEO', detail: 'generateMetadata, JSON-LD, sitemap.ts, robots.ts, RSS feed' },
    { title: 'P7 Verify', detail: 'Adversarial verification: visual + editability + UX + QA (2 rounds max)' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// P0 — Setup
// Model: haiku (simple installs, no code design)
// ─────────────────────────────────────────────────────────────────────────────
phase('P0 Setup')

await agent(
  `You are the SETUP agent for the Kokikillara portfolio → Sanity CMS migration.

READ FIRST: docs/PRD.md §7 (Env vars) and docs/EXECUTION_PLAN.md Phase 0.

Execute ALL of the following in order. Do not skip steps.

STEP 1 — Verify Sanity v5 plugin compatibility (npm view <pkg> peerDependencies):
  - sanity-plugin-media
  - @sanity/color-input
  - @sanity/code-input
  - @sanity/dashboard  (NOT "sanity-plugin-dashboard")
  - sanity-plugin-vercel-deploy
  If sanity-plugin-vercel-deploy has no v5 peer, note it. Approved fallback: ~30-line custom widget POSTing to env VERCEL_DEPLOY_HOOK_URL.

STEP 2 — Install studio deps (cd into studio/ first):
  npm install sanity-plugin-media @sanity/color-input @sanity/code-input @sanity/dashboard sanity-plugin-vercel-deploy

STEP 3 — Install frontend deps (cd into frontend/ first):
  npm install resend zod

STEP 4 — Create private inbox dataset:
  cd studio && npx sanity dataset create inbox --visibility private
  Verify: npx sanity dataset list — inbox should show aclMode: private.

STEP 5 — Copy seed assets:
  mkdir -p studio/scripts/seed-assets
  cp -r docs/kokikillara-porfolio/project-images/. studio/scripts/seed-assets/
  List what was copied.

STEP 6 — Update env.example files per PRD §7:
  studio/.env.example — add: SANITY_API_WRITE_TOKEN (Editor token, write to inbox dataset)
  frontend/.env.example — add: SANITY_API_WRITE_TOKEN, RESEND_API_KEY, CONTACT_EMAIL_TO

REPORT: npm install exit codes, inbox dataset ACL, files copied count, vercel plugin compat verdict.`,
  { label: 'P0 Setup', phase: 'P0 Setup', model: 'haiku' }
)

log('P0 complete — deps installed, inbox dataset created')

// ─────────────────────────────────────────────────────────────────────────────
// P1 — Schema Types (opus) + Studio Config (sonnet) — parallel, distinct paths
// P1A writes: studio/src/schemaTypes/**
// P1B writes: studio/src/structure/index.ts + studio/sanity.config.ts
// ─────────────────────────────────────────────────────────────────────────────
phase('P1 Schema + Studio')

await parallel([

  () => agent(
    `You are the SCHEMA TYPES agent. Implement ALL Sanity schema types for the Kokikillara portfolio.
This is a complete rewrite of the studio schema layer — every field table in the PRD is law.

READ FIRST (read each completely — do not skim):
1. docs/PRD.md §4.1 (singletons — every field in every table), §4.2 (documents), §4.3 (demo type cleanup), §4.4 (objects)
2. docs/kokikillara-porfolio/DESIGN.md — understand visual/copy model so field choices make sense
3. .agents/skills/sanity-best-practices (full — especially schema conventions)
4. studio/src/schemaTypes/index.ts — current state
5. studio/src/schemaTypes/documents/ studio/src/schemaTypes/singletons/ — what exists

YOUR FILE SCOPE: write ONLY to studio/src/schemaTypes/**

─── OBJECTS (studio/src/schemaTypes/objects/) ───────────────────────────────
metric.ts        — value (string), unit (string), label (string)
timelineEntry.ts — years (string), role (string), company (string), body (text), current (boolean)
valueItem.ts     — key (string), value (string)
stackRow.ts      — term (string), items (array of string)
ctaCommand.ts    — cmd (string, req), flag (string), sub (string), primary (boolean),
                   route (array of string — internal page names OR external url)
qaAction.ts      — cmd (string), flag (string), route (array of string)
seo.ts           — metaTitle (string), metaDescription (text), ogImage (image with alt required)
blockContent.ts  — portable text with: normal/h2/h3/blockquote blocks; strong/em/code/link marks;
                   code block (via @sanity/code-input, with language selector);
                   image (alt required, caption string); link annotation (href string, newTab boolean, internal route)

─── DOCUMENTS (studio/src/schemaTypes/documents/) ───────────────────────────
project.ts — all PRD §4.2 project fields exactly:
  title (string, req), slug (from title, req, unique), commit (string, req),
  status (string list: live/shipped/active/archived, req, default: shipped),
  tags (array ref→tag, 1–3 required), role (string), problem (text, req), solution (text, req),
  stack (array of string), impact (array of string, max 3), coverImage (image hotspot, alt req),
  gallery (array of image with alt + caption), repo (url), live (url), order (number), seo (seo object)
  options.aiAssist: { imageInstructionField: 'coverImage' } on the coverImage field definition

post.ts — all PRD §4.2 post fields exactly:
  title (string, req), slug (req, unique), summary (text, req), date (date, req, default today),
  category (ref→category, req), tags (array ref→tag), readTime (number, optional),
  featured (boolean — add custom validation warning if another post is already featured),
  coverImage (image hotspot, alt req) with options.aiAssist.imageInstructionField: 'coverImage',
  body (blockContent portable text), seo (seo object)

category.ts — title (string, req), slug (slug from title, req, unique), description (text)
tag.ts      — title (string, req), slug (slug from title, req, unique)

qaEntry.ts  — title (string, req — internal label like "experience"),
              keywords (array of string, req, min 1),
              answer (array of text — each item = one streamed response line),
              action (qaAction object, optional),
              enabled (boolean, default true)

contactSubmission.ts — name (string, req), email (string, req), message (text, req),
                       submittedAt (datetime), read (boolean, default false)
                       Add __experimental_actions: ['update'] to disable create/delete/publish from Studio UI.

─── SINGLETONS (studio/src/schemaTypes/singletons/) — read PRD §4.1 tables exactly ─────
siteSettings.ts   — ALL 7 field groups per PRD §4.1:
  identity: name, handle, headline, shortBio (text), email (string + email regex validation),
            github (url), linkedin (url), location, availability, availabilityStatus (bool, default true),
            cv (file), portrait (image hotspot, alt required)
  theme: { accentColor (use @sanity/color-input), grain (bool, default true), heroLayout (string radio: boot|split, default boot) }
  askConsole: { enabled (bool, default true), heading, description (text), placeholder, emptyMessage,
               suggestions (array of string, max 6), fallback (array of string) }
  statusbar: { branchLabel (string, default "main"), statusText (string, default "ready") }
  uiText: object with all PRD §4.1 uiText fields: notFoundTitle, notFoundBody, commandPalettePlaceholder,
          mobileConsolePrompt, newSessionLabel, copyEmailLabel
  seo: seo object (metaTitle, metaDescription, ogImage)
  links group: github, linkedin already in identity — add as separate link fields or group as needed

navigation.ts — items (array of object: label string req, command string req, route array of string)

homePage.ts — all PRD §4.1 homePage fields:
  heroWord (string, req, default "KOKIMOTO"), promptCommand (string, default "whoami"),
  toolActions (array of string — 4 tool-use lines), successLines (array of string — 4 lines),
  portraitCaption (string), featuredHeading (string), featuredProjects (array ref→project, max 3),
  metricsHeading (string), metrics (array of metric object, 4 items), nextStepsHeading (string),
  nextSteps (array of ctaCommand object), systemCard (object: roleLine string, kvRows array of {key, value}),
  seo (seo object)

aboutPage.ts — all PRD §4.1 aboutPage fields:
  eyebrow, heading, portraitCaption, bioParagraphs (array of text — 3 streaming paragraphs),
  experiencePrompt (string), timeline (array of timelineEntry),
  valuesPrompt, values (array of valueItem), stackPrompt, stackRows (array of stackRow),
  ctas (array of ctaCommand), seo

portfolioPage.ts — eyebrow, heading, intro (text), filterLabel, matchesText, loadingText, endText,
  detailLabels (object with ALL PRD §4.1 portfolioPage.detailLabels fields:
    deployLogTitle, deployLogLines (array of string with {slug}/{repo}/{status} tokens),
    briefHeading, problemLabel, solutionLabel, stackLabel, roleLabel, impactHeading,
    interfaceHeading, cloneLabel, openLiveLabel, backLabel, prevLabel, nextLabel), seo

blogPage.ts — eyebrow, heading, intro (text), featuredPanelTitle, featuredBadge, readButtonLabel,
  searchPlaceholder, noMatchesText, loadingText, endText, archiveLabel, archiveNote,
  articleLabels (object with ALL PRD §4.1 blogPage.articleLabels fields:
    tocHeading, searchHeading, categoriesHeading, tagsHeading, recentHeading, archivesHeading,
    readingTimeHeading, categoryHeading, moreNotesHeading, backLabel, figCaptionPrefix), seo

contactPage.ts — eyebrow, heading, intro (text), formTitle, formBadge,
  nameField (object: label, placeholder), emailField (object: label, placeholder), messageField (object: label, placeholder),
  submitLabel, formNote, validationMessages (object: nameRequired, emailRequired, emailInvalid, messageRequired, messageTooShort),
  successPanelTitle, successLines (array of string, 3), successGreeting (string with {firstName} token),
  sendAnotherLabel, availabilityHeading, availabilityText, resumeLabel, seo

─── CLEANUP ─────────────────────────────────────────────────────────────────
Delete these demo type files: page.ts, person.ts, callToAction.ts, infoSection.ts, button.ts,
  blockContentTextOnly.ts, settings.ts (old demo types from original scaffold)
Update studio/src/schemaTypes/index.ts — register ALL new types, remove deleted types.

─── VALIDATION ─────────────────────────────────────────────────────────────
- Required fields: .required()
- Unique slugs: custom async validation using client.fetch to check existing docs
- Email regex: /^[^@]+@[^@]+\.[^@]+$/ on siteSettings.email
- tags 1-3 on project: Rule.min(1).max(3)
- Featured post warning: custom async validation that fetches all posts where featured=true

Run: cd studio && npm run type-check
GATE: type-check clean, zero schema warnings, all types registered in index.ts.`,
    { label: 'P1A Schema Types', phase: 'P1 Schema + Studio', model: 'opus' }
  ),

  () => agent(
    `You are the STUDIO CONFIG agent. Implement the Studio structure and sanity.config.ts.
The schema types are being built in parallel — reference PRD §4.1–4.4 for type names (do not read schema files that may be in flux).

READ FIRST:
1. docs/PRD.md §4.5 (Studio structure — exact spec) and §4.6 (Studio config additions)
2. docs/EXECUTION_PLAN.md Phase 1B
3. .agents/skills/sanity-best-practices (structure + singleton patterns)
4. studio/sanity.config.ts — current file (read before overwriting)
5. studio/src/structure/ — current structure files if any

YOUR FILE SCOPE: write ONLY to studio/src/structure/index.ts and studio/sanity.config.ts

─── STRUCTURE (studio/src/structure/index.ts) ───────────────────────────────
Implement the exact structure tree from PRD §4.5:

Workspace "default" (dataset: production):
  ⚙ Site Settings   — singleton, _id: 'siteSettings', no create/delete actions
  🧭 Navigation     — singleton, _id: 'navigation', no create/delete
  📄 Pages → divider → list items:
       Home (singleton, _id: 'homePage')
       About (singleton, _id: 'aboutPage')
       Portfolio (singleton, _id: 'portfolioPage')
       Blog (singleton, _id: 'blogPage')
       Contact (singleton, _id: 'contactPage')
  🗂 Portfolio → Projects (orderedBy: [{field:'order',direction:'asc'},{field:'_createdAt',direction:'desc'}]) + Tags
  ✍ Blog → Posts + Categories + Tags
  🤖 Ask Console → Q&A Entries

Workspace "inbox" (dataset: inbox, private):
  📥 Contact Submissions — read-only list; title shows "● unread" badge when read=false

Singleton pattern: use S.document().documentId('siteSettings').schemaType('siteSettings').views([S.view.form()])
Filter singletons from "new document" menu using documentIdEquals (or __experimental_actions).
Disable S.documentStore.defaultActions() for singletons — remove CreateAction and DeleteAction.

─── SANITY CONFIG (studio/sanity.config.ts) ─────────────────────────────────
Export ARRAY of two workspace configs (not a single config object):

Workspace 1 — default (dataset: production):
  name: 'default', title: 'Kokimoto Studio', projectId: process.env.SANITY_STUDIO_PROJECT_ID, dataset: 'production'
  schema: { types: schemaTypes } (all types except contactSubmission excluded from inbox)
  plugins: [
    structureTool({ structure }),
    media(),
    colorInput(),
    codeInput(),
    dashboardTool({ widgets: [
      vercelDeployWidget(),          // from sanity-plugin-vercel-deploy; if v5 incompatible use fallback below
      projectInfoWidget(),           // from @sanity/dashboard
      documentListWidget({ types: ['post'], limit: 5, title: 'Recent Posts' }),  // from @sanity/dashboard
    ]}),
    presentationTool({ ... }),
    assist(),
    unsplashImageAsset(),
    visionTool(),
  ]

  If sanity-plugin-vercel-deploy is not v5 compatible, replace vercelDeployWidget() with a custom inline widget:
    const deployWidget = definePlugin(() => ({
      name: 'deploy-widget',
      studio: { components: { toolMenu: (props) => /* button that POSTs to process.env.VERCEL_DEPLOY_HOOK_URL */ } }
    }))

  presentationTool config:
    previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } }
    mainDocuments: [
      { route: '/',                   filter: '_type == "homePage"' },
      { route: '/portfolio',          filter: '_type == "portfolioPage"' },
      { route: '/portfolio/:slug',    filter: '_type == "project" && slug.current == $slug' },
      { route: '/blog',               filter: '_type == "blogPage"' },
      { route: '/blog/:slug',         filter: '_type == "post" && slug.current == $slug' },
      { route: '/about',              filter: '_type == "aboutPage"' },
      { route: '/contact',            filter: '_type == "contactPage"' },
    ]
    locations: {
      project:      defineLocations({ select: {title:'title',slug:'slug.current'}, resolve: (doc) => [{title:doc?.title||'Project', href:'/portfolio/'+doc?.slug}] }),
      post:         defineLocations({ select: {title:'title',slug:'slug.current'}, resolve: (doc) => [{title:doc?.title||'Post', href:'/blog/'+doc?.slug}] }),
      tag:          defineLocations({ resolve: () => [{title:'Portfolio',href:'/portfolio'},{title:'Blog',href:'/blog'}] }),
      category:     defineLocations({ resolve: () => [{title:'Blog',href:'/blog'}] }),
      siteSettings: defineLocations({ resolve: () => [{title:'Home',href:'/'},{title:'Portfolio',href:'/portfolio'},{title:'Blog',href:'/blog'},{title:'About',href:'/about'},{title:'Contact',href:'/contact'}] }),
    }

Workspace 2 — inbox (dataset: inbox, private):
  name: 'inbox', title: 'Inbox', basePath: '/inbox'
  projectId: same project
  dataset: 'inbox'
  schema: { types: [contactSubmission] }  // only this type
  plugins: [structureTool({ structure: inboxStructure })]
  // No create actions, no media, no presentation

Document actions: for singletons + contactSubmission, filter out NewDocumentAction and DeleteAction.

Run: cd studio && npm run type-check
GATE: type-check clean, two workspaces exported as array, structure file correct.`,
    { label: 'P1B Studio Config', phase: 'P1 Schema + Studio', model: 'sonnet' }
  ),

])

log('P1 complete — schema types + studio config done')

// ─────────────────────────────────────────────────────────────────────────────
// P2 — Seed Script
// Model: sonnet (data transcription + script writing — complex but no design decisions)
// ─────────────────────────────────────────────────────────────────────────────
phase('P2 Seed')

await agent(
  `You are the SEED agent. Write and run the complete dataset seed script for the Kokikillara portfolio.

READ FIRST (read each file completely — these are your ONLY data sources):
1.  docs/PRD.md §6 (Seed script spec — follow exactly)
2.  docs/EXECUTION_PLAN.md Phase 2
3.  docs/kokikillara-porfolio/js/data.jsx         — SITE, NAV, METRICS, PROJECTS, FLAGS, POSTS, CATEGORIES, VALUES, TIMELINE
4.  docs/kokikillara-porfolio/data/qa.json        — ALL 31 Q&A entries
5.  docs/kokikillara-porfolio/js/article.jsx      — article body structure (lede→intro→problem+callout→solution+code+list→keep→figures)
6.  docs/kokikillara-porfolio/js/home.jsx         — ALL home page label strings
7.  docs/kokikillara-porfolio/js/shell.jsx        — uiText strings (topbar, statusbar, command palette labels)
8.  docs/kokikillara-porfolio/js/contact.jsx      — ALL contact page label strings + validationMessages
9.  docs/kokikillara-porfolio/js/blog.jsx         — ALL blog page label + articleLabels strings
10. docs/kokikillara-porfolio/js/portfolio.jsx    — ALL portfolio page label strings
11. docs/kokikillara-porfolio/js/project.jsx      — ALL detailLabels strings
12. docs/kokikillara-porfolio/js/about.jsx        — ALL about page label strings
13. .agents/skills/sanity-best-practices          — seed/upsert patterns
14. studio/src/schemaTypes/                       — understand schema types you are seeding into

IMPLEMENT:

─── studio/scripts/seed-data.ts ─────────────────────────────────────────────
Typed data transcription of ALL template content. Export typed constants for:
- siteSettingsData: transcribe ALL fields from data.jsx SITE + shell.jsx uiText + askConsole defaults
- navigationData: from NAV array in data.jsx
- homePageData: from home.jsx — heroWord, promptCommand, toolActions[], successLines[], portraitCaption, featuredHeading, metricsHeading, metrics[] (from METRICS), nextStepsHeading, nextSteps[], systemCard
- aboutPageData: from about.jsx — bioParagraphs[], timeline[] (from TIMELINE), values[] (from VALUES), stackRows[], experiencePrompt, valuesPrompt, stackPrompt, ctas[]
- portfolioPageData: from portfolio.jsx — eyebrow, heading, intro, filterLabel, matchesText, loadingText, endText + from project.jsx — ALL detailLabels fields
- blogPageData: from blog.jsx — all fields + from article.jsx — ALL articleLabels fields
- contactPageData: from contact.jsx — ALL label objects, nameField/emailField/messageField, validationMessages, successLines[], successGreeting, all other fields
- projectsData: from PROJECTS array — 6 project documents with all fields (use real data, not placeholders)
- postsData: from POSTS array — 8 post documents with real slugs (e.g. "the-eval-harness-is-the-product"); body: PortableText array reproducing article structure from article.jsx
- tagsData: from FLAGS + any extras needed by posts (6+ tags)
- categoriesData: from CATEGORIES (8 categories)
- qaEntriesData: from qa.json — map each to qaEntry schema (title=id field, keywords[], answer=lines array, action if present)

─── studio/scripts/seed.ts ──────────────────────────────────────────────────
Executable with: npx sanity exec scripts/seed.ts --with-user-token

1. Parse CLI args: --force (overwrite all), --clean (delete demo docs)
2. If --clean: list demo docs (type in: ['page','person'] or old settings) → prompt confirmation → delete

3. Asset upload:
   - Read files from studio/scripts/seed-assets/ (portrait.jpg + SVGs)
   - For each: check if asset with same filename already exists via GROQ query
   - Upload only if not found: client.assets.upload('image', fileStream, {filename})
   - Store returned {_id, _type} refs in a map by filename

4. Upsert strategy per PRD §6 (CRITICAL — follow exactly):
   Singletons (7 docs) — explicit stable _id + client.createOrReplace():
     _id: 'siteSettings', 'navigation', 'homePage', 'aboutPage', 'portfolioPage', 'blogPage', 'contactPage'
   All other docs — lookup by slug/title + createIfNotExists() + patch():
     NEVER hardcode _ref strings — always resolve _ref from the looked-up _id

5. Seed order (dependencies first):
   a. tags (no deps)
   b. categories (no deps)
   c. projects (refs tags → resolved from step a)
   d. posts (refs category → step b, refs tags → step a)
   e. qaEntries (no refs)
   f. siteSettings singleton (refs portrait asset → from upload map)
   g. navigation singleton
   h. homePage singleton (refs featuredProjects → resolved from step c)
   i. aboutPage, portfolioPage, blogPage, contactPage singletons

6. Final GROQ count report:
   Query counts per type and log results.
   Expected: 1 siteSettings, 1 navigation, 5 page singletons, 6 projects, 8 posts, ≥6 tags, 8 categories, 31 qaEntries

7. Add to ROOT package.json: "seed": "cd studio && npx sanity exec scripts/seed.ts --with-user-token"

Run the seed: npm run seed

GATE:
- GROQ counts match expected numbers
- All images present in dataset (verify via assets query)
- Re-running npm run seed is idempotent (run twice, counts stay same)
- All label fields populated (spot-check siteSettings.uiText, contactPage.validationMessages, blogPage.articleLabels)`,
  { label: 'P2 Seed', phase: 'P2 Seed', model: 'sonnet' }
)

log('P2 complete — seed script written and executed')

// ─────────────────────────────────────────────────────────────────────────────
// P3 — Design System + Shell (opus) + Data Layer (sonnet) — parallel
// P3A writes: frontend/app/portfolio.css + frontend/app/components/portfolio/shell/* + fx/*
// P3B writes: frontend/next.config.ts + frontend/sanity/lib/* + frontend/app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
phase('P3 Foundation')

await parallel([

  () => agent(
    `You are the DESIGN SYSTEM + SHELL agent. Port the template's visual system and shell components to Next.js TSX.
1:1 visual parity is the non-negotiable requirement — every pixel must match.

READ FIRST (read every line — these are your implementation source):
1. docs/kokikillara-porfolio/styles.css          — port VERBATIM
2. docs/kokikillara-porfolio/DESIGN.md           — §2 colors, §3 typography, §4 spacing/motion, §5 layout, §6 components, §7 interactions
3. docs/kokikillara-porfolio/js/shell.jsx        — TopBar, StatusBar, CommandPalette, MobileConsole
4. docs/kokikillara-porfolio/js/bootloader.jsx  — BootLoader
5. docs/kokikillara-porfolio/js/streaming.jsx   — Stream, Typewriter, Spinner, Cursor
6. docs/kokikillara-porfolio/js/ascii-reveal.jsx — AsciiReveal
7. docs/kokikillara-porfolio/js/hero-ascii.jsx  — HeroAscii
8. docs/kokikillara-porfolio/js/ui.jsx          — shared primitives
9. docs/PRD.md §5.1, §5.2 (visual parity rules + component layout)
10. .agents/skills/next-best-practices

YOUR FILE SCOPE: write ONLY to the paths below. Do NOT touch layout.tsx or sanity/lib/*.

─── frontend/app/portfolio.css ──────────────────────────────────────────────
Port styles.css VERBATIM. Every CSS custom property, every selector, every rule.
No modifications, no Tailwind substitutions for template classes.
Preserve: :root variables, .shell, .topbar, .statusbar, .panel, .prompt, .think, .tool,
  .out, .btn, .metric, .proj, .bento-grid, .trace, .statline, .kv, .ascii-reveal, .ascii-hero,
  .fx-grain, .fx-vignette, all animations, all breakpoints.

─── frontend/app/components/portfolio/shell/ (all 'use client') ─────────────
TopBar.tsx:
  Props: handle (string), navItems (array), availabilityStatus (boolean)
  Renders: brand mark (handle), nav items as /label format with active blinking block cursor,
  "run Ctrl K" button that opens CommandPalette, breathing green "available" dot when availabilityStatus=true
  Active route detection via usePathname()

StatusBar.tsx:
  Props: branchLabel (string), statusText (string), location (string)
  Token meter: maps window.scrollY / document.body.scrollHeight to range 23000–140000
  Formats as "23k" → "140k" with animated ultracolor gradient text (CSS class from portfolio.css)
  Current route: derived from usePathname()

CommandPalette.tsx:
  Opens on Ctrl/Cmd+K — keyboard trap while open
  Groups: navigate (navItems), links (github/linkedin from props), actions (new session)
  Arrow key + Enter navigation; Escape to close
  Uses useEffect for keyboard listener, useRef for focus trap

MobileConsole.tsx:
  Full-screen nav drawer, slides down from top
  Nav items animate: accent edge-bar + arrow on press
  Close on route change or outside tap
  Props: navItems, isOpen, onClose

─── frontend/app/components/portfolio/fx/ ──────────────────────────────────
All preserve: prefers-reduced-motion check + .anim-settled safety (reveal stuck opacity on tab-background)

BootLoader.tsx ('use client'):
  Port bootloader.jsx JSX → TSX exactly
  Session tracking: sessionStorage key per pageId, nonce bump for replay
  clearAllBoots() exported for "New session" action
  Skipped entirely when prefers-reduced-motion

Stream.tsx / Typewriter.tsx / Spinner.tsx / Cursor.tsx ('use client'):
  Port from streaming.jsx + ui.jsx, preserving all timing and animation logic
  Export each as named component

AsciiReveal.tsx ('use client'):
  Port ascii-reveal.jsx → TSX
  img element: crossOrigin="anonymous" (cdn.sanity.io sends CORS headers)
  Tainted canvas fallback: wrap canvas operations in try/catch; on SecurityError show the image directly
  CRITICAL: stegaClean() every string value fed to canvas/text-measuring code

HeroAscii.tsx ('use client'):
  Port hero-ascii.jsx → TSX
  canvas: crossOrigin="anonymous" on any image sampling
  Tainted canvas fallback (same pattern as AsciiReveal)
  CRITICAL: stegaClean() on the heroWord prop before feeding to canvas

ThemeInit.tsx (server component, no 'use client'):
  Read siteSettings.theme at render time (receives as props from layout)
  Output: <style> tag with --accent CSS var = theme.accentColor.hex
  Add class "no-grain" to <html> if theme.grain === false
  Output data-hero-layout attribute value from theme.heroLayout

─── CLEANUP ────────────────────────────────────────────────────────────────
Delete these demo components from frontend/app/components/:
  Header.tsx, Footer.tsx, Onboarding.tsx (or OnboardingWidget.tsx), Posts.tsx, Cta.tsx, InfoSection.tsx, PageBuilder.tsx
Keep: SanityImage.tsx (adapt — keep existing), DraftModeToast.tsx

Use next/font/google for JetBrains Mono (weights: 200,300,400,500,600,700) + Space Grotesk (400,500,600,700).
Wire into CSS vars: --mono and --display in :root. Apply className to <html> in layout (P3B handles this — export the font objects).

Run: cd frontend && npm run type-check && npm run lint
GATE: type-check + lint clean; portfolio.css is byte-for-byte match of styles.css structure; all components created.`,
    { label: 'P3A Design System + Shell', phase: 'P3 Foundation', model: 'opus' }
  ),

  () => agent(
    `You are the DATA LAYER agent. Set up the Next.js + Sanity data-fetching layer per the sanity-live-cache-components skill.
This skill is LAW — follow it exactly, including the anti-pattern list.

READ FIRST (read completely):
1. .agents/skills/sanity-live-cache-components     — follow EXACTLY; includes live-helpers.md reference
2. docs/PRD.md §5.3 (data layer), §5.4 (live editing stega rules)
3. .agents/skills/sanity-best-practices            — GROQ + query conventions
4. frontend/sanity/lib/client.ts                  — read before touching (preserve existing config)
5. frontend/sanity/lib/live.ts                    — read before touching (extend, don't overwrite)
6. frontend/next.config.ts                        — read current state
7. frontend/app/layout.tsx                        — read current state

YOUR FILE SCOPE: write ONLY to the paths below.

─── frontend/next.config.ts ─────────────────────────────────────────────────
Add: cacheComponents: true
Add cacheLife profiles with sanity profile (per skill).
Preserve any existing config.

─── frontend/sanity/lib/client.ts ───────────────────────────────────────────
EXTEND only — do NOT overwrite existing client config.
Ensure: stega enabled, token configured from SANITY_API_READ_TOKEN.
Add any missing exports the skill requires.

─── frontend/sanity/lib/live.ts ─────────────────────────────────────────────
EXTEND only — preserve existing sanityFetch and SanityLive exports.
ADD (from skill's reference/live-helpers.md — author these manually, NOT next-sanity imports):
  - sanityFetchStaticParams: for generateStaticParams (no perspective/stega)
  - sanityFetchMetadata: for generateMetadata (stega: false always — no stega in meta tags)
  - getDynamicFetchOptions: derives perspective + stega from request context

─── frontend/sanity/lib/queries.ts ──────────────────────────────────────────
Write ALL GROQ queries using defineQuery. Use groq template literal tag.
Include full projections (no wildcards that pull unnecessary data).

SETTINGS_QUERY         — siteSettings full projection (all groups)
NAVIGATION_QUERY       — navigation.items[] with label, command, route
HOME_PAGE_QUERY        — homePage + featuredProjects[]->{title,slug,commit,status,tags[]->,coverImage} + siteSettings.{askConsole,theme,portrait,name,handle,availabilityStatus}
ABOUT_PAGE_QUERY       — aboutPage full (all fields)
PORTFOLIO_PAGE_QUERY   — portfolioPage full (all labels)
PORTFOLIO_PROJECTS_QUERY — *[_type=="project"] | order(order asc, _createdAt desc) {title,slug,commit,status,tags[]->,role,problem,solution,stack,impact,coverImage,gallery,repo,live,order}
PROJECT_BY_SLUG_QUERY  — project by slug + prev (lower order) + next (higher order) by order field
BLOG_PAGE_QUERY        — blogPage full (all labels)
BLOG_POSTS_QUERY       — *[_type=="post"] | order(date desc) {title,slug,summary,date,category->,tags[]->,readTime,featured,coverImage}
POST_BY_SLUG_QUERY     — post by slug with full body + prev/next by date + recent 5 posts + category->
CONTACT_PAGE_QUERY     — contactPage full (all label objects)
ALL_TAGS_QUERY         — *[_type=="tag"] | order(title asc) {_id,title,slug}
ALL_CATEGORIES_QUERY   — *[_type=="category"]{_id,title,slug,"postCount":count(*[_type=="post"&&references(^._id)])}
QA_ENTRIES_QUERY       — *[_type=="qaEntry"&&enabled==true]{_id,title,keywords,answer,action}
PROJECTS_SLUG_QUERY    — *[_type=="project"].slug.current — for generateStaticParams
POSTS_SLUG_QUERY       — *[_type=="post"].slug.current — for generateStaticParams

Run: npm run sanity:typegen (from frontend/ or root — check package.json scripts)

─── frontend/app/layout.tsx ─────────────────────────────────────────────────
Root layout — assembles everything:

Import: portfolio.css (the ported stylesheet)
Import: next/font/google JetBrains Mono + Space Grotesk fonts (P3A exports them — import from components/portfolio/fonts.ts or define here)

Fetch data (server component, three-layer pattern per skill):
  - siteSettings (via sanityFetch with SETTINGS_QUERY)
  - navigation (via sanityFetch with NAVIGATION_QUERY)

Mount (in order):
  1. ThemeInit (server, receives siteSettings.theme)
  2. TopBar (server wrapper → passes data to client component)
  3. <main> children
  4. StatusBar (client, receives siteSettings.statusbar + navigation)
  5. <div className="fx-grain" /> + <div className="fx-vignette" /> overlays
  6. <SanityLive /> (single instance — from next-sanity)
  7. {isDraftMode && <VisualEditing />} + {isDraftMode && <DraftModeToast />}

Three-layer pattern: derive isDraftMode from draftMode() (next/headers); drill perspective + stega as props.
NO hardcoded perspective or stega at any callsite.

Run: cd frontend && npm run type-check && npm run lint
GATE: type-check + lint clean; typegen current (no type errors from queries); layout.tsx compiles; anti-pattern grep from skill returns nothing.`,
    { label: 'P3B Data Layer', phase: 'P3 Foundation', model: 'sonnet' }
  ),

])

log('P3 complete — design system + shell + data layer done')

// ─────────────────────────────────────────────────────────────────────────────
// P4 — 5 Page Workstreams — parallel with worktree isolation
// Each agent writes to its own non-overlapping directories.
// Queries are pre-written in P3B — agents import, do not modify queries.ts.
// AskConsole is authoritative in P4-Contact — Home/About import from ask/.
// ─────────────────────────────────────────────────────────────────────────────
phase('P4 Pages')

// P4a: Home, Portfolio, Blog, About in parallel (non-overlapping file paths)
await parallel([

  () => agent(
    `You are the HOME PAGE agent. Implement the / route with 1:1 visual and interactive parity.

READ FIRST:
1. docs/kokikillara-porfolio/js/home.jsx         — port every component + interaction verbatim to TSX
2. docs/kokikillara-porfolio/DESIGN.md §7        — interactions #1 boot, #2 streaming, #3 ascii reveal, #4 hero ascii, #5 ask console
3. docs/PRD.md §3 (route), §4.1 (homePage schema), §5.2, §5.4 (dataAttr rules)
4. .agents/skills/sanity-live-cache-components   — three-layer pattern
5. frontend/sanity/lib/queries.ts                — HOME_PAGE_QUERY, QA_ENTRIES_QUERY
6. frontend/app/components/portfolio/            — existing shell/* and fx/* to import (read what's there)

YOUR FILE SCOPE (write ONLY here):
- frontend/app/page.tsx
- frontend/app/loading.tsx
- frontend/app/error.tsx
- frontend/app/components/portfolio/home/**
- frontend/app/components/portfolio/ask/**   ← AskConsole placeholder ONLY (Contact agent owns the real impl)

─── / (app/page.tsx) ────────────────────────────────────────────────────────
Server component, three-layer pattern. Fetch: HOME_PAGE_QUERY + QA_ENTRIES_QUERY.
Render home sections:
  1. Hero boot sequence: BootLoader wrapper → after boot: prompt line (homePage.promptCommand) → think pill → tool-use blocks (homePage.toolActions[]) → successLines[] → portrait AsciiReveal
  2. heroLayout 'split': render HeroAscii (canvas, homePage.heroWord) + SystemCard (systemCard.roleLine, systemCard.kvRows)
     heroLayout 'boot': render the streaming boot sequence above
  3. Featured work section: homePage.featuredHeading + 3 .proj cards from featuredProjects refs
  4. Metrics section: homePage.metricsHeading + homePage.metrics[] as .metric tiles
  5. NextSteps CTAs: homePage.nextStepsHeading + homePage.nextSteps[] as .btn elements
  6. AskConsole mount (import AskConsole from ../components/portfolio/ask/ — created by Contact agent)

─── LIVE EDITING (dataAttr on EVERY editable element) ───────────────────────
Object/reference arrays (have _key) — use useOptimistic + dataAttr per item:
  metrics[], nextSteps[], featuredProjects[], systemCard.kvRows[]
Plain string arrays (no _key) — container-level dataAttr only:
  toolActions[], successLines[]
All text fields: dataAttr on the wrapping element
Images: dataAttr on the SanityImage wrapper

─── AskConsole PLACEHOLDER ──────────────────────────────────────────────────
Create frontend/app/components/portfolio/ask/AskConsole.tsx as a typed placeholder:
  export interface QaEntry { _id: string; title: string; keywords: string[]; answer: string[]; action?: any }
  export default function AskConsole({ entries, settings }: { entries: QaEntry[]; settings: any }) {
    return <div className="ask-console">{ /* TODO: implemented by Contact workstream */ }</div>
  }
The Contact agent will replace this with the full implementation.

─── loading/error ────────────────────────────────────────────────────────────
loading.tsx: .panel with Spinner + "streaming…" text (bootloader aesthetic)
error.tsx:   .out.err "✗ process exited with code 1" + retry button (.btn.ghost)

ZERO HARDCODED COPY: every rendered string from CMS props. No string literals in JSX.
Run: cd frontend && npm run type-check && npm run lint
GATE: type-check + lint clean; / renders; hero + metrics + CTAs + AskConsole placeholder visible.`,
    { label: 'P4 Home', phase: 'P4 Pages', model: 'opus' }
  ),

  () => agent(
    `You are the PORTFOLIO PAGE agent. Implement /portfolio and /portfolio/[slug].

READ FIRST:
1. docs/kokikillara-porfolio/js/portfolio.jsx    — port every component + interaction verbatim
2. docs/kokikillara-porfolio/js/project.jsx      — port project detail verbatim
3. docs/kokikillara-porfolio/DESIGN.md §7        — interaction #7: bento grid (algorithmic sizes, char-by-char reveal, infinite scroll)
4. docs/PRD.md §3, §4.1 (portfolioPage + detailLabels), §4.2 (project schema), §5.2, §5.4
5. .agents/skills/sanity-live-cache-components
6. frontend/sanity/lib/queries.ts               — PORTFOLIO_PAGE_QUERY, PORTFOLIO_PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY

YOUR FILE SCOPE:
- frontend/app/portfolio/page.tsx + loading.tsx + error.tsx
- frontend/app/portfolio/[slug]/page.tsx + loading.tsx + error.tsx
- frontend/app/components/portfolio/portfolio/**
  generateStaticParams in [slug]/page.tsx via sanityFetchStaticParams + PROJECTS_SLUG_QUERY

─── /portfolio ──────────────────────────────────────────────────────────────
Flag filters: tag docs → .flag chips (portfolioPage.filterLabel); active = .flag.on
Bento grid: ALGORITHMIC sizing only — pattern [xl, wide, tall, s, wide, s] cycling by card index
Per-card reveal: title types char-by-char, tags slide in, accent-fill CTA on hover, scan-line sweep
Real-data infinite scroll: IntersectionObserver sentinel; load next batch; end state = portfolioPage.endText with real {n}
Loading: portfolioPage.loadingText; matches: portfolioPage.matchesText with {n}/{m}/{max} interpolation

─── /portfolio/[slug] ───────────────────────────────────────────────────────
Deploy log: detailLabels.deployLogTitle + detailLabels.deployLogLines[] (interpolate {slug}/{repo}/{status} tokens)
Brief: problem (detailLabels.problemLabel), solution (detailLabels.solutionLabel)
Stack chips: detailLabels.stackLabel + project.stack[]
Role: detailLabels.roleLabel + project.role
Impact 3-col grid: detailLabels.impactHeading + project.impact[] (max 3)
Gallery: detailLabels.interfaceHeading + project.gallery[] (show 2)
Buttons: repo only if project.repo exists (detailLabels.cloneLabel); live only if project.live exists
Prev/next: by order field (detailLabels.prevLabel, detailLabels.nextLabel)
Back: detailLabels.backLabel → /portfolio

LIVE EDITING: dataAttr on all editable fields; useOptimistic for tags[] (_key); stack[] + impact[] get container dataAttr.
ZERO HARDCODED COPY: all labels from portfolioPage.detailLabels.
Run: cd frontend && npm run type-check && npm run lint
GATE: type-check + lint clean; bento grid renders with algorithmic sizes; filters work; infinite scroll sentinel; project detail complete.`,
    { label: 'P4 Portfolio', phase: 'P4 Pages', model: 'opus' }
  ),

  () => agent(
    `You are the BLOG PAGE agent. Implement /blog and /blog/[slug].

READ FIRST:
1. docs/kokikillara-porfolio/js/blog.jsx         — port every component verbatim
2. docs/kokikillara-porfolio/js/article.jsx      — port article view verbatim
3. docs/kokikillara-porfolio/DESIGN.md §7        — interaction #8: blog hover preview (cursor-following, spring pop)
4. docs/PRD.md §3, §4.1 (blogPage + articleLabels), §4.2 (post schema), §5.2, §5.4
5. .agents/skills/sanity-live-cache-components
6. frontend/sanity/lib/queries.ts               — BLOG_PAGE_QUERY, BLOG_POSTS_QUERY, POST_BY_SLUG_QUERY, ALL_CATEGORIES_QUERY

YOUR FILE SCOPE:
- frontend/app/blog/page.tsx + loading.tsx + error.tsx
- frontend/app/blog/[slug]/page.tsx + loading.tsx + error.tsx
- frontend/app/components/portfolio/blog/**
- frontend/app/components/portfolio/article/**
  generateStaticParams in [slug]/page.tsx via sanityFetchStaticParams + POSTS_SLUG_QUERY

─── /blog ───────────────────────────────────────────────────────────────────
Featured panel: blogPage.featuredPanelTitle + featured post with blogPage.featuredBadge + blogPage.readButtonLabel
Search field: blogPage.searchPlaceholder — client-side filter on fetched list
Category filter: client-side on fetched list
Log-stream rows: each post as a row; hover preview = cursor-following floating image with spring "pop" + idle breathing
  Disable hover preview on coarse pointer (matchMedia: '(pointer: coarse)')
Archive section: blogPage.archiveLabel + blogPage.archiveNote (interpolate {n}/{year})
End/loading states: blogPage.endText, blogPage.loadingText

─── /blog/[slug] ────────────────────────────────────────────────────────────
PortableText renderer (custom components):
  h2/h3: generate id from text (slugify), used by TOC
  blockquote: callout style (from design system)
  code: @sanity/react-portable-text code component
  image: SanityImage with articleLabels.figCaptionPrefix + sequential fig number
  link: anchor with correct target

Sidebar (sticky, scrollable independently):
  TOC (articleLabels.tocHeading): extract h2/h3 from body, scroll-spy with IntersectionObserver
  Search (articleLabels.searchHeading): links to /blog with search param pre-filled
  Categories with counts (articleLabels.categoriesHeading)
  Tag cloud (articleLabels.tagsHeading)
  Recent 5 posts (articleLabels.recentHeading)
  Archives by month (articleLabels.archivesHeading)
  Reading time: post.readTime or Math.ceil(wordCount / 185) (articleLabels.readingTimeHeading)

Prev/next by date (articleLabels.backLabel, moreNotesHeading)

LIVE EDITING: dataAttr on all editable elements; useOptimistic for tags[] (_key).
ZERO HARDCODED COPY: all labels from blogPage.articleLabels.
Run: cd frontend && npm run type-check && npm run lint
GATE: type-check + lint clean; blog renders; PortableText handles all block types; sidebar TOC + scroll-spy work.`,
    { label: 'P4 Blog', phase: 'P4 Pages', model: 'sonnet' }
  ),

  () => agent(
    `You are the ABOUT PAGE agent. Implement the /about route.

READ FIRST:
1. docs/kokikillara-porfolio/js/about.jsx        — port every component verbatim
2. docs/kokikillara-porfolio/DESIGN.md §6        — .trace component (vertical timeline with lit nodes)
3. docs/PRD.md §3, §4.1 (aboutPage schema), §5.2, §5.4
4. .agents/skills/sanity-live-cache-components
5. frontend/sanity/lib/queries.ts               — ABOUT_PAGE_QUERY, QA_ENTRIES_QUERY

YOUR FILE SCOPE:
- frontend/app/about/page.tsx + loading.tsx + error.tsx
- frontend/app/components/portfolio/about/**
  AskConsole: import from frontend/app/components/portfolio/ask/AskConsole (created by Home or Contact agent)

─── /about SECTIONS ─────────────────────────────────────────────────────────
1. Eyebrow (aboutPage.eyebrow) + Heading (aboutPage.heading)
2. Streaming bio: aboutPage.bioParagraphs[] — each paragraph streams in via Stream/Typewriter; one at a time in sequence
3. Experience: aboutPage.experiencePrompt (rendered as shell prompt) + timeline[] using .trace component:
   - Vertical line with nodes; current===true → "lit" node (accent color, glow)
   - Each entry: years badge, role, company, body text
4. Values: aboutPage.valuesPrompt + values[] as JSON-style {key: value} panel display
5. Stack: aboutPage.stackPrompt + stackRows[] as .kv (dotted-leader) rows with items[] as chips
6. CTAs: aboutPage.ctas[] as .btn elements with cmd/flag/sub from ctaCommand
7. AskConsole mount: import from ask/; pass entries (from QA_ENTRIES_QUERY) + askConsole settings

LIVE EDITING:
Object arrays with _key — useOptimistic: timeline[], values[], stackRows[], ctas[]
Plain string array — container dataAttr: bioParagraphs[]
All text fields: dataAttr on wrapper

ZERO HARDCODED COPY: all strings from aboutPage fields.
Run: cd frontend && npm run type-check && npm run lint
GATE: type-check + lint clean; /about renders; timeline trace with lit nodes; AskConsole mounts.`,
    { label: 'P4 About', phase: 'P4 Pages', model: 'sonnet' }
  ),

])

// P4b: Contact + AskConsole runs AFTER P4a so it authoritatively overwrites the AskConsole placeholder
await agent(
    `You are the CONTACT + ASKCONSOLE agent. Implement /contact and the shared AskConsole component.
AskConsole is used by Home and About — your implementation is the authoritative one.

READ FIRST:
1. docs/kokikillara-porfolio/js/contact.jsx      — port form UI verbatim (NO server action yet — stub only)
2. docs/kokikillara-porfolio/js/ask-console.jsx  — port AskConsole verbatim
3. docs/kokikillara-porfolio/js/qa.jsx           — port kwMatch algorithm verbatim
4. docs/PRD.md §3, §4.1 (contactPage schema), §5.2, §5.4, §5.5 (contact UX)
5. .agents/skills/sanity-live-cache-components
6. frontend/sanity/lib/queries.ts               — CONTACT_PAGE_QUERY, QA_ENTRIES_QUERY

YOUR FILE SCOPE:
- frontend/app/contact/page.tsx + loading.tsx + error.tsx
- frontend/app/components/portfolio/contact/**
- frontend/app/components/portfolio/ask/AskConsole.tsx   ← FULL IMPLEMENTATION (replace placeholder from Home agent)
- frontend/app/components/portfolio/ask/kwMatch.ts       ← port scoring algorithm exactly

─── /contact ────────────────────────────────────────────────────────────────
Form UI (client component — server action is a stub until P5):
  formTitle + formBadge header
  Fields: nameField.label + nameField.placeholder, emailField, messageField
  Honeypot: <input type="text" name="_hp" className="sr-only" tabIndex={-1} autoComplete="off" />
  Client validation (inline errors with ✗ prefix):
    onBlur + onSubmit: name required, email regex, message ≥12 chars
    Error strings from contactPage.validationMessages (nameRequired, emailRequired, emailInvalid, messageRequired, messageTooShort)
  Submit: contactPage.submitLabel button → calls server action stub → shows success panel on {success:true}
  Success panel: successPanelTitle, successLines[], successGreeting (interpolate {firstName} from name.split(' ')[0])
    + sendAnotherLabel button (resets form state)
  formNote below submit

Sidebar:
  availabilityHeading + availabilityText
  Link cards: email (from siteSettings.email), GitHub (siteSettings.github), LinkedIn (siteSettings.linkedin), CV (siteSettings.cv)
  resumeLabel for CV download link

─── AskConsole (frontend/app/components/portfolio/ask/AskConsole.tsx) ───────
'use client' — complete implementation:

Props: entries (QaEntry[]), settings (askConsole settings from siteSettings)

State: history (array of {role, lines}), inputValue, isProcessing, sessionId

Built-in commands:
  'clear' → clears history array
  'ls'    → lists navigation routes (passed as prop or from window.NAV — use prop)
  '/route' → programmatic navigation (useRouter)

Input handling:
  On submit: echo input → processing state → kwMatch → if match found: show think pill + tool-use block + stream answer lines
             if no match: show fallback lines from settings.fallback[]
  Suggestions chips: settings.suggestions[] → clicking fills input
  Empty state: settings.emptyMessage

kwMatch scoring: import from ./kwMatch.ts (algorithm below)
Animated scrambling placeholder: settings.placeholder string — scramble effect using requestAnimationFrame
  CRITICAL: stegaClean(settings.placeholder) before animating

─── kwMatch.ts ──────────────────────────────────────────────────────────────
Port the EXACT scoring algorithm from docs/kokikillara-porfolio/js/qa.jsx verbatim.
Export: function kwMatch(query: string, entries: QaEntry[]): QaEntry | null
Do not simplify or rewrite the algorithm — port it character-for-character.

─── Server Action Stub ───────────────────────────────────────────────────────
Create frontend/app/actions/contact.ts:
  'use server'
  export async function submitContact(formData: FormData) {
    return { success: false as const, error: 'Not implemented — P5 will implement this' }
  }

LIVE EDITING: dataAttr on form wrapper; nameField/emailField/messageField objects at container level; sidebar link values derive from siteSettings (already dataAttr'd at siteSettings level).
ZERO HARDCODED COPY: all labels from contactPage fields.
Run: cd frontend && npm run type-check && npm run lint
GATE: type-check + lint clean; /contact form renders; client validation works; AskConsole functional with real kwMatch.`,
    { label: 'P4 Contact+AskConsole', phase: 'P4 Pages', model: 'sonnet' }
  )

log('P4 complete — all 5 page workstreams done')

// ─────────────────────────────────────────────────────────────────────────────
// P5 — Contact Backend
// Model: sonnet (server action + write client — moderate complexity)
// ─────────────────────────────────────────────────────────────────────────────
phase('P5 Contact Backend')

await agent(
  `You are the CONTACT BACKEND agent. Implement the real server action replacing the P4 stub.

READ FIRST:
1. docs/PRD.md §5.5 (Contact form server action — exact rules, every requirement)
2. docs/EXECUTION_PLAN.md Phase 5
3. frontend/app/components/portfolio/contact/ — read the form component to understand expected action interface
4. frontend/app/actions/contact.ts — current stub (replace with full implementation)
5. .agents/skills/sanity-best-practices (write client patterns)

YOUR FILE SCOPE:
- frontend/sanity/lib/write-client.ts   (new file)
- frontend/app/actions/contact.ts       (replace stub)

─── frontend/sanity/lib/write-client.ts ─────────────────────────────────────
Add 'server-only' import (top line) — prevents accidental client bundling.
Create Sanity client with:
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  dataset: 'inbox'   ← CRITICAL: private dataset, not production
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
  token: process.env.SANITY_API_WRITE_TOKEN   ← throw if missing
  useCdn: false
Export: writeClient (not for client use)

─── frontend/app/actions/contact.ts ─────────────────────────────────────────
'use server'
import 'server-only'

Zod schema (match template validation EXACTLY per PRD §5.5 + contactPage.validationMessages keys):
  name: z.string().min(1)
  email: z.string().regex(/^[^@]+@[^@]+\.[^@]+$/)
  message: z.string().min(12)
  _hp: z.string()  ← honeypot

Simple in-memory rate limiter:
  const rateLimitMap = new Map<string, {count: number, windowStart: number}>()
  Per-IP: 5 requests per 60 seconds
  Get IP: headers().get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  On limit: return { success: false, error: 'rate_limited' }

Flow:
1. Parse formData with zod — on failure return { success: false, fieldErrors: zodError.flatten().fieldErrors }
2. If _hp !== '' → return { success: true } (silent honeypot drop — no doc, no email)
3. Check rate limit
4. writeClient.create({
     _type: 'contactSubmission',
     name: data.name, email: data.email, message: data.message,
     submittedAt: new Date().toISOString(),
     read: false
   })
5. Send Resend email:
   import { Resend } from 'resend'
   const resend = new Resend(process.env.RESEND_API_KEY)
   await resend.emails.send({
     from: 'portfolio@resend.dev',  ← works without domain verification for dev
     to: process.env.CONTACT_EMAIL_TO || '',
     subject: \`[portfolio] new message from \${data.name}\`,
     text: \`From: \${data.name} <\${data.email}>\\n\\n\${data.message}\`
   })
   If Resend fails: log error, do NOT surface to user (doc was already created)

Return type: { success: true; firstName: string } | { success: false; error: string; fieldErrors?: Record<string,string[]> }

Error handling:
  - SANITY_API_WRITE_TOKEN missing: { success: false, error: 'server_misconfigured' }
  - writeClient.create fails: { success: false, error: 'server_error' }
  - Log all errors server-side

GATE:
- Valid submit → contactSubmission doc in Studio Inbox (inbox dataset) + Resend email queued
- Invalid → fieldErrors returned matching contactPage.validationMessages keys
- Honeypot filled → { success: true } silently, zero docs created
- Rate limit → { success: false, error: 'rate_limited' }
- GROQ against production dataset returns ZERO contactSubmission docs (PII isolation: run *[_type=="contactSubmission"] against production — must return [])
Run: cd frontend && npm run type-check && npm run lint`,
  { label: 'P5 Contact Backend', phase: 'P5 Contact Backend', model: 'sonnet' }
)

log('P5 complete — contact server action + write client done')

// ─────────────────────────────────────────────────────────────────────────────
// P6 — SEO/AEO + RSS
// Model: sonnet (structured but mechanical — follow skill)
// ─────────────────────────────────────────────────────────────────────────────
phase('P6 SEO')

await agent(
  `You are the SEO/AEO agent. Add full SEO, structured data, sitemap, robots.txt, and RSS.

READ FIRST:
1. docs/PRD.md §5.7 (SEO/AEO spec — all requirements)
2. docs/EXECUTION_PLAN.md Phase 6
3. .agents/skills/seo-aeo-best-practices (apply completely)
4. frontend/sanity/lib/live.ts — sanityFetchMetadata helper (use for all metadata, ensures stega: false)
5. frontend/sanity/lib/queries.ts — SETTINGS_QUERY + all page queries

YOUR FILE SCOPE:
- Add generateMetadata to each route's page.tsx (all 7 routes)
- frontend/app/sitemap.ts (new)
- frontend/app/robots.ts (new)
- frontend/app/feed.xml/route.ts (new, RSS)

─── generateMetadata (all 7 route page.tsx files) ──────────────────────────
Use sanityFetchMetadata (stega: false — no stega characters must appear in HTML meta tags).
Fallback chain: page-level seo.metaTitle/metaDescription/ogImage → siteSettings.seo fallback.
Each route:
  title: page seo.metaTitle || siteSettings.seo.metaTitle || siteSettings.name
  description: page seo.metaDescription || siteSettings.seo.metaDescription || siteSettings.shortBio
  canonical: NEXT_PUBLIC_SITE_URL + route
  openGraph: { images: [ogImage], type: 'website' or 'article' }
  twitter: { card: 'summary_large_image' }
  robots: 'index,follow' for production; 'noindex' when NEXT_PUBLIC_VERCEL_ENV !== 'production'

─── JSON-LD structured data ────────────────────────────────────────────────
/ and /about → Person:
  { "@type": "Person", name, url, jobTitle: siteSettings.headline, sameAs: [github, linkedin] }
/blog/[slug] → BlogPosting:
  { "@type": "BlogPosting", headline, datePublished, author: Person, image: ogImage, description: summary }
/blog/[slug] → BreadcrumbList:
  Home → Blog → Article (with hrefs)
/portfolio → /blog → CollectionPage (name, url, description)
Inject via <script type="application/ld+json"> in the page component (not generateMetadata).

─── sitemap.ts ──────────────────────────────────────────────────────────────
Static routes: /, /portfolio, /blog, /about, /contact
Dynamic: use PROJECTS_SLUG_QUERY + POSTS_SLUG_QUERY via sanityFetchStaticParams (or direct client fetch, stega: false)
Return: MetadataRoute.Sitemap with lastModified + changeFrequency

─── robots.ts ───────────────────────────────────────────────────────────────
Allow: all crawlers, all paths
Sitemap: \${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml
Disallow: /api/ + /studio/ paths

─── frontend/app/feed.xml/route.ts (RSS GET handler) ────────────────────────
Fetch all posts (date desc, last 20) with title, slug, summary, date, category
Build RSS 2.0 XML:
  Channel: title + description from siteSettings; link = NEXT_PUBLIC_SITE_URL; self link
  Items: title, link (/blog/slug), description (summary), pubDate (ISO → RFC822), guid
Return Response with Content-Type: application/rss+xml

GATE:
- generateMetadata present on all 7 routes (grep: 'export.*generateMetadata' in all page.tsx files)
- No stega characters in any meta value (use sanityFetchMetadata everywhere)
- JSON-LD in source for /, /about, and one /blog/[slug]
- sitemap.ts lists all seeded slugs (6 projects + 8 posts + static routes)
- /feed.xml returns valid RSS structure
Run: cd frontend && npm run type-check && npm run lint`,
  { label: 'P6 SEO', phase: 'P6 SEO', model: 'sonnet' }
)

log('P6 complete — SEO + RSS done')

// ─────────────────────────────────────────────────────────────────────────────
// P7 — Adversarial Verification — max 2 rounds
// 4 independent reviewers per round → synthesizer → fix agent if needed
// Models: visual=sonnet, edit=sonnet, ux=haiku, qa=haiku, synth=sonnet, fix=sonnet
// ─────────────────────────────────────────────────────────────────────────────
phase('P7 Verify')

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    dimension: { type: 'string' },
    passed: { type: 'boolean' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          description: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
        },
        required: ['file', 'description', 'severity'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['dimension', 'passed', 'issues', 'summary'],
}

const SYNTH_SCHEMA = {
  type: 'object',
  properties: {
    allPassed: { type: 'boolean' },
    criticalCount: { type: 'number' },
    majorCount: { type: 'number' },
    fixInstructions: { type: 'array', items: { type: 'string' } },
  },
  required: ['allPassed', 'criticalCount', 'majorCount', 'fixInstructions'],
}

let round = 0
const MAX_ROUNDS = 2
let lastSynth = null

while (round < MAX_ROUNDS) {
  round++
  log('P7 verification round ' + round + '/' + MAX_ROUNDS)

  const reviewers = await parallel([

    () => agent(
      'You are the VISUAL PARITY reviewer (round ' + round + '). You are adversarial — assume there are bugs until proven otherwise. Do NOT read other reviewers\' results.\n\n' +
      'YOUR JOB: verify frontend matches the Kokikillara template CSS and DOM structure 1:1.\n\n' +
      'CHECK:\n' +
      '1. Read docs/kokikillara-porfolio/styles.css line by line — every variable, selector, rule\n' +
      '2. Read frontend/app/portfolio.css — compare against styles.css. Flag any missing rule, renamed class, or wrong value.\n' +
      '3. Read docs/kokikillara-porfolio/js/shell.jsx + home.jsx + portfolio.jsx + blog.jsx + about.jsx + contact.jsx\n' +
      '4. Read frontend/app/components/portfolio/**/*.tsx — verify class names match 1:1\n\n' +
      'VERIFY:\n' +
      '- All CSS custom properties present (--bg, --bg-1, --bg-2, --bg-3, --line, --ink, --accent, --mono, --display, --r, --r-lg, --bar-h, --status-h, --ease, etc.)\n' +
      '- Class names match exactly: .panel, .panel-head, .prompt, .who, .path, .cmd, .flag, .think, .tool, .tool-head, .tool-line, .out, .ok, .warn, .err, .acc, .muted, .btn, .btn.ghost, .btn.primary, .chip, .flag, .pill, .metric, .proj, .bento-grid, .statline, .kv, .trace, .ascii-reveal, .ascii-hero, .topbar, .statusbar, .fx-grain, .fx-vignette\n' +
      '- Font vars wired: --mono (JetBrains Mono) + --display (Space Grotesk)\n' +
      '- Grain/vignette overlays in layout\n' +
      '- Bento grid: algorithmic sizing [xl,wide,tall,s,wide,s] — no per-card size field\n' +
      '- Token meter in StatusBar: scroll depth → 23k-140k range\n\n' +
      'Return every discrepancy as an issue. Be exhaustive — you are the last line of defense.',
      { label: 'P7-Visual-r' + round, phase: 'P7 Verify', model: 'sonnet', schema: VERIFY_SCHEMA }
    ),

    () => agent(
      'You are the EDITABILITY reviewer (round ' + round + '). You are adversarial — assume fields are missing dataAttr until proven otherwise.\n\n' +
      'YOUR JOB: verify EVERY field in PRD §4 is editable via Presentation/stega.\n\n' +
      'READ:\n' +
      '1. docs/PRD.md §4.1 (ALL singleton field tables) + §4.2 (document fields) + §5.4 (dataAttr rules)\n' +
      '2. frontend/sanity/lib/queries.ts — verify ALL fields are fetched in every query (nothing missing)\n' +
      '3. frontend/app/components/portfolio/**/*.tsx — grep for dataAttr() and createDataAttribute calls\n' +
      '4. frontend/sanity/lib/client.ts + live.ts — verify stega is enabled\n\n' +
      'VERIFY:\n' +
      '- SanityLive + VisualEditing present in layout.tsx\n' +
      '- Stega enabled in client config\n' +
      '- Object arrays with _key use useOptimistic: metrics[], nextSteps[], timeline[], values[], stackRows[], featuredProjects[], navigation.items[], systemCard.kvRows[]\n' +
      '- Plain string arrays get container dataAttr (NOT per-item): toolActions[], successLines[], bioParagraphs[], stack[], impact[], suggestions[], fallback[], qaEntry.answer[]\n' +
      '- Every rendered text field has dataAttr on its wrapper element\n' +
      '- Every image field has dataAttr on the SanityImage wrapper\n' +
      '- No CMS field from PRD §4 is rendered without a corresponding dataAttr\n\n' +
      'For each missing or wrong dataAttr: note file + field name + severity.',
      { label: 'P7-Edit-r' + round, phase: 'P7 Verify', model: 'sonnet', schema: VERIFY_SCHEMA }
    ),

    () => agent(
      'You are the UX INTERACTIONS reviewer (round ' + round + '). Verify all 9 signature interactions from DESIGN.md §7.\n\n' +
      'READ:\n' +
      '1. docs/kokikillara-porfolio/DESIGN.md §7 (all 9 interactions — read each description carefully)\n' +
      '2. frontend/app/components/portfolio/fx/ — BootLoader, AsciiReveal, HeroAscii, Stream, Typewriter\n' +
      '3. frontend/app/components/portfolio/shell/ — CommandPalette, MobileConsole\n' +
      '4. frontend/app/components/portfolio/portfolio/ — bento grid + infinite scroll\n' +
      '5. frontend/app/components/portfolio/blog/ — hover preview\n' +
      '6. frontend/app/components/portfolio/ask/AskConsole.tsx + kwMatch.ts\n\n' +
      'VERIFY each interaction is present AND correctly implemented:\n' +
      '1. BootLoader: fake boot sequence, sessionStorage tracking, replay via nonce, reduced-motion skip\n' +
      '2. Streaming: Stream/Typewriter components, markBoot tracking per pageId\n' +
      '3. AsciiReveal: crossOrigin="anonymous", try/catch tainted canvas, stegaClean() on canvas strings\n' +
      '4. HeroAscii: crossOrigin="anonymous", try/catch tainted canvas, stegaClean() on heroWord prop\n' +
      '5. AskConsole: kwMatch scoring (EXACT algorithm from qa.jsx), clear/ls/route commands, scrambling placeholder, suggestions, fallback\n' +
      '6. CommandPalette: Ctrl/Cmd+K, arrow keys, navigate/links/actions groups, Escape to close\n' +
      '7. Bento grid: [xl,wide,tall,s,wide,s] algorithmic sizes, char-by-char title reveal, IntersectionObserver scroll sentinel\n' +
      '8. Blog hover preview: cursor-following image, spring animation, disabled on coarse pointer\n' +
      '9. Mobile console drawer: slides down, accent edge-bar + arrow animation per item\n' +
      'Extra: .anim-settled safety class exists for stuck opacity animations (prefers-reduced-motion + tab-background)\n\n' +
      'Flag any missing implementation or deviation from the template description.',
      { label: 'P7-UX-r' + round, phase: 'P7 Verify', model: 'haiku', schema: VERIFY_SCHEMA }
    ),

    () => agent(
      'You are the QUALITY GATES reviewer (round ' + round + '). Verify all PRD §8 quality requirements.\n\n' +
      'RUN EACH COMMAND AND REPORT exit code + any errors:\n' +
      '1. cd studio && npm run type-check\n' +
      '2. cd frontend && npm run type-check\n' +
      '3. cd studio && npm run lint\n' +
      '4. cd frontend && npm run lint\n\n' +
      'ALSO CHECK:\n' +
      '5. Grep for console.log/console.error in frontend/app (not in node_modules): should be zero\n' +
      '6. Grep for hardcoded strings rendered to DOM: grep -r \'"[A-Z]\' frontend/app/components — flag any that should come from CMS\n' +
      '7. frontend/sanity/lib/queries.ts: all queries use defineQuery(), no TypeScript "any"\n' +
      '8. frontend/app/layout.tsx: exactly one <SanityLive />, one <VisualEditing /> (draft-gated)\n' +
      '9. frontend/app/actions/contact.ts: NOT the stub version (check it has real writeClient.create call)\n' +
      '10. frontend/app/sitemap.ts, robots.ts, feed.xml/route.ts all exist\n' +
      '11. frontend/sanity/lib/write-client.ts has "server-only" import and dataset: "inbox"\n' +
      '12. generateMetadata exported from all 7 route page.tsx files\n\n' +
      'For each failure: file path + error message + severity (critical=build failure, major=wrong behavior, minor=warning).',
      { label: 'P7-QA-r' + round, phase: 'P7 Verify', model: 'haiku', schema: VERIFY_SCHEMA }
    ),
  ])

  const validReviewers = reviewers.filter(Boolean)
  const allPassed = validReviewers.every(function(r) { return r.passed })
  const totalIssues = validReviewers.flatMap(function(r) { return r.issues || [] })

  lastSynth = await agent(
    'You are the VERIFICATION SYNTHESIZER for round ' + round + '.\n\n' +
    'Reviewer summaries:\n' +
    validReviewers.map(function(r) { return r.dimension + ': passed=' + r.passed + ', issues=' + r.issues.length + ' — ' + r.summary }).join('\n') + '\n\n' +
    'All issues (' + totalIssues.length + ' total):\n' +
    totalIssues.map(function(i) { return '[' + i.severity + '] ' + i.file + ': ' + i.description }).join('\n') + '\n\n' +
    'Produce:\n' +
    '1. allPassed: true only if ALL reviewers passed with zero critical/major issues\n' +
    '2. Counts by severity\n' +
    '3. Ordered fix instructions (critical first, each with exact file path and action needed)',
    { label: 'P7-Synth-r' + round, phase: 'P7 Verify', model: 'sonnet', schema: SYNTH_SCHEMA }
  )

  if (lastSynth.allPassed) {
    log('P7 Round ' + round + ': ALL PASSED — verification complete')
    break
  }

  log('P7 Round ' + round + ': ' + lastSynth.criticalCount + ' critical, ' + lastSynth.majorCount + ' major issues found')

  if (round < MAX_ROUNDS) {
    log('Spawning fix agent for round ' + round)
    await agent(
      'You are the FIX agent for P7 round ' + round + '. Implement ALL fixes from the verification report.\n\n' +
      'FIX INSTRUCTIONS (ordered by priority — critical first):\n' +
      lastSynth.fixInstructions.join('\n') + '\n\n' +
      'RULES:\n' +
      '- Read each file before editing (surgical changes only)\n' +
      '- Fix ALL critical and major issues\n' +
      '- For minor issues: fix only if straightforward (< 10 lines change)\n' +
      '- After all edits: run cd frontend && npm run type-check && npm run lint\n' +
      '- After any schema changes: run cd studio && npm run type-check\n\n' +
      'Report: which fixes were applied (file + change description), which need manual intervention.',
      { label: 'P7-Fix-r' + round, phase: 'P7 Verify', model: 'sonnet' }
    )
  }
}

return {
  status: (lastSynth && lastSynth.allPassed) ? 'complete' : 'needs-review',
  rounds: round,
  remainingIssues: (lastSynth && !lastSynth.allPassed) ? lastSynth.fixInstructions : [],
}
