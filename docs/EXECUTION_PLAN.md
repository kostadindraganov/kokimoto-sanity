# Execution Plan — Kokikillara Portfolio → Sanity CMS

> Companion to `docs/PRD.md` (read it first — it is the contract).
> Designed for **multi-agent dynamic workflows**: phases are dependency-ordered; tasks inside a phase marked ∥ run in parallel agents. Every task has a verification gate — an agent is NOT done until its gate passes.
>
> **Required reading per agent:** `docs/PRD.md`, `docs/kokikillara-porfolio/DESIGN.md`, the relevant skill(s):
> `.agents/skills/sanity-best-practices` (schema/GROQ/visual-editing topics), `.agents/skills/next-best-practices`, `.agents/skills/sanity-live-cache-components` (data layer — follow exactly), `.agents/skills/seo-aeo-best-practices` (Phase 7). Template source: `docs/kokikillara-porfolio/js/*.jsx`, `styles.css`, `data/qa.json`.

## Dependency graph

```
P0 Setup
 └─ P1 Schema + Studio  ──────────────┐
     ├─ P2 Seed (needs P1 deployed)   │
     └─ P3 Frontend foundation (CSS/shell/data-layer; can start parallel to P2)
         └─ P4 Pages (5 parallel workstreams; needs P2 data + P3)
             ├─ P5 Contact backend (∥ with P4-contact finishing)
             └─ P6 SEO/AEO + RSS
                 └─ P7 Verification & polish (gate: PRD §8)
```

---

## Phase 0 — Setup (single agent, ~small)

1. **Verify plugin compatibility FIRST** (`npm view <pkg> version peerDependencies`): `sanity-plugin-media`, `@sanity/color-input`, `@sanity/code-input`, `@sanity/dashboard` (NOT "sanity-plugin-dashboard"), `sanity-plugin-vercel-deploy`. If `sanity-plugin-vercel-deploy` doesn't support Sanity v5, use the **approved fallback**: a ~30-line custom dashboard widget that POSTs to a Vercel Deploy Hook URL (env `VERCEL_DEPLOY_HOOK_URL`).
2. Install deps:
   - `studio/`: `sanity-plugin-media @sanity/color-input @sanity/code-input @sanity/dashboard sanity-plugin-vercel-deploy` (or fallback)
   - `frontend/`: `resend zod`
3. Create the private inbox dataset: `cd studio && npx sanity dataset create inbox --visibility private`.
4. Update `.env.example` in both apps per PRD §7. Ask the owner to provision: `SANITY_API_WRITE_TOKEN` (Editor token), `RESEND_API_KEY`, `CONTACT_EMAIL_TO`.
5. Copy template assets into repo: `docs/kokikillara-porfolio/project-images/*` → `studio/scripts/seed-assets/` (seed uploads them to Sanity; frontend serves only from CDN).

**Gate:** `npm install` clean in both workspaces; `npm run dev` still boots both apps; `inbox` dataset exists with `aclMode: private`.

---

## Phase 1 — Schema + Studio (1 agent schema, 1 agent ∥ studio-config after schema lands)

### 1A. Schema types (PRD §4.1–4.4, exact field tables)
- Create all objects, then documents, then singletons under `studio/src/schemaTypes/`; register in `index.ts`.
- Delete demo types (`page`, `person`, `callToAction`, `infoSection`, `button`, `blockContentTextOnly`, old `settings`); rewrite `post`, `blockContent`, `link`.
- Validation rules per PRD tables (required, unique slugs, email regex, max counts, featured-post warning).

### 1B. Studio config ∥ (after 1A merges)
- `src/structure/index.ts` per PRD §4.5 (singleton pattern, Inbox read-only, ordered projects).
- `sanity.config.ts`: export **array of two workspaces** — `default` (production: all plugins/schema) + `inbox` (private `inbox` dataset, only `contactSubmission`, read-only). Add plugins (media, colorInput, codeInput, `@sanity/dashboard` + vercel widget or fallback), rewrite `presentationTool` `mainDocuments` + `locations` for all 7 routes.
- AI: enable image generation via schema `options.aiAssist.imageInstructionField` on `post.coverImage`/`project.coverImage` (NOT plugin config — see PRD §4.6); editor-authored field instructions need no code.
- Disable create/delete on singletons + `contactSubmission` via document actions.

**Gate:** `npm run type-check -w studio` clean; Studio boots with zero schema warnings; `cd studio && npx sanity schema deploy` succeeds; `npm run sanity:typegen` regenerates types consumed by frontend.

---

## Phase 2 — Seed (single agent; needs P1 deployed)

1. Transcribe `js/data.jsx` + `data/qa.json` + article body structure (`js/article.jsx`) into `studio/scripts/seed-data.ts` (typed).
2. `studio/scripts/seed.ts` per PRD §6: asset upload (dedupe by filename); **upsert strategy** — explicit `_id` + `createOrReplace` ONLY for the 7 singletons; all other docs looked up by slug/title, `createIfNotExists` + patch, refs resolved from looked-up `_id`s (never hardcoded `_ref` strings); `--force` to overwrite, `--clean` for demo docs; final GROQ count report. Root script `npm run seed`.
3. Run it against `production`.

**Gate:** GROQ counts — 1 siteSettings, 1 navigation, 5 page singletons, 6 projects, 8 posts, ≥6 tags, 8 categories, 31 qaEntries; spot-check via `sanity documents query`; all images present in Media plugin; re-running seed is idempotent (no dupes).

---

## Phase 3 — Frontend foundation (can start ∥ with Phase 2; 2 agents)

### 3A. Design system + shell
- Port `styles.css` → `frontend/app/portfolio.css` verbatim; wire JetBrains Mono + Space Grotesk via `next/font/google` into the CSS vars; remove demo Tailwind theme remnants from layout (keep Tailwind v4 itself).
- Remove demo routes/components (old `page.tsx` home, `[slug]`, `posts/`, `PageBuilder`, `Cta`, `InfoSection`, `Posts`, `Header`, `Footer`, `Onboarding`, …). Keep: `SanityImage` (adapt), `DraftModeToast`, draft-mode route, `sanity/lib/*`.
- Port shell: `TopBar`, `StatusBar` (token-meter scroll mapping), `CommandPalette`, `MobileConsole` → `app/components/portfolio/shell/` (client components, props from CMS).
- Port fx primitives: `BootLoader`, `Stream`/`Typewriter`/`Spinner`/`Cursor`, `AsciiReveal`, `HeroAscii` → `fx/` (preserve reduced-motion + `.anim-settled`; add `crossOrigin="anonymous"` + tainted-canvas fallback for CDN images).
- `ThemeInit` from `siteSettings.theme` (accent var, grain class, hero layout).

### 3B. Data layer ∥
- Apply `sanity-live-cache-components` skill: `next.config.ts` cacheComponents, extend `client.ts`/`live.ts` (don't overwrite), three-layer pattern scaffolding, `getDynamicFetchOptions`.
- `sanity/lib/queries.ts`: `defineQuery` for settings, navigation, each singleton page, project list/detail(+prev/next), post list/detail(+recent/archives), tags, categories, qaEntries, slugs queries. Run typegen.
- Root `layout.tsx`: portfolio.css, fonts, ThemeInit, shell mount, grain/vignette overlays, single `<SanityLive>` + draft-gated `<VisualEditing>`.

**Gate:** app boots showing empty shell with correct chrome (topbar/statusbar from CMS data), fonts/colors identical to template; type-check + lint clean; anti-pattern grep from the skill ("Anti-patterns to grep for") returns nothing.

---

## Phase 4 — Pages (5 ∥ agents — one per workstream; needs P2 + P3)

Every workstream: server components fetch via `sanityFetch` three-layer pattern; `dataAttr()` on **every** editable element; `useOptimistic` on **object/reference arrays only** (they have `_key` — plain-string arrays get container `dataAttr` + Live whole-array refresh, per PRD §5.4); `loading.tsx` + `error.tsx` per route; match template DOM/classes 1:1 (port from the listed jsx files).

**Zero-hardcoded-copy rule (PRD §4 principle):** each workstream must wire ALL chrome labels from its page's label objects (`portfolioPage.detailLabels`, `blogPage.articleLabels`, `contactPage.validationMessages`/field objects, `siteSettings.uiText`/`askConsole.*`) — sidebar headings, placeholders, button captions, validation/success messages, deploy-log lines, loading/end-of-feed texts. Grep your finished components for string literals rendered to the DOM; only derived strings (counts, routes from navigation, TOC from headings) are allowed.

| Workstream | Routes | Port from | Specifics |
|---|---|---|---|
| **Home** | `/` | `home.jsx` | hero stream sequence (prompt→think→tools→lines), HeroAscii w/ CMS `heroWord`, sticky AsciiReveal portrait, featured work cards (refs), metrics, nextSteps CmdBtns, AskConsole mount |
| **Portfolio** | `/portfolio`, `/portfolio/[slug]` | `portfolio.jsx`, `project.jsx` | flag filters from `tag` docs, bento grid (algorithmic sizes, scroll reveal, char-by-char titles), real-data infinite scroll, sentinel end state; detail: deploy log, brief fields, impact grid, gallery, conditional repo/live buttons, prev/next by `order` |
| **Blog** | `/blog`, `/blog/[slug]` | `blog.jsx`, `article.jsx` | featured panel, search+category filters (client, on fetched list), hover preview (coarse-pointer disabled), log-stream rows; article: PortableText renderer (h2/h3 ids, callout, code, figures w/ "fig.N" captions), sidebar (TOC scroll-spy, search, categories w/ counts, tag cloud, recent 5, archives by month), prev/next |
| **About** | `/about` | `about.jsx` | streaming paragraphs, timeline trace (`current`→lit), values JSON panel, stack kv grid, CTAs, AskConsole mount |
| **Contact + AskConsole** | `/contact` + shared `ask/` | `contact.jsx`, `ask-console.jsx`, `qa.jsx` | form UI + client validation (server action stub until P5), sidebar cards from settings; AskConsole: port `kwMatch`/scoring verbatim, entries from CMS, built-in commands (`clear`, `ls`, `/route`), suggestions/fallback from settings, animated placeholder |

`generateStaticParams` via `sanityFetchStaticParams`; `generateMetadata` stub (full SEO in P6).

**Gate per workstream:** route renders pixel-equivalent to template (compare `docs/kokikillara-porfolio/screenshots/`); all texts stega-clickable in Presentation; draft edits appear live; loading/error states styled; type-check clean.

---

## Phase 5 — Contact backend (1 agent; after P4-contact UI)

- `app/actions/contact.ts` server action: zod schema (template rules), honeypot, simple per-IP in-memory rate limit (5/min), `contactSubmission` create via server-only write client targeting the **`inbox` dataset** (`sanity/lib/write-client.ts`), Resend email (terminal-styled plaintext ok), typed result → template success/error UI.
- Studio "Inbox" workspace verified (document appears, read-only).

**Gate:** e2e: submit valid form → doc in Inbox workspace + email delivered; invalid → inline `✗` errors; honeypot filled → silent success without doc/email; rate limit returns graceful error; write token absent → graceful error line; GROQ query against `production` returns ZERO contactSubmission docs (PII isolation check).

---

## Phase 6 — SEO/AEO + RSS (1 agent; apply seo-aeo skill)

- `generateMetadata` everywhere (doc `seo` → siteSettings fallback) via `sanityFetchMetadata`; canonicals; OG/Twitter.
- JSON-LD: Person (/, /about), BlogPosting + BreadcrumbList (/blog/[slug]), CollectionPage (/portfolio, /blog).
- `sitemap.ts` (all routes + slugs), `robots.ts`, `app/feed.xml/route.ts` RSS from posts.

**Gate:** metadata visible in page source for every route with stega-clean values (`stega: false` via metadata fetcher); valid RSS (W3C validator-clean structure); sitemap lists all seeded slugs.

---

## Phase 7 — Verification & polish (adversarial agents)

1. **Visual parity sweep:** Playwright/agent screenshots of all 7 routes at 1280/880/760/480 vs template screenshots; fix diffs.
2. **Editability audit:** for EVERY PRD §4 field — edit in Presentation → overlay opens correct field; edit in Studio → publish → live page updates. Produce a checklist table; zero misses allowed.
3. **Interaction audit:** PRD §8.3 list, including reduced-motion mode, tab-background `.anim-settled` safety, mobile drawer, Cmd+K, infinite scrolls, scroll-spy.
4. **Quality gates:** `npm run type-check`, `lint`, `build` (both apps), typegen current, zero console errors/warnings, Lighthouse (perf ≥85, SEO ≥95) on `/` + one article.
5. **Docs:** update root `README.md` (seed instructions, env vars, editing guide: Studio vs Presentation).

**Final gate:** all PRD §8 acceptance criteria checked off with evidence (screenshots/log output).

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Canvas effects break with CDN images (CORS/taint) | `crossOrigin="anonymous"`; keep template's skip-effect fallback; verify in P3 gate |
| Stega characters corrupt canvas/text-measuring code (ASCII hero word, typewriter) | use `stegaClean()` on values fed to canvas/animations; audit in P7 |
| `useOptimistic`/Live conflicts with streaming animations re-triggering on edits | boot/stream "seen" tracking keyed per pageId stays in-memory; live updates patch text without replaying boots (verify in P4 gates) |
| Old demo content/types lingering in dataset | seed `--clean` mode + P2 gate counts |
| Cache Components misconfig (hardcoded perspective/stega) | skill's anti-pattern grep is part of P3 + P7 gates |
| SVG covers + next/image | serve SVGs via direct CDN URL (no optimizer); raster images via `SanityImage` |
