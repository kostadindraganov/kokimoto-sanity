import type {StructureBuilder, StructureResolver} from 'sanity/structure'

// Singleton document type names and their document IDs
const SINGLETONS: {schemaType: string; documentId: string; title: string; icon: string}[] = [
  {schemaType: 'siteSettings', documentId: 'siteSettings', title: 'Site Settings', icon: '⚙'},
  {schemaType: 'navigation', documentId: 'navigation', title: 'Navigation', icon: '🧭'},
  {schemaType: 'homePage', documentId: 'homePage', title: 'Home', icon: '🏠'},
  {schemaType: 'aboutPage', documentId: 'aboutPage', title: 'About', icon: '👤'},
  {schemaType: 'portfolioPage', documentId: 'portfolioPage', title: 'Portfolio', icon: '💼'},
  {schemaType: 'blogPage', documentId: 'blogPage', title: 'Blog', icon: '✍️'},
  {schemaType: 'contactPage', documentId: 'contactPage', title: 'Contact', icon: '📬'},
]

// All singleton schema types — hidden from "Create new document" menu
const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.schemaType))

// Schema types that should never appear in the "Create new" menu
const HIDDEN_TYPES = new Set([...SINGLETON_TYPES, 'contactSubmission', 'assist.instruction.context'])

/**
 * Helper: build a singleton list item that opens the one document directly.
 * No create/delete actions.
 */
function singletonItem(
  S: StructureBuilder,
  schemaType: string,
  documentId: string,
  title: string,
  icon: string,
) {
  return S.listItem()
    .title(`${icon} ${title}`)
    .id(documentId)
    .child(
      S.document()
        .schemaType(schemaType)
        .documentId(documentId)
        .title(title)
        .views([S.view.form()]),
    )
}

/**
 * Default workspace structure (dataset: production).
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ⚙ Site Settings
      singletonItem(S, 'siteSettings', 'siteSettings', 'Site Settings', '⚙'),

      // 🧭 Navigation
      singletonItem(S, 'navigation', 'navigation', 'Navigation', '🧭'),

      S.divider(),

      // 📄 Pages
      S.listItem()
        .title('📄 Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              singletonItem(S, 'homePage', 'homePage', 'Home', '🏠'),
              singletonItem(S, 'aboutPage', 'aboutPage', 'About', '👤'),
              singletonItem(S, 'portfolioPage', 'portfolioPage', 'Portfolio', '💼'),
              singletonItem(S, 'blogPage', 'blogPage', 'Blog', '✍️'),
              singletonItem(S, 'contactPage', 'contactPage', 'Contact', '📬'),
            ]),
        ),

      S.divider(),

      // 🗂 Portfolio
      S.listItem()
        .title('🗂 Portfolio')
        .child(
          S.list()
            .title('Portfolio')
            .items([
              S.listItem()
                .title('Projects')
                .schemaType('project')
                .child(
                  S.documentTypeList('project')
                    .title('Projects')
                    .defaultOrdering([
                      {field: 'order', direction: 'asc'},
                      {field: '_createdAt', direction: 'desc'},
                    ]),
                ),
              S.listItem()
                .title('Tags')
                .schemaType('tag')
                .child(S.documentTypeList('tag').title('Tags')),
            ]),
        ),

      S.divider(),

      // ✍ Blog
      S.listItem()
        .title('✍ Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Posts')
                .schemaType('post')
                .child(S.documentTypeList('post').title('Posts')),
              S.listItem()
                .title('Categories')
                .schemaType('category')
                .child(S.documentTypeList('category').title('Categories')),
              S.listItem()
                .title('Tags')
                .schemaType('tag')
                .child(S.documentTypeList('tag').title('Tags')),
            ]),
        ),

      S.divider(),

      // 🤖 Ask Console
      S.listItem()
        .title('🤖 Ask Console')
        .child(
          S.list()
            .title('Ask Console')
            .items([
              S.listItem()
                .title('Q&A Entries')
                .schemaType('qaEntry')
                .child(S.documentTypeList('qaEntry').title('Q&A Entries')),
            ]),
        ),
    ])

/**
 * Inbox workspace structure (dataset: inbox, private).
 * Read-only list of contact submissions — no create actions.
 */
export const inboxStructure: StructureResolver = (S) =>
  S.list()
    .title('Inbox')
    .items([
      S.listItem()
        .title('📥 Contact Submissions')
        .schemaType('contactSubmission')
        .child(
          S.documentTypeList('contactSubmission')
            .title('Contact Submissions')
            .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
            // Show unread badge in title
            .filter('_type == "contactSubmission"')
            .params({}),
        ),
    ])

/**
 * Filter function for schema.templates — hides singleton and system types from
 * the "Create new document" menu. Templates use `schemaType` (not `name`).
 */
export function filterHiddenTemplates(template: {schemaType: string}): boolean {
  return !HIDDEN_TYPES.has(template.schemaType)
}

export {SINGLETON_TYPES, HIDDEN_TYPES}
