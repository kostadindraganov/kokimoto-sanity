import type {Slug, ValidationContext} from 'sanity'

const API_VERSION = '2026-02-01'

/**
 * Async slug uniqueness validation. Checks the dataset for any other document
 * of the same type already using the slug (ignoring this document's own draft
 * and published variants).
 */
export function uniqueSlug(documentType: string) {
  return async (slug: Slug | undefined, context: ValidationContext): Promise<true | string> => {
    if (!slug?.current) return true

    const client = context.getClient({apiVersion: API_VERSION})
    const id = context.document?._id.replace(/^drafts\./, '') ?? ''

    const count = await client.fetch<number>(
      `count(*[_type == $type && slug.current == $slug && !(_id in [$draft, $published])])`,
      {type: documentType, slug: slug.current, draft: `drafts.${id}`, published: id},
    )

    return count === 0 || `Slug "${slug.current}" is already used by another ${documentType}`
  }
}
