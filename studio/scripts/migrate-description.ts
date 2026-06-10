/**
 * migrate-description.ts — backfill the new `description` rich-text field.
 *
 * The `01 brief` panel now renders a single `description` (Portable Text)
 * field instead of the old `problem` + `solution` text fields. Existing
 * projects predate that field, so their briefs render empty. This script
 * builds `description` from each project's existing `problem` + `solution`
 * paragraphs and sets `detailLabels.descriptionLabel` on the portfolio page.
 *
 * Non-destructive: it only SETS the new fields. The old `problem`/`solution`
 * values are left in place (invisible in Studio now that the schema dropped
 * them). Re-running is safe — projects that already have `description` are
 * skipped. Pass --overwrite to rebuild description even when present.
 *
 * Run with:   cd studio && npx sanity exec scripts/migrate-description.ts --with-user-token
 */

import {createClient} from '@sanity/client'

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

const overwrite = process.argv.includes('--overwrite')

/** Wrap plain paragraphs into a minimal Portable Text block array (stable keys). */
function textToBlocks(id: string, paragraphs: string[]) {
  return paragraphs
    .map((t) => (t ?? '').trim())
    .filter(Boolean)
    .map((text, i) => ({
      _type: 'block',
      _key: `${id}-desc-${i}`,
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: `${id}-desc-${i}-0`, text, marks: []}],
    }))
}

async function main() {
  // Published projects only (the frontend reads the published perspective).
  const projects: Array<{_id: string; title?: string; problem?: string; solution?: string; description?: unknown}> =
    await client.fetch(
      `*[_type == "project" && !(_id in path("drafts.**"))]{_id, title, problem, solution, description}`,
    )

  let migrated = 0
  let skipped = 0

  for (const p of projects) {
    if (p.description && !overwrite) {
      skipped++
      console.log(`  · skip   ${p.title ?? p._id} (already has description)`)
      continue
    }
    const blocks = textToBlocks(p._id, [p.problem ?? '', p.solution ?? ''])
    if (!blocks.length) {
      skipped++
      console.log(`  · skip   ${p.title ?? p._id} (no problem/solution text)`)
      continue
    }
    await client.patch(p._id).set({description: blocks}).commit()
    migrated++
    console.log(`  ✓ set    ${p.title ?? p._id} description (${blocks.length} paragraph(s))`)
  }

  // Portfolio page label (left column of the brief row).
  const pageId: string | null = await client.fetch(`*[_type == "portfolioPage"][0]._id`)
  if (pageId) {
    await client.patch(pageId).set({'detailLabels.descriptionLabel': '# description'}).commit()
    console.log(`  ✓ set    portfolioPage.detailLabels.descriptionLabel = "# description"`)
  } else {
    console.log('  ! no portfolioPage document found — descriptionLabel not set')
  }

  console.log(`\nDone. ${migrated} migrated, ${skipped} skipped.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
