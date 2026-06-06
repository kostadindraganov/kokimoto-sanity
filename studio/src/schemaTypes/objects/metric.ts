import {BarChartIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * "At a glance" metric tile: big Space-Grotesk number + unit + label.
 */
export const metric = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'The big number, e.g. "9".',
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
      description: 'Suffix rendered after the value, e.g. "+", "yrs", "%".',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Caption under the number, e.g. "years shipping software".',
    }),
  ],
  preview: {
    select: {value: 'value', unit: 'unit', label: 'label'},
    prepare({value, unit, label}) {
      return {
        title: [value, unit].filter(Boolean).join(''),
        subtitle: label,
      }
    },
  },
})
