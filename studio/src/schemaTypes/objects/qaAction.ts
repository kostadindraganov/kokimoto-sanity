import {BoltIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Optional follow-up action appended to an Ask Console answer,
 * e.g. `open ./portfolio/promptforge`.
 */
export const qaAction = defineType({
  name: 'qaAction',
  title: 'Q&A Action',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'cmd',
      title: 'Command',
      type: 'string',
      description: 'The command verb, e.g. "open", "read", "connect".',
    }),
    defineField({
      name: 'flag',
      title: 'Flag',
      type: 'string',
      description: 'Argument rendered after the command, e.g. "./about".',
    }),
    defineField({
      name: 'route',
      title: 'Route',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Target route as path segments, e.g. ["about"] or ["portfolio", "promptforge"].',
    }),
  ],
  preview: {
    select: {cmd: 'cmd', flag: 'flag'},
    prepare({cmd, flag}) {
      return {title: [cmd, flag].filter(Boolean).join(' ') || 'Q&A Action'}
    },
  },
})
