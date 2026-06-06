import {ClockIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * One node on the about-page experience trace (vertical timeline).
 */
export const timelineEntry = defineType({
  name: 'timelineEntry',
  title: 'Timeline Entry',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'years',
      title: 'Years',
      type: 'string',
      description: 'Period label, e.g. "2021 — now".',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'current',
      title: 'Current',
      type: 'boolean',
      description: 'Marks this entry as the current position (lit node on the trace).',
      initialValue: false,
    }),
  ],
  preview: {
    select: {role: 'role', years: 'years', company: 'company'},
    prepare({role, years, company}) {
      return {
        title: role,
        subtitle: [years, company].filter(Boolean).join(' · '),
      }
    },
  },
})
