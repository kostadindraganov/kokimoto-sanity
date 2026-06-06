import {StackIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * One row of the about-page stack listing: a term plus its items,
 * e.g. "frontend" → React, Next.js, Tailwind.
 */
export const stackRow = defineType({
  name: 'stackRow',
  title: 'Stack Row',
  type: 'object',
  icon: StackIcon,
  fields: [
    defineField({
      name: 'term',
      title: 'Term',
      type: 'string',
      description: 'Row label, e.g. "frontend".',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: {
    select: {term: 'term', items: 'items'},
    prepare({term, items}) {
      return {
        title: term,
        subtitle: Array.isArray(items) ? items.join(', ') : undefined,
      }
    },
  },
})
