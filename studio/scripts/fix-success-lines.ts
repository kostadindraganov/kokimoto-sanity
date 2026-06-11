/**
 * fix-success-lines.ts — migrate successLines from [{_key,value}] → [string].
 *
 * The schema (homePage.ts / contactPage.ts) declares successLines as an array
 * of `string`, but documents seeded with an earlier schema hold objects like
 * { _key: 'sline-0', value: '…' }. Studio can't edit those (no object member
 * type in the array). This patches the live docs back to plain strings.
 *
 * Run with:  npx sanity exec scripts/fix-success-lines.ts --with-user-token
 */

import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'n7jnm2k9'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_AUTH_TOKEN // injected by --with-user-token

const client = createClient({projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false})

const DOC_IDS = ['homePage', 'contactPage']

function toStrings(lines: unknown): string[] | null {
  if (!Array.isArray(lines)) return null
  // Already strings? nothing to do.
  if (lines.every((l) => typeof l === 'string')) return null
  return lines.map((l) =>
    typeof l === 'string' ? l : typeof (l as any)?.value === 'string' ? (l as any).value : String(l),
  )
}

async function run() {
  for (const id of DOC_IDS) {
    // Patch both the published doc and its draft, if present.
    for (const docId of [id, `drafts.${id}`]) {
      const doc = await client.getDocument(docId)
      if (!doc) continue
      const fixed = toStrings((doc as any).successLines)
      if (!fixed) {
        process.stdout.write(`  · ${docId}: successLines already strings (or absent) — skipped\n`)
        continue
      }
      await client.patch(docId).set({successLines: fixed}).commit()
      process.stdout.write(`  ✓ ${docId}: migrated ${fixed.length} line(s) → string[]\n`)
    }
  }
  process.stdout.write('Done.\n')
}

run().catch((err) => {
  process.stderr.write(String(err?.stack || err) + '\n')
  process.exit(1)
})
