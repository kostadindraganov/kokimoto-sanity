import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Per-document SEO overrides. Falls back to `siteSettings.seo` on the frontend.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Overrides the document title in search results and browser tabs.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning('Keep meta descriptions under 160 characters for best results'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              if (parent?.asset?._ref && !alt) {
                return 'Alternative text is required when an image is set'
              }
              return true
            }),
        }),
        defineField({
          name: 'metadataBase',
          title: 'Metadata Base URL',
          type: 'url',
          description:
            'Base URL used to resolve the Open Graph image URL in metadata (see Next.js metadataBase).',
        }),
      ],
    }),
  ],
})
