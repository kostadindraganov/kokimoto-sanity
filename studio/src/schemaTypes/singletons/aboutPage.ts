import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * About page singleton (`_id: aboutPage`). Streaming bio, experience
 * trace (timeline), values, stack listing and CTAs.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'E.g. "/about".',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'E.g. "Session history".',
    }),
    defineField({
      name: 'portraitCaption',
      title: 'Portrait Caption',
      type: 'string',
      description: 'E.g. "● online".',
    }),
    defineField({
      name: 'bioParagraphs',
      title: 'Bio Paragraphs',
      type: 'array',
      of: [defineArrayMember({type: 'text', rows: 3})],
      description: 'The 3 streaming bio paragraphs.',
    }),
    defineField({
      name: 'experiencePrompt',
      title: 'Experience Prompt',
      type: 'string',
      description: 'E.g. `grep "experience" profile.md`.',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      of: [defineArrayMember({type: 'timelineEntry'})],
    }),
    defineField({
      name: 'valuesPrompt',
      title: 'Values Prompt',
      type: 'string',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [defineArrayMember({type: 'valueItem'})],
    }),
    defineField({
      name: 'stackPrompt',
      title: 'Stack Prompt',
      type: 'string',
    }),
    defineField({
      name: 'stackRows',
      title: 'Stack Rows',
      type: 'array',
      of: [defineArrayMember({type: 'stackRow'})],
    }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [defineArrayMember({type: 'ctaCommand'})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
