import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Home page singleton (`_id: homePage`). Hero boot sequence, featured
 * work, metrics grid and next-step CTAs.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heroWord',
      title: 'Hero Word',
      type: 'string',
      description: 'Rendered by the interactive ASCII hero canvas.',
      initialValue: 'KOKIMOTO',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'promptCommand',
      title: 'Prompt Command',
      type: 'string',
      description: 'The hero prompt command.',
      initialValue: 'whoami',
    }),
    defineField({
      name: 'toolActions',
      title: 'Tool Actions',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'The 4 tool-use lines streamed during the hero boot sequence.',
    }),
    defineField({
      name: 'successLines',
      title: 'Success Lines',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'The 4 success/output lines after the tool block completes.',
    }),
    defineField({
      name: 'portraitCaption',
      title: 'Portrait Caption',
      type: 'string',
      description: 'E.g. "▍ k. draganov // IRL.png".',
    }),
    defineField({
      name: 'featuredHeading',
      title: 'Featured Heading',
      type: 'string',
      description: 'E.g. "selected work".',
    }),
    defineField({
      name: 'metricsHeading',
      title: 'Metrics Heading',
      type: 'string',
      description: 'E.g. "at a glance".',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [defineArrayMember({type: 'metric'})],
      validation: (rule) =>
        rule.length(4).warning('The home page metrics grid is designed for exactly 4 items'),
    }),
    defineField({
      name: 'nextStepsHeading',
      title: 'Next Steps Heading',
      type: 'string',
    }),
    defineField({
      name: 'nextSteps',
      title: 'Next Steps',
      type: 'array',
      of: [defineArrayMember({type: 'ctaCommand'})],
    }),
    defineField({
      name: 'systemCard',
      title: 'System Card',
      type: 'object',
      description:
        'Shown in the "split" hero layout. The name abbreviation derives from Site Settings → name.',
      fields: [
        defineField({
          name: 'roleLine',
          title: 'Role Line',
          type: 'string',
          description: 'E.g. "Senior · AI-Native Engineer".',
        }),
        defineField({
          name: 'kvRows',
          title: 'Key/Value Rows',
          type: 'array',
          of: [defineArrayMember({type: 'valueItem'})],
          description: 'E.g. exp / stack / tz / status rows.',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
