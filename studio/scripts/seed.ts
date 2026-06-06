/**
 * seed.ts — Kokikillara portfolio dataset seed script.
 *
 * Run with:   npx sanity exec scripts/seed.ts --with-user-token
 * Root alias: npm run seed
 *
 * Flags:
 *   --force   Overwrite existing documents (createOrReplace for all, not just singletons)
 *   --clean   Delete demo documents (page, person, old settings) before seeding
 */

import {createClient} from '@sanity/client'
import {createReadStream, existsSync, readdirSync, statSync} from 'fs'
import {join, basename} from 'path'
import {
  tagsData,
  categoriesData,
  projectsData,
  postsData,
  qaEntriesData,
  siteSettingsData,
  navigationData,
  homePageData,
  aboutPageData,
  portfolioPageData,
  blogPageData,
  contactPageData,
} from './seed-data'

// ─── Client setup ─────────────────────────────────────────────────────────────

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'n7jnm2k9'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_AUTH_TOKEN // injected by --with-user-token

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── CLI arg parsing ──────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const CLEAN = args.includes('--clean')

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(msg: string) {
  process.stdout.write(msg + '\n')
}

function ok(msg: string) {
  process.stdout.write(`  ✓ ${msg}\n`)
}

function skip(msg: string) {
  process.stdout.write(`  · ${msg}\n`)
}

function warn(msg: string) {
  process.stdout.write(`  ⚠ ${msg}\n`)
}

// ─── Asset helpers ────────────────────────────────────────────────────────────

interface AssetRef {
  _type: 'reference'
  _ref: string
}

/** Map of filename → Sanity asset _id */
const assetMap: Map<string, string> = new Map()

async function uploadAssets(): Promise<void> {
  log('\n── Uploading assets ─────────────────────────────────────────────')

  const assetsDir = join(__dirname, 'seed-assets')
  if (!existsSync(assetsDir)) {
    warn(`seed-assets/ directory not found at ${assetsDir} — skipping asset upload`)
    return
  }

  const files = readdirSync(assetsDir).filter((f) => {
    const fullPath = join(assetsDir, f)
    return statSync(fullPath).isFile() && (f.endsWith('.jpg') || f.endsWith('.svg') || f.endsWith('.png'))
  })

  for (const filename of files) {
    const filePath = join(assetsDir, filename)
    const assetType = filename.endsWith('.svg') ? 'image' : 'image'

    // Check if already uploaded by querying for the original filename
    const existing = await client.fetch<{_id: string}[]>(
      `*[_type == "sanity.imageAsset" && originalFilename == $filename]{_id}`,
      {filename},
    )

    if (existing.length > 0 && !FORCE) {
      skip(`${filename} — already uploaded (${existing[0]._id})`)
      assetMap.set(filename, existing[0]._id)
      continue
    }

    try {
      const stream = createReadStream(filePath)
      const asset = await client.assets.upload(assetType, stream, {filename})
      assetMap.set(filename, asset._id)
      ok(`${filename} → ${asset._id}`)
    } catch (err: unknown) {
      warn(`Failed to upload ${filename}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
}

function imageRef(filename: string): {asset: AssetRef} | null {
  const id = assetMap.get(filename)
  if (!id) return null
  return {
    asset: {_type: 'reference', _ref: id},
  }
}

// ─── --clean mode ─────────────────────────────────────────────────────────────

async function cleanDemoDocs(): Promise<void> {
  log('\n── --clean: scanning for demo documents ─────────────────────────')

  // Known portfolio slugs — posts with slugs NOT in this list are considered demo
  const portfolioPostSlugs = postsData.map((p) => p.slug)

  // 1. Old demo types: page, person
  const demoTypeDocs = await client.fetch<{_id: string; _type: string; title?: string}[]>(
    `*[_type in $types]{_id, _type, title}`,
    {types: ['page', 'person']},
  )

  // 2. Old/demo posts: posts whose slug is NOT one of our seeded slugs
  const demoPosts = await client.fetch<{_id: string; _type: string; title?: string; slug?: {current: string}}[]>(
    `*[_type == "post" && !(slug.current in $slugs)]{_id, _type, title, slug}`,
    {slugs: portfolioPostSlugs},
  )

  const allDemo = [...demoTypeDocs, ...demoPosts]

  if (allDemo.length === 0) {
    ok('No demo documents found')
    return
  }

  log(`\n  Found ${allDemo.length} demo document(s):`)
  allDemo.forEach((d) => {
    const slugInfo = 'slug' in d && d.slug ? ` [${d.slug.current}]` : ''
    log(`    [${d._type}] ${d._id}${slugInfo} — ${d.title || '(no title)'}`)
  })

  // In automated execution (no TTY), proceed automatically
  log('\n  Deleting demo documents...')
  const tx = client.transaction()
  allDemo.forEach((d) => tx.delete(d._id))
  await tx.commit()
  ok(`Deleted ${allDemo.length} demo documents`)
}

// ─── Upsert helpers ───────────────────────────────────────────────────────────

/** Singleton: always createOrReplace with explicit stable _id */
async function upsertSingleton(doc: Record<string, unknown>): Promise<string> {
  const id = doc._id as string
  try {
    if (FORCE) {
      await client.createOrReplace(doc)
      ok(`singleton ${id} — replaced`)
    } else {
      await client.createIfNotExists(doc)
      // Always patch non-id fields to keep content fresh
      const {_id, _type, ...fields} = doc
      await client.patch(id).set(fields).commit()
      ok(`singleton ${id} — upserted`)
    }
    return id
  } catch (err: unknown) {
    warn(`singleton ${id} failed: ${err instanceof Error ? err.message : String(err)}`)
    return id
  }
}

/** Non-singleton: lookup by slug, createIfNotExists + patch. Returns _id. */
async function upsertBySlug(
  type: string,
  slug: string,
  doc: Record<string, unknown>,
): Promise<string | null> {
  try {
    const existing = await client.fetch<{_id: string}[]>(
      `*[_type == $type && slug.current == $slug][0]{_id}`,
      {type, slug},
    )

    if (existing && !FORCE) {
      const {_id, _type, slug: _slug, ...fields} = doc
      await client.patch(existing._id).set(fields).commit()
      skip(`${type}:${slug} — patched existing (${existing._id})`)
      return existing._id
    } else if (existing && FORCE) {
      await client.createOrReplace({...doc, _id: existing._id})
      ok(`${type}:${slug} — force-replaced (${existing._id})`)
      return existing._id
    } else {
      // Create new — let Sanity generate _id
      const created = await client.create(doc)
      ok(`${type}:${slug} — created (${created._id})`)
      return created._id
    }
  } catch (err: unknown) {
    warn(`upsert ${type}:${slug} failed: ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}

/** Non-singleton lookup by title (for types without slugs in schema) */
async function upsertByTitle(
  type: string,
  title: string,
  doc: Record<string, unknown>,
): Promise<string | null> {
  try {
    const existing = await client.fetch<{_id: string}[]>(
      `*[_type == $type && title == $title][0]{_id}`,
      {type, title},
    )

    if (existing && !FORCE) {
      const {_id, _type, ...fields} = doc
      await client.patch(existing._id).set(fields).commit()
      skip(`${type}:"${title}" — patched existing`)
      return existing._id
    } else if (existing && FORCE) {
      await client.createOrReplace({...doc, _id: existing._id})
      ok(`${type}:"${title}" — force-replaced`)
      return existing._id
    } else {
      const created = await client.create(doc)
      ok(`${type}:"${title}" — created (${created._id})`)
      return created._id
    }
  } catch (err: unknown) {
    warn(`upsert ${type}:"${title}" failed: ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}

// ─── Portable Text body builder ───────────────────────────────────────────────

function buildPortableTextBody(post: {
  title: string
  summary: string
  category: string
  id: string
}): unknown[] {
  // Article structure: lede → intro → problem+callout → solution+code+list → keep → figures
  // Matches the template's ArticleBody component in article.jsx
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return [
    // lede (summary)
    {
      _type: 'block',
      _key: `${post.id}-lede`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-lede-span`,
          marks: [],
          text: post.summary,
        },
      ],
    },
    // intro paragraph
    {
      _type: 'block',
      _key: `${post.id}-intro`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-intro-s1`,
          marks: [],
          text: 'This note is written the way I actually work — pragmatic, measured, and biased toward what survives contact with production. The short version: the interesting decisions in ',
        },
        {
          _type: 'span',
          _key: `${post.id}-intro-s2`,
          marks: ['strong'],
          text: post.category.toLowerCase(),
        },
        {
          _type: 'span',
          _key: `${post.id}-intro-s3`,
          marks: [],
          text: ' are rarely about the technology itself. They\'re about where you choose to absorb complexity, and where you refuse to.',
        },
      ],
    },
    // ## The problem
    {
      _type: 'block',
      _key: `${post.id}-h-problem`,
      style: 'h2',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-h-problem-span`,
          marks: [],
          text: 'The problem',
        },
      ],
    },
    {
      _type: 'block',
      _key: `${post.id}-problem-body`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-problem-body-span`,
          marks: [],
          text: "Most teams reach for the sophisticated answer before they've earned it. The failure mode isn't using the wrong tool — it's adopting power you can't yet operate. I've watched otherwise-sharp groups pay a recurring tax on abstractions that solved a problem they didn't have, while the problem they did have quietly compounded.",
        },
      ],
    },
    // callout blockquote
    {
      _type: 'block',
      _key: `${post.id}-callout`,
      style: 'blockquote',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-callout-span`,
          marks: [],
          text: "Rule of thumb: complexity you add is a loan. You'll service the interest on every change, every onboarding, and every incident — forever. Borrow deliberately.",
        },
      ],
    },
    // ## What I changed
    {
      _type: 'block',
      _key: `${post.id}-h-changed`,
      style: 'h2',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-h-changed-span`,
          marks: [],
          text: 'What I changed',
        },
      ],
    },
    {
      _type: 'block',
      _key: `${post.id}-changed-intro`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-changed-intro-span`,
          marks: [],
          text: 'The lever was making the system legible. Once the moving parts were named, typed, and observable, the team could reason about change instead of fearing it. A representative slice of the work:',
        },
      ],
    },
    // code block
    {
      _type: 'code',
      _key: `${post.id}-code`,
      language: 'bash',
      filename: `~/notes/${slug}.sh`,
      code: `$ git log --oneline -3\n8bd01d8 refactor: extract command handlers, make them idempotent\n3f9a210 feat: add read-model projection + replay\nc10e4d7 chore: instrument hot path with traces\n# result: change became cheap, incidents became boring`,
    },
    // bullet list
    {
      _type: 'block',
      _key: `${post.id}-list-1`,
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-list-1-span`,
          marks: [],
          text: 'Drew a hard line between commands (intent) and effects (consequence).',
        },
      ],
    },
    {
      _type: 'block',
      _key: `${post.id}-list-2`,
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-list-2-span`,
          marks: [],
          text: 'Made every state transition observable before optimising any of them.',
        },
      ],
    },
    {
      _type: 'block',
      _key: `${post.id}-list-3`,
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-list-3-span`,
          marks: [],
          text: "Wrote the test that would have caught last quarter's incident — then the code.",
        },
      ],
    },
    {
      _type: 'block',
      _key: `${post.id}-list-4`,
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-list-4-span`,
          marks: [],
          text: 'Deleted more than I added. Twice.',
        },
      ],
    },
    // ## What I'd keep
    {
      _type: 'block',
      _key: `${post.id}-h-keep`,
      style: 'h2',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-h-keep-span`,
          marks: [],
          text: "What I'd keep",
        },
      ],
    },
    {
      _type: 'block',
      _key: `${post.id}-keep-body`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-keep-body-s1`,
          marks: [],
          text: 'If you take one thing from this: optimise for the cost of the ',
        },
        {
          _type: 'span',
          _key: `${post.id}-keep-body-s2`,
          marks: ['em'],
          text: 'next',
        },
        {
          _type: 'span',
          _key: `${post.id}-keep-body-s3`,
          marks: [],
          text: " change, not the elegance of the current one. The teams that ship calmly aren't smarter — they've just made their systems cheap to change and easy to watch. Everything else is downstream of that.",
        },
      ],
    },
    // closing note
    {
      _type: 'block',
      _key: `${post.id}-closing`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${post.id}-closing-span`,
          marks: [],
          text: '— written between deploys. Reach me at kostadin@draganov.dev if you want to argue about any of it.',
        },
      ],
    },
  ]
}

// ─── Seed sequence ─────────────────────────────────────────────────────────────

async function seedTags(): Promise<Map<string, string>> {
  log('\n── Seeding tags ─────────────────────────────────────────────────')
  const tagIdMap = new Map<string, string>()

  for (const tag of tagsData) {
    const doc = {
      _type: 'tag',
      title: tag.title,
      slug: {_type: 'slug', current: tag.slug},
    }
    const id = await upsertBySlug('tag', tag.slug, doc)
    if (id) tagIdMap.set(tag.slug, id)
  }

  return tagIdMap
}

async function seedCategories(): Promise<Map<string, string>> {
  log('\n── Seeding categories ───────────────────────────────────────────')
  const catIdMap = new Map<string, string>()

  for (const cat of categoriesData) {
    const doc = {
      _type: 'category',
      title: cat.title,
      slug: {_type: 'slug', current: cat.slug},
      ...(cat.description ? {description: cat.description} : {}),
    }
    const id = await upsertBySlug('category', cat.slug, doc)
    if (id) {
      catIdMap.set(cat.slug, id)
      // Also map by title for post lookup
      catIdMap.set(cat.title, id)
    }
  }

  return catIdMap
}

async function seedProjects(tagIdMap: Map<string, string>): Promise<Map<string, string>> {
  log('\n── Seeding projects ─────────────────────────────────────────────')
  const projIdMap = new Map<string, string>()

  // asset filename map for project covers
  const projectCoverMap: Record<string, string> = {
    'ledger-core': 'ledger-core.svg',
    'atlas-console': 'atlas-console.svg',
    promptforge: 'promptforge.svg',
    'northwind-edge': 'northwind-edge.svg',
    'relay-automation': 'relay-automation.svg',
    'fieldnotes-cms': 'fieldnotes-cms.svg',
  }

  for (const proj of projectsData) {
    const coverFile = projectCoverMap[proj.id]
    const cover = coverFile ? imageRef(coverFile) : null

    const tagRefs = proj.tags
      .map((slug) => tagIdMap.get(slug))
      .filter(Boolean)
      .map((id) => ({_type: 'reference', _ref: id, _key: id}))

    const doc: Record<string, unknown> = {
      _type: 'project',
      title: proj.title,
      slug: {_type: 'slug', current: proj.slug},
      commit: proj.commit,
      status: proj.status,
      tags: tagRefs,
      role: proj.role,
      problem: proj.problem,
      solution: proj.solution,
      stack: proj.stack,
      impact: proj.impact,
      order: proj.order,
      ...(proj.repo ? {repo: proj.repo} : {}),
      ...(proj.live ? {live: proj.live} : {}),
      ...(cover
        ? {
            coverImage: {
              ...cover,
              _type: 'image',
              alt: `${proj.title} cover`,
            },
          }
        : {}),
    }

    const id = await upsertBySlug('project', proj.slug, doc)
    if (id) projIdMap.set(proj.id, id)
  }

  return projIdMap
}

async function seedPosts(
  tagIdMap: Map<string, string>,
  catIdMap: Map<string, string>,
): Promise<void> {
  log('\n── Seeding posts ────────────────────────────────────────────────')

  // Project cover images used as rotating post covers (deterministic per post index)
  const rotatingSvgs = [
    'ledger-core.svg',
    'atlas-console.svg',
    'promptforge.svg',
    'northwind-edge.svg',
    'relay-automation.svg',
    'fieldnotes-cms.svg',
  ]

  for (let i = 0; i < postsData.length; i++) {
    const post = postsData[i]

    // Try to use the post's own cover SVG first (post-p1.svg etc)
    const postCoverFile = `post-${post.id}.svg`
    const hasDedicatedCover = assetMap.has(postCoverFile)
    const coverFile = hasDedicatedCover ? postCoverFile : rotatingSvgs[i % rotatingSvgs.length]
    const cover = imageRef(coverFile)

    const catTitle = post.category
    const catId = catIdMap.get(catTitle) || catIdMap.get(catTitle.toLowerCase())

    const tagRefs = post.tags
      .map((slug) => tagIdMap.get(slug))
      .filter(Boolean)
      .map((id) => ({_type: 'reference', _ref: id, _key: id}))

    const body = buildPortableTextBody(post)

    const doc: Record<string, unknown> = {
      _type: 'post',
      title: post.title,
      slug: {_type: 'slug', current: post.slug},
      summary: post.summary,
      date: post.date,
      readTime: post.readTime,
      ...(post.featured ? {featured: true} : {}),
      ...(catId ? {category: {_type: 'reference', _ref: catId}} : {}),
      tags: tagRefs,
      body,
      ...(cover
        ? {
            coverImage: {
              ...cover,
              _type: 'image',
              alt: `${post.title} cover`,
            },
          }
        : {}),
    }

    await upsertBySlug('post', post.slug, doc)
  }
}

async function seedQaEntries(): Promise<void> {
  log('\n── Seeding Q&A entries ──────────────────────────────────────────')

  for (const entry of qaEntriesData) {
    const doc: Record<string, unknown> = {
      _type: 'qaEntry',
      title: entry.title,
      keywords: entry.keywords,
      answer: entry.answer,
      enabled: entry.enabled,
      ...(entry.action
        ? {
            action: {
              _type: 'qaAction',
              cmd: entry.action.cmd,
              ...(entry.action.flag ? {flag: entry.action.flag} : {}),
              ...(entry.action.route ? {route: entry.action.route} : {}),
            },
          }
        : {}),
    }

    await upsertByTitle('qaEntry', entry.title, doc)
  }
}

async function seedSiteSettings(portraitId: string | undefined): Promise<void> {
  log('\n── Seeding siteSettings singleton ───────────────────────────────')

  const doc: Record<string, unknown> = {
    ...siteSettingsData,
    ...(portraitId
      ? {
          portrait: {
            _type: 'image',
            asset: {_type: 'reference', _ref: portraitId},
            alt: 'Kostadin Draganov portrait',
          },
        }
      : {}),
  }

  await upsertSingleton(doc)
}

async function seedNavigation(): Promise<void> {
  log('\n── Seeding navigation singleton ─────────────────────────────────')
  await upsertSingleton(navigationData)
}

async function seedHomePage(projIdMap: Map<string, string>): Promise<void> {
  log('\n── Seeding homePage singleton ───────────────────────────────────')

  // Featured projects: first 3 from projectsData
  const featuredProjectIds = ['ledger-core', 'atlas-console', 'promptforge']
    .map((id) => projIdMap.get(id))
    .filter(Boolean)

  const featuredProjects = featuredProjectIds.map((id) => ({
    _type: 'reference',
    _ref: id,
    _key: id,
  }))

  const metricsWithKeys = homePageData.metrics.map((m, i) => ({
    ...m,
    _type: 'metric',
    _key: `metric-${i}`,
  }))

  const nextStepsWithKeys = homePageData.nextSteps.map((s, i) => ({
    ...s,
    _type: 'ctaCommand',
    _key: `cta-${i}`,
  }))

  const kvRowsWithKeys = homePageData.systemCard.kvRows.map((r, i) => ({
    ...r,
    _key: `kv-${i}`,
  }))

  const doc = {
    ...homePageData,
    featuredProjects,
    metrics: metricsWithKeys,
    nextSteps: nextStepsWithKeys,
    systemCard: {
      ...homePageData.systemCard,
      kvRows: kvRowsWithKeys,
    },
  }

  await upsertSingleton(doc)
}

async function seedAboutPage(): Promise<void> {
  log('\n── Seeding aboutPage singleton ──────────────────────────────────')

  const timelineWithKeys = aboutPageData.timeline.map((t, i) => ({
    ...t,
    _type: 'timelineEntry',
    _key: `tl-${i}`,
  }))

  const valuesWithKeys = aboutPageData.values.map((v, i) => ({
    ...v,
    _type: 'valueItem',
    _key: `val-${i}`,
  }))

  const stackRowsWithKeys = aboutPageData.stackRows.map((s, i) => ({
    ...s,
    _type: 'stackRow',
    _key: `stack-${i}`,
  }))

  const ctasWithKeys = aboutPageData.ctas.map((c, i) => ({
    ...c,
    _type: 'ctaCommand',
    _key: `cta-${i}`,
  }))

  const doc = {
    ...aboutPageData,
    timeline: timelineWithKeys,
    values: valuesWithKeys,
    stackRows: stackRowsWithKeys,
    ctas: ctasWithKeys,
  }

  await upsertSingleton(doc)
}

async function seedPortfolioPage(): Promise<void> {
  log('\n── Seeding portfolioPage singleton ──────────────────────────────')

  const deployLogLinesWithKeys = portfolioPageData.detailLabels.deployLogLines.map((l, i) => ({
    _key: `dlog-${i}`,
    value: l,
  }))

  const doc = {
    ...portfolioPageData,
    detailLabels: {
      ...portfolioPageData.detailLabels,
      deployLogLines: deployLogLinesWithKeys,
    },
  }

  await upsertSingleton(doc)
}

async function seedBlogPage(): Promise<void> {
  log('\n── Seeding blogPage singleton ───────────────────────────────────')

  const toolActionsGenerateCoverWithKeys = blogPageData.articleLabels.toolActionsGenerateCover.map(
    (a, i) => ({
      _key: `tool-gen-${i}`,
      value: a,
    }),
  )

  const toolActionsRunningWithKeys = blogPageData.articleLabels.toolActionsRunning.map((a, i) => ({
    _key: `tool-run-${i}`,
    value: a,
  }))

  const doc = {
    ...blogPageData,
    articleLabels: {
      ...blogPageData.articleLabels,
      toolActionsGenerateCover: toolActionsGenerateCoverWithKeys,
      toolActionsRunning: toolActionsRunningWithKeys,
    },
  }

  await upsertSingleton(doc)
}

async function seedContactPage(): Promise<void> {
  log('\n── Seeding contactPage singleton ────────────────────────────────')

  const successLinesWithKeys = contactPageData.successLines.map((l, i) => ({
    _key: `sline-${i}`,
    value: l,
  }))

  const doc = {
    ...contactPageData,
    successLines: successLinesWithKeys,
  }

  await upsertSingleton(doc)
}

// ─── Final GROQ count report ──────────────────────────────────────────────────

async function reportCounts(): Promise<void> {
  log('\n── GROQ count report ────────────────────────────────────────────')

  const types = [
    'siteSettings',
    'navigation',
    'homePage',
    'aboutPage',
    'portfolioPage',
    'blogPage',
    'contactPage',
    'project',
    'post',
    'tag',
    'category',
    'qaEntry',
  ]

  const expected: Record<string, number | string> = {
    siteSettings: 1,
    navigation: 1,
    homePage: 1,
    aboutPage: 1,
    portfolioPage: 1,
    blogPage: 1,
    contactPage: 1,
    project: 6,
    post: '≥8',
    tag: '≥6',
    category: 8,
    qaEntry: '≥27',
  }

  let allPass = true
  for (const t of types) {
    const count = await client.fetch<number>(`count(*[_type == $t])`, {t})
    const exp = expected[t]
    const pass =
      typeof exp === 'number'
        ? count === exp
        : typeof exp === 'string' && exp.startsWith('≥')
          ? count >= parseInt(exp.slice(1))
          : true

    const status = pass ? '✓' : '✗'
    if (!pass) allPass = false
    log(`  ${status} ${t}: ${count}${exp !== undefined ? ` (expected ${exp})` : ''}`)
  }

  // Asset count
  const assetCount = await client.fetch<number>(`count(*[_type == "sanity.imageAsset"])`)
  log(`  · sanity.imageAsset: ${assetCount} (uploaded assets)`)

  log('')
  if (allPass) {
    log('  All counts match expected values.')
  } else {
    log('  Some counts differ from expected — check above for details.')
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  log('╔══════════════════════════════════════════════════════════════════╗')
  log('║  Kokikillara Portfolio — Seed Script                             ║')
  log(`║  project: ${projectId} · dataset: ${dataset.padEnd(24)} ║`)
  log(`║  --force: ${FORCE} · --clean: ${CLEAN}${' '.repeat(32)} ║`)
  log('╚══════════════════════════════════════════════════════════════════╝')

  if (!token) {
    log('\n  ✗ No SANITY_AUTH_TOKEN found. Run with: npx sanity exec scripts/seed.ts --with-user-token')
    process.exit(1)
  }

  // 1. --clean: delete demo docs
  if (CLEAN) {
    await cleanDemoDocs()
  }

  // 2. Upload assets
  await uploadAssets()

  // Get portrait asset ID
  const portraitId = assetMap.get('portrait.jpg')

  // 3. Seed in dependency order:

  // a. tags (no deps)
  const tagIdMap = await seedTags()

  // b. categories (no deps)
  const catIdMap = await seedCategories()

  // c. projects (refs tags)
  const projIdMap = await seedProjects(tagIdMap)

  // d. posts (refs category + tags)
  await seedPosts(tagIdMap, catIdMap)

  // e. qaEntries (no refs)
  await seedQaEntries()

  // f. siteSettings (refs portrait asset)
  await seedSiteSettings(portraitId)

  // g. navigation
  await seedNavigation()

  // h. homePage (refs featuredProjects)
  await seedHomePage(projIdMap)

  // i. aboutPage, portfolioPage, blogPage, contactPage
  await seedAboutPage()
  await seedPortfolioPage()
  await seedBlogPage()
  await seedContactPage()

  // 4. Count report
  await reportCounts()

  log('\n── Done ─────────────────────────────────────────────────────────')
  log('  Re-run at any time — idempotent (existing docs are patched, not duplicated).')
  log('  To force-overwrite everything: npm run seed -- --force')
  log('  To remove demo docs first:     npm run seed -- --clean')
}

main().catch((err) => {
  process.stderr.write(`\nSeed failed: ${err instanceof Error ? err.message : String(err)}\n`)
  if (err instanceof Error && err.stack) {
    process.stderr.write(err.stack + '\n')
  }
  process.exit(1)
})
