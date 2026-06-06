import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {uniqueSlug} from '../lib/uniqueSlug'

/**
 * Blog post ("field note"). The article TOC derives from the body's
 * h2/h3 headings; reading time is auto-computed from the body when
 * `readTime` is left empty.
 */
export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().custom(uniqueSlug('post')),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'tag'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Optional — auto-computed from the body word count (~185 wpm) when empty.',
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Pins this post to the featured panel on the blog index.',
      initialValue: false,
      validation: (rule) =>
        rule
          .custom(async (featured, context) => {
            if (!featured) return true

            const client = context.getClient({apiVersion: '2026-02-01'})
            const id = context.document?._id.replace(/^drafts\./, '') ?? ''

            const others = await client.fetch<number>(
              `count(*[_type == "post" && featured == true && !(_id in [$draft, $published])])`,
              {draft: `drafts.${id}`, published: id},
            )

            return others === 0
              ? true
              : 'Another post is already featured — only one post is pinned on the blog index'
          })
          .warning(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageInstructionField: 'imagePrompt',
        },
      },
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
          name: 'imagePrompt',
          title: 'AI Image Prompt',
          type: 'text',
          rows: 2,
          description: 'Instruction used by AI Assist to generate this image.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'date', category: 'category.title', media: 'coverImage'},
    prepare({title, date, category, media}) {
      return {
        title,
        subtitle: [category, date && format(parseISO(date), 'LLL d, yyyy')]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
