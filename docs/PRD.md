# PRD — Kokikillara Portfolio → Sanity CMS Integration

> **Status:** Approved scope (2026-06-06). Owner decisions locked — see §2.
> **Source template:** `docs/kokikillara-porfolio/` (read `DESIGN.md` first — it is the design contract).
> **Target:** existing monorepo — `frontend/` (Next.js 16.2.7, next-sanity 13.0.8, React 19, Tailwind v4) + `studio/` (Sanity v5.30, project `n7jnm2k9`, dataset `production`).

---

## 1. Goal

Integrate the terminal/CLI-themed portfolio template into the existing Next.js + Sanity monorepo with **pixel-identical visuals** and **every text, image, menu and setting editable** through:

1. **Sanity Studio** (structured forms),
2. **Presentation tool / Visual Editing** (click-to-edit overlays on the live frontend),
3. **Sanity Live** (published changes appear instantly without redeploys).

Production-ready: real validation, loading and error states, SEO/AEO, seeded content. **No** multi-user roles, no i18n (EN only), no over-engineering.

### Non-goals
- Multi-language content (schema must not block adding `@sanity/document-internationalization` later).
- Generic page-builder pages (the demo `page`/`pageBuilder` types are removed).
- Visitor-facing tweaks panel (replaced by CMS theme settings — see §6.1).

---

## 2. Locked decisions (owner-approved)

| Topic | Decision |
|---|---|
| Contact form | Server Action → creates `contactSubmission` document in the **private `inbox` dataset** (production dataset is public — PII must not live there) **and** emails the owner via **Resend** |
| Ask Console | CMS-driven `qaEntry` documents + the template's keyword-matching algorithm (ported verbatim) |
| Plugins | `sanity-plugin-media`, `@sanity/color-input`, AI **Agent Actions** (via schema `options.aiAssist` + editor-authored instructions — see §4.6), `@sanity/dashboard` + `sanity-plugin-vercel-deploy` (verify v5 compat in Phase 0; approved fallback: custom dashboard widget POSTing to a Vercel Deploy Hook) |
| Languages | English only |
| Caching | Next.js **Cache Components** + `sanityFetch`/`<SanityLive>` per the `.agents/skills/sanity-live-cache-components` skill (next-sanity v13 pattern) |
| Seed | A repeatable seed script imports ALL template content (data.jsx + qa.json + assets) into the dataset |

Additional required dep: `@sanity/code-input` (article bodies contain code blocks).

---

## 3. Route structure (Next.js App Router)

Hash-SPA routes become real routes. All old demo routes/components are removed.

| Route | Page | Data sources |
|---|---|---|
| `/` | Home | `homePage` + `siteSettings` + featured `project` refs + `qaEntry` |
| `/portfolio` | Portfolio bento grid | `portfolioPage` + all `project` + `tag` |
| `/portfolio/[slug]` | Project detail | `project` by slug (+ prev/next) |
| `/blog` | Blog index | `blogPage` + all `post` + `category` + `tag` |
| `/blog/[slug]` | Article | `post` by slug (+ recent, prev/next, archives) |
| `/about` | About | `aboutPage` + `siteSettings` + `qaEntry` |
| `/contact` | Contact | `contactPage` + `siteSettings` |
| `/api/draft-mode/enable` | existing draft-mode endpoint (keep) | — |
| `/sitemap.xml`, `/robots.txt`, `/feed.xml` | SEO + RSS (template footer says "rss available") | all slugs |
| `not-found.tsx` | terminal-style 404 (`✗ route not found · exit 127`) | `siteSettings.uiText` |

Slugs for seeded posts use real slugs (e.g. `the-eval-harness-is-the-product`), not `p1…p8`.

---

## 4. Sanity schema

All types in `studio/src/schemaTypes/`, registered in `index.ts`, written with `defineType`/`defineField`, validation included. After changes run typegen (`npm run sanity:typegen`) and `npx sanity schema deploy` (so MCP tooling works).

> **Zero-hardcoded-copy principle:** no visible string may be hardcoded in a component. Every label, placeholder, validation message, button caption and log line is a CMS field (page-level label objects below, or `siteSettings` for global chrome); components receive all copy via props. The seed populates every field with the template's exact strings. Derived strings (counts, breadcrumb routes, `ls` output from navigation, TOC from body headings) come from data, not literals.

### 4.1 Singletons (`src/schemaTypes/singletons/`)

#### `siteSettings` (`_id: siteSettings`) — groups: identity, links, theme, askConsole, statusbar, uiText, seo
| Field | Type | Notes |
|---|---|---|
| `name` | string, required | "Kostadin Draganov" — hero name, article author |
| `handle` | string, required | "kostadin@portfolio" — topbar brand |
| `headline` | string, required | "Senior Software Developer · AI-Native Engineer" |
| `shortBio` | text, required | home hero bio |
| `email` | string, required, email regex | |
| `github`, `linkedin` | url | displayed without protocol |
| `location` | string | "Sofia, BG · remote" |
| `availability` | string | "available for selected collaborations" |
| `availabilityStatus` | boolean, default true | green "online" dot in topbar/contact |
| `cv` | file | downloadable resume |
| `portrait` | image (hotspot, alt required) | ASCII-reveal portrait, home + about |
| `theme.accentColor` | color (@sanity/color-input) + 4 swatch presets (`#db8c4e #e7c277 #8fb573 #7f9ec2`) | sets `--accent` |
| `theme.grain` | boolean, default true | film grain + vignette |
| `theme.heroLayout` | string radio: `boot` \| `split`, default `boot` | |
| `askConsole.enabled` | boolean, default true | |
| `askConsole.heading` | string ("ask the console") | section index label |
| `askConsole.description` | text ("A live session — type below…") | |
| `askConsole.placeholder` | string ("Ask me something") | animated scramble placeholder |
| `askConsole.emptyMessage` | string ("session listening — the prompt is at the bottom") | |
| `askConsole.suggestions` | array of string (max 6) | suggestion chips |
| `askConsole.fallback` | array of string | no-match answer lines |
| `statusbar.branchLabel` | string, default "main" | |
| `statusbar.statusText` | string, default "ready" | |
| `uiText` | object — global chrome strings: `notFoundTitle`, `notFoundBody`, `commandPalettePlaceholder` ("type a command…"), `mobileConsolePrompt` ("nav"), `newSessionLabel`, `copyEmailLabel` | page-specific labels live on the page singletons below |

Ask Console built-in `ls` output derives from `navigation.items`; breadcrumb commands (`← cd ../portfolio`, `cat ./blog/<slug>.md`) derive from navigation commands + the route — not hardcoded.
| `seo` | object: `metaTitle`, `metaDescription`, `ogImage` (alt + metadataBase url) | site defaults |

#### `navigation` (`_id: navigation`)
- `items[]` object: `label` (string, req), `command` (string, e.g. `/portfolio`), `route` (string list of internal routes: home/portfolio/about/blog/contact). Drives topbar, mobile console drawer, command palette "navigate" group. Palette "links/actions" groups derive from `siteSettings`.

#### `homePage` (`_id: homePage`)
| Field | Type |
|---|---|
| `heroWord` | string, required, default "KOKIMOTO" (ASCII canvas) |
| `promptCommand` | string, default "whoami" |
| `toolActions` | array of string (the 4 tool-use lines) |
| `successLines` | array of string (4 lines) |
| `portraitCaption` | string ("▍ k. draganov // IRL.png") |
| `featuredHeading` | string ("selected work") |
| `featuredProjects` | array of reference→project, max 3 |
| `metricsHeading` | string ("at a glance") |
| `metrics[]` | object `metric`: `value` (string), `unit` (string), `label` (string) — 4 items |
| `nextStepsHeading` | string |
| `nextSteps[]` | object `ctaCommand` (see 4.4) |
| `systemCard` | object for `split` hero layout: `roleLine` ("Senior · AI-Native Engineer"), `kvRows[]` {key, value} (exp/stack/tz/status) — name abbreviation derives from `siteSettings.name` |
| `seo` | seo object (optional overrides) |

#### `aboutPage` (`_id: aboutPage`)
- `eyebrow` ("/about"), `heading` ("Session history"), `portraitCaption` ("● online")
- `bioParagraphs` — array of text (3 streaming paragraphs)
- `experiencePrompt` (string, `grep "experience" profile.md`), `timeline[]` object: `years`, `role`, `company`, `body` (text), `current` (boolean → "lit")
- `valuesPrompt` (string), `values[]` object: `key`, `value`
- `stackPrompt` (string), `stackRows[]` object: `term` (string), `items` (array of string)
- `ctas[]` — `ctaCommand` objects
- `seo`

#### `portfolioPage` / `blogPage` / `contactPage`
Common: `eyebrow`, `heading`, `intro` (text), `seo`. Plus per-page label objects (all seeded with template strings; tokens in `{}` are interpolated):

**`portfolioPage`** — `filterLabel` ("filter:"), `matchesText` ("{n} matches · cycle {m}/{max}"), `loadingText` ("streaming next cycle…"), `endText` ("end of feed · {n} cards rendered"), and `detailLabels` object for `/portfolio/[slug]`: `deployLogTitle`, `deployLogLines[]` (strings with `{slug}` `{repo}` `{status}` tokens), `briefHeading` ("brief"), `problemLabel` ("# problem"), `solutionLabel` ("+ solution"), `stackLabel` ("$ stack"), `roleLabel` ("@ role"), `impactHeading` ("impact"), `interfaceHeading` ("interface"), `cloneLabel` ("git clone"), `openLiveLabel` ("open live"), `backLabel` ("back to portfolio"), `prevLabel`/`nextLabel`.

**`blogPage`** — `featuredPanelTitle` ("~/blog"), `featuredBadge` ("pinned"), `readButtonLabel` ("read article"), `searchPlaceholder` ("/search field notes…"), `noMatchesText`, `loadingText` ("loading next {n} entries…"), `endText` ("end of feed · {n} entries"), `archiveLabel` ("// archive"), `archiveNote` ("{n} unique entries · {year} · rss available"), and `articleLabels` object for `/blog/[slug]`: `tocHeading` ("on this page"), `searchHeading`, `categoriesHeading`, `tagsHeading`, `recentHeading` ("recent posts"), `archivesHeading`, `readingTimeHeading` ("reading time"), `categoryHeading` ("category"), `moreNotesHeading` ("more notes"), `backLabel` ("back to blog"), `figCaptionPrefix` ("fig."). Article TOC items derive from the post body's h2/h3 headings (auto-editable through the body).

**`contactPage`** — `formTitle` ("~/connect.sh"), `formBadge` ("[stdin]"), field objects `nameField`/`emailField`/`messageField` each {`label` ("--name"), `placeholder` ("your name")}, `submitLabel` ("run connect"), `formNote`, `validationMessages` object: `nameRequired`, `emailRequired`, `emailInvalid`, `messageRequired`, `messageTooShort` (template's exact error strings), `successPanelTitle` ("connect — exit 0"), `successLines` (array of string, 3), `successGreeting` ("Thanks, {firstName}…"), `sendAnotherLabel` ("↻ send another"), `availabilityHeading` ("● Available"), `availabilityText`, `resumeLabel` ("↓ resume"). Link cards (email/GitHub/LinkedIn/CV values) derive from `siteSettings`.

### 4.2 Documents (`src/schemaTypes/documents/`)

#### `project`
| Field | Type | Validation |
|---|---|---|
| `title` | string | required |
| `slug` | slug (from title) | required, unique |
| `commit` | string | required ("feat: real-time double-entry engine") |
| `status` | string list: `live` `shipped` `active` `archived` | required, default `shipped` |
| `tags` | array of reference→tag | 1–3 required (drives `--flag` filters) |
| `role` | string | |
| `problem` | text | required |
| `solution` | text | required |
| `stack` | array of string | chips |
| `impact` | array of string | max 3 (3-col metric grid) |
| `coverImage` | image (hotspot, alt required) | required — bento art |
| `gallery` | array of image (alt, caption) | "interface" section, 2 shown |
| `repo`, `live` | url | optional → conditional buttons |
| `order` | number | manual sort; grid sorts `order asc, _createdAt desc` |
| `seo` | seo object | optional |

Bento sizing stays **algorithmic** (template pattern `[xl, wide, tall, s, wide, s]` by index) — no per-doc field.

#### `post`
| Field | Type | Validation |
|---|---|---|
| `title` | string | required |
| `slug` | slug | required, unique |
| `summary` | text | required |
| `date` | date | required, default today |
| `category` | reference→category | required |
| `tags` | array of reference→tag | |
| `readTime` | number (min) | optional — auto-computed from body word count (~185 wpm) when empty |
| `featured` | boolean | pinned post; warning if another post already featured |
| `coverImage` | image (hotspot, alt required) | required |
| `body` | portable text | blocks (normal/h2/h3/blockquote), `code` (@sanity/code-input), image w/ alt+caption ("fig.N" frames), link annotation (href/internal) |
| `seo` | seo object | optional |

#### `category` — `title` (req), `slug` (req, unique), `description` (optional)
#### `tag` — `title` (req), `slug` (req, unique). Shared by projects (filters) and posts.

#### `qaEntry`
- `title` (string, req — internal id like "experience"), `keywords` (array of string, req), `answer` (array of text — each item = one streamed line), `action` (optional object: `cmd`, `flag`, `route` string list), `enabled` (boolean, default true).

#### `contactSubmission`
- `name`, `email`, `message`, `submittedAt` (datetime), `read` (boolean default false). Created **only** by the server action (write token).
- **Lives in the private `inbox` dataset** (the public `production` dataset would expose PII to anyone via API). Studio gets a second workspace **"Inbox"** (same projectId, `dataset: 'inbox'`, schema = just `contactSubmission`, read-only list, creation disabled). Phase 0 creates the dataset: `npx sanity dataset create inbox --visibility private`.

### 4.3 Removal of demo types
Delete `page`, `person`, old `post` fields, `callToAction`, `infoSection`, `button`, demo `link`, `blockContentTextOnly`; rewrite `settings`→`siteSettings`. Old demo documents in the dataset are deleted by the seed script's `--clean` mode (asks for confirmation; only types `page`, `person`, demo `post`, old `settings`).

### 4.4 Objects (`src/schemaTypes/objects/`)
`metric`, `timelineEntry`, `valueItem`, `stackRow`, `ctaCommand` (`cmd` string req, `flag` string, `sub` string, `primary` boolean, `route` internal-route list or external url), `qaAction`, `seo` (`metaTitle`, `metaDescription`, `ogImage`), `blockContent` (rewritten per §4.2 post.body).

### 4.5 Studio structure (`src/structure/index.ts`)
```
Workspace "default" (dataset: production)
  ⚙ Site Settings (singleton)
  🧭 Navigation (singleton)
  📄 Pages → Home / About / Portfolio / Blog / Contact (singletons)
  🗂 Portfolio → Projects (ordered by `order`) / Tags
  ✍ Blog → Posts / Categories / Tags
  🤖 Ask Console → Q&A Entries

Workspace "inbox" (dataset: inbox, private)
  📥 Contact Submissions (read-only list, unread badge via title)
```
Singletons: hidden from "create new", `documentIdEquals` filtering, no duplicate/delete actions.

### 4.6 Studio config additions (`sanity.config.ts`)
- Plugins added: `media()`, `colorInput()`, `codeInput()`, `dashboardTool({widgets: [vercelWidget(), projectInfoWidget(), documentListWidget(recent posts)]})` from **`@sanity/dashboard`** (NOT "sanity-plugin-dashboard"), keep `assist()`, `unsplashImageAsset()`, `visionTool()`.
- **AI / Agent Actions** (correct surface — this is NOT `sanity.config.ts` plugin options): image generation enabled per-field via schema `options.aiAssist.imageInstructionField` on `post.coverImage` + `project.coverImage`; "summary from body"-style field instructions are authored by the editor in the AI Assist UI (stored as `sanity.assist.*` docs). Optional later: a custom document action calling `client.agent.action.generate`.
- Config exported as **array of two workspaces**: `default` (production) and `inbox` (private dataset, `contactSubmission` schema only).
- `presentationTool`: `previewUrl` unchanged; **mainDocuments** for all 7 routes (`/`→homePage, `/portfolio`→portfolioPage, `/portfolio/:slug`→project, `/blog`→blogPage, `/blog/:slug`→post, `/about`→aboutPage, `/contact`→contactPage); **locations** resolvers for project, post, tag, category, siteSettings ("used on all pages").

---

## 5. Frontend architecture

### 5.1 Visual parity rules (hard requirements)
- `styles.css` is ported **verbatim** to `frontend/app/portfolio.css` (imported in root layout). Tailwind v4 stays for utilities but the template's class vocabulary (`.panel`, `.prompt`, `.bento-grid`, …) is preserved 1:1.
- Fonts via `next/font/google`: JetBrains Mono (200–700) → `--mono`, Space Grotesk (400–700) → `--display`. CSS variables wired into `:root`.
- Every signature interaction from DESIGN.md §7 is preserved: bootloader, streaming pages, ASCII reveal, hero ASCII canvas, ask console, command palette (Ctrl/Cmd+K), bento grid reveal + infinite scroll, blog hover preview, mobile console drawer. `prefers-reduced-motion` + `.anim-settled` safety net intact.
- QA compares against `docs/kokikillara-porfolio/screenshots/*` and the live template (`open index.html`).

### 5.2 Component layout (`frontend/app/components/portfolio/`)
- `shell/` — `TopBar`, `StatusBar`, `CommandPalette`, `MobileConsole` (client), fed by `navigation` + `siteSettings`.
- `fx/` — `HeroAscii`, `AsciiReveal`, `Stream`/`Typewriter`/`Spinner`/`Cursor`, `BootLoader` (client, ported from template JSX → TSX).
- `home/`, `about/`, `portfolio/`, `blog/`, `article/`, `contact/` — section components; server components fetch, client components animate. Data flows down as props (no globals).
- `ask/` — `AskConsole` + ported `kwMatch` scorer; entries fetched server-side, matching runs client-side.
- `ThemeInit` — server-rendered `<style>`/data-attrs applying `theme.accentColor`, `grain`, `heroLayout` from `siteSettings` (replaces tweaks panel).

**Porting notes:** ASCII canvas sampling of CDN images requires `crossOrigin="anonymous"` (cdn.sanity.io sends CORS headers); keep the template's tainted-canvas fallback. Infinite scroll paginates **real documents only** — no artificial cycling (deliberate production deviation; end text uses real counts). Streaming/boot "seen" tracking stays in-memory per session.

### 5.3 Data layer (per `sanity-live-cache-components` skill — follow it exactly)
- `next.config.ts`: `cacheComponents: true`, `cacheLife.default` = sanity profile.
- Keep/extend `sanity/lib/client.ts`, `live.ts` (don't overwrite; preserve token + stega config). Use `sanityFetch`, `sanityFetchStaticParams` (in `generateStaticParams`), `sanityFetchMetadata` (in `generateMetadata`, sitemap, feed). **Note:** `sanityFetchStaticParams`/`sanityFetchMetadata` are NOT `next-sanity` exports — they are helpers we author in `frontend/sanity/lib/live.ts`, full source in the skill's `reference/live-helpers.md`.
- Three-layer pattern (Page → Dynamic → Cached) with perspective/stega prop-drilling; **no hardcoded `perspective`/`stega`** at callsites.
- All queries in `sanity/lib/queries.ts` via `defineQuery`; typegen regenerated; zero `any`.

### 5.4 Live editing (the core requirement)
- Stega stays enabled; `dataAttr()` (`createDataAttribute`) applied on **every editable section and field wrapper** — headings, paragraphs, images, nav items, metrics, timeline entries, chips, CTAs.
- `useOptimistic` reconciliation for **object/reference arrays only** (metrics, nextSteps, timeline, values, stackRows, featuredProjects, nav items, systemCard.kvRows) — these have `_key`, same pattern as the demo `PageBuilder`. **Plain-string arrays** (toolActions, successLines, bioParagraphs, stack, impact, suggestions, fallback, qaEntry.answer) get container-level `dataAttr` + whole-array refresh via Live — per-item optimistic reconciliation is impossible without `_key` (index keys break Visual Editing). Do NOT convert them to objects; simple string lists are the better authoring UX here.
- One `<SanityLive>` + one `<VisualEditing>` (draft-mode-gated) in root layout; `DraftModeToast` kept.
- Acceptance: in Presentation, clicking ANY text/image on ANY route opens the exact field; edits stream into the canvas without reload; publishing updates the production page within seconds via Live.

### 5.5 Contact form
- Client: template UX verbatim (inline `✗` errors, success "exit status" panel, `↻ send another`).
- Server Action (`app/actions/contact.ts`): zod validation mirroring template rules (name required, email regex, message ≥ 12 chars) + honeypot field + **simple in-memory rate limit** (per-IP, e.g. 5/min — prevents Resend/document spam); on success → `writeClient.create` `contactSubmission` into the **`inbox` dataset** (`sanity/lib/write-client.ts`, server-only, `SANITY_API_WRITE_TOKEN`) + Resend email to owner (`RESEND_API_KEY`, `CONTACT_EMAIL_TO`). Errors map to the template's inline error styles; network failure shows terminal-style error line, form data preserved.

### 5.6 Loading / error / 404
- `loading.tsx` per route: bootloader/stream-skeleton aesthetic (panel + spinner + "streaming…").
- `error.tsx`: `✗ process exited with code 1` + retry button (template button styles).
- `not-found.tsx`: `uiText.notFoundTitle/Body`, exit-code 127 styling.

### 5.7 SEO / AEO (apply `.agents/skills/seo-aeo-best-practices`)
- `generateMetadata` on every route (singleton/doc `seo` overrides → `siteSettings.seo` fallback), canonical URLs, OG/Twitter images.
- JSON-LD: `Person` (home/about), `BlogPosting` (articles), `BreadcrumbList` (details).
- `sitemap.ts` (all routes + slugs), `robots.ts`, `/feed.xml` RSS for posts.
- `<noscript>` fallback equivalent: real SSR content makes this moot (improvement over template).

---

## 6. Seed script (required deliverable)

`studio/scripts/seed.ts`, run with `npx sanity exec scripts/seed.ts --with-user-token`. Root script: `npm run seed`.

1. **Assets:** uploads `project-images/portrait.jpg`, the 6 project SVGs; post covers — the template references `posts/p*.svg` which **do not exist on disk**, so seed rotates the 6 project SVGs as post covers (same deterministic rotation the article figures use). Owner can replace them in Studio later (or via approved AI image generation).
2. **Documents** — upsert strategy per sanity-best-practices: explicit stable `_id`s **only for the 7 singletons**; `project`/`post`/`tag`/`category`/`qaEntry` are looked up **by slug/title** and created with `createIfNotExists` + patched (refs resolved from the looked-up `_id`s, never hardcoded `_ref` strings). Re-runs never clobber editor changes; a `--force` flag opts into overwriting. Seeded docs: `siteSettings`, `navigation`, 5 page singletons, 6 `project` docs, 8 `post` docs (real slugs; Portable Text bodies reproducing the template article structure: lede → intro → "The problem" + callout → "What I changed" + code block + list → "What I'd keep" → 2 figures), 6 `tag` docs (frontend/backend/ai/fullstack/architecture + extras from posts), 8 `category` docs, 31 `qaEntry` docs from `data/qa.json`, suggestions/fallback into `siteSettings.askConsole`.
   **Every label/uiText field from §4.1 is seeded with the template's exact strings** (transcribed from `shell.jsx`, `contact.jsx`, `article.jsx`, `blog.jsx`, `portfolio.jsx`, `project.jsx`, `ask-console.jsx`) so the site is pixel- and copy-identical out of the box.
3. **`--clean` flag:** deletes old demo documents (`page`, `person`, old posts/settings) after listing what will be removed.
4. Source content is transcribed from `js/data.jsx`, `js/article.jsx` (body structure) and `data/qa.json` into a typed `seed-data.ts`.
5. Verification: script ends with GROQ counts per type + `npx sanity documents query` smoke check.

---

## 7. Env vars

| Var | Where | New? |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `DATASET` / `API_VERSION` / `STUDIO_URL` | frontend | existing |
| `SANITY_API_READ_TOKEN` | frontend | existing |
| `SANITY_API_WRITE_TOKEN` | frontend (server-only; writes `contactSubmission` to the private `inbox` dataset) | **new** |
| `RESEND_API_KEY`, `CONTACT_EMAIL_TO` | frontend | **new** |
| `SANITY_STUDIO_PROJECT_ID` / `DATASET` / `PREVIEW_URL` | studio | existing |

`.env.example` files updated in both apps.

---

## 8. Acceptance criteria

1. **Visual parity:** side-by-side with the static template, all 7 pages match (layout, colors, fonts, spacing, animations) on desktop + 880/760/480 breakpoints.
2. **Full editability:** every visible string/image/menu item traces to a Sanity field; Presentation click-to-edit works on all of them; publish → page updates live without redeploy.
3. **Interactions:** bootloader, streaming, ASCII hero (with CMS `heroWord`), ASCII reveal (CMS portrait), command palette, bento grid + filters (CMS tags), blog search/filter/hover-preview, article sidebar (TOC/scroll-spy/categories/tags/recent/archives), ask console answering from CMS entries, mobile drawer — all functional.
4. **Contact:** valid submit → document in Studio Inbox + email received; invalid input → template-style inline errors; honeypot silently drops bots.
5. **Quality gates:** `npm run type-check` clean, `npm run lint` clean, `npm run build` succeeds in both apps, typegen current, no console errors on any route, Lighthouse perf ≥ 85 / SEO ≥ 95 on `/` and one article.
6. **Seed:** fresh dataset + `npm run seed` → fully populated site identical to template content.
7. **Studio:** structure per §4.5; plugins functional (media library, color picker, code input, dashboard + Vercel deploy widget, AI assist image gen + field actions); schema deployed (`sanity schema deploy`).
