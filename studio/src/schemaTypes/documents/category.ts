import {FolderIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {uniqueSlug} from '../lib/uniqueSlug'

/**
 * Blog post category (one per post).
 */
export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: FolderIcon,
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
      validation: (rule) => rule.required().custom(uniqueSlug('category')),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
