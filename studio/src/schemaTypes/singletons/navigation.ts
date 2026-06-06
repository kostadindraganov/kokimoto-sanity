import {MenuIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Navigation singleton (`_id: navigation`). Drives the topbar, mobile
 * console drawer and the command palette "navigate" group. The Ask
 * Console's built-in `ls` output also derives from these items.
 */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'item',
          title: 'Navigation Item',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'command',
              title: 'Command',
              type: 'string',
              description: 'Command-style label, e.g. "/portfolio".',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'route',
              title: 'Route',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              description:
                'Internal route as path segments, e.g. ["home"] or ["portfolio"]. Valid page names: home, portfolio, blog, about, contact.',
            }),
          ],
          preview: {
            select: {label: 'label', command: 'command'},
            prepare({label, command}) {
              return {title: label, subtitle: command}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navigation'}
    },
  },
})
