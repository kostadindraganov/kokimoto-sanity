import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Dotted-leader key/value row (about-page values, home system card rows).
 */
export const valueItem = defineType({
  name: 'valueItem',
  title: 'Key/Value Item',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
    }),
  ],
  preview: {
    select: {key: 'key', value: 'value'},
    prepare({key, value}) {
      return {title: key, subtitle: value}
    },
  },
})
