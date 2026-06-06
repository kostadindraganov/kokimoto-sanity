import {RocketIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {uniqueSlug} from '../lib/uniqueSlug'

/**
 * Portfolio project, framed as a deployment/commit on the frontend.
 * Bento grid sizing stays algorithmic (by index) — no per-document size field.
 */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: RocketIcon,
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
      validation: (rule) => rule.required().custom(uniqueSlug('project')),
    }),
    defineField({
      name: 'commit',
      title: 'Commit',
      type: 'string',
      description: 'Commit-style headline, e.g. "feat: real-time double-entry engine".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Live', value: 'live'},
          {title: 'Shipped', value: 'shipped'},
          {title: 'Active', value: 'active'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'shipped',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'tag'}]})],
      description: 'Drives the portfolio --flag filters.',
      validation: (rule) => rule.required().min(1).max(3).unique(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Your role on the project, e.g. "lead engineer".',
    }),
    defineField({
      name: 'problem',
      title: 'Problem',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Rendered as chips.',
    }),
    defineField({
      name: 'impact',
      title: 'Impact',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Up to 3 impact statements (3-column metric grid).',
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Bento card artwork.',
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
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: '"Interface" section screenshots (2 shown on the detail page).',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
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
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'repo',
      title: 'Repository URL',
      type: 'url',
      description: 'Optional — shows the "git clone" button when set.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'live',
      title: 'Live URL',
      type: 'url',
      description: 'Optional — shows the "open live" button when set.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Manual sort position. The grid sorts by order ascending, then newest first.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: '_createdAt', direction: 'desc'},
      ],
    },
  ],
  preview: {
    select: {title: 'title', commit: 'commit', status: 'status', media: 'coverImage'},
    prepare({title, commit, status, media}) {
      return {
        title,
        subtitle: [status, commit].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
