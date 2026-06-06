import {HelpCircleIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Ask Console knowledge entry. Visitor questions are keyword-matched
 * against `keywords`; the `answer` lines stream in as the response.
 */
export const qaEntry = defineType({
  name: 'qaEntry',
  title: 'Q&A Entry',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label, e.g. "experience". Not shown to visitors.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Words/phrases that match this entry to a visitor question.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [defineArrayMember({type: 'text', rows: 2})],
      description: 'Each item is one streamed response line.',
    }),
    defineField({
      name: 'action',
      title: 'Action',
      type: 'qaAction',
      description: 'Optional follow-up command appended to the answer.',
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title', keywords: 'keywords', enabled: 'enabled'},
    prepare({title, keywords, enabled}) {
      return {
        title: enabled === false ? `${title} (disabled)` : title,
        subtitle: Array.isArray(keywords) ? keywords.join(', ') : undefined,
      }
    },
  },
})
