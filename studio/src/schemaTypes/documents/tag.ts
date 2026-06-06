import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {uniqueSlug} from '../lib/uniqueSlug'

/**
 * Tag shared by projects (portfolio --flag filters) and posts.
 */
export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagIcon,
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
      validation: (rule) => rule.required().custom(uniqueSlug('tag')),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})
