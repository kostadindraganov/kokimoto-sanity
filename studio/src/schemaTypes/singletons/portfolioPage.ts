import {CaseIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Portfolio page singleton (`_id: portfolioPage`). Bento grid copy plus
 * all labels for the project detail view. Tokens in {curly braces} are
 * interpolated by the frontend.
 */
export const portfolioPage = defineType({
  name: 'portfolioPage',
  title: 'Portfolio Page',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'filterLabel',
      title: 'Filter Label',
      type: 'string',
      description: 'E.g. "filter:".',
    }),
    defineField({
      name: 'matchesText',
      title: 'Matches Text',
      type: 'string',
      description: 'E.g. "{n} matches · cycle {m}/{max}".',
    }),
    defineField({
      name: 'loadingText',
      title: 'Loading Text',
      type: 'string',
      description: 'E.g. "streaming next cycle…".',
    }),
    defineField({
      name: 'endText',
      title: 'End Text',
      type: 'string',
      description: 'E.g. "end of feed · {n} cards rendered".',
    }),
    defineField({
      name: 'detailLabels',
      title: 'Detail Labels',
      type: 'object',
      description: 'Labels for the /portfolio/[slug] project detail view.',
      fields: [
        defineField({
          name: 'deployLogTitle',
          title: 'Deploy Log Title',
          type: 'string',
        }),
        defineField({
          name: 'deployLogLines',
          title: 'Deploy Log Lines',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description: 'Log lines with {slug}, {repo} and {status} tokens.',
        }),
        defineField({
          name: 'briefHeading',
          title: 'Brief Heading',
          type: 'string',
          description: 'E.g. "brief".',
        }),
        defineField({
          name: 'descriptionLabel',
          title: 'Description Label',
          type: 'string',
          description: 'E.g. "# description".',
        }),
        defineField({
          name: 'stackLabel',
          title: 'Stack Label',
          type: 'string',
          description: 'E.g. "$ stack".',
        }),
        defineField({
          name: 'roleLabel',
          title: 'Role Label',
          type: 'string',
          description: 'E.g. "@ role".',
        }),
        defineField({
          name: 'interfaceHeading',
          title: 'Interface Heading',
          type: 'string',
          description: 'E.g. "interface".',
        }),
        defineField({
          name: 'cloneLabel',
          title: 'Clone Label',
          type: 'string',
          description: 'E.g. "git clone".',
        }),
        defineField({
          name: 'openLiveLabel',
          title: 'Open Live Label',
          type: 'string',
          description: 'E.g. "open live".',
        }),
        defineField({
          name: 'backLabel',
          title: 'Back Label',
          type: 'string',
          description: 'E.g. "back to portfolio".',
        }),
        defineField({
          name: 'prevLabel',
          title: 'Previous Label',
          type: 'string',
        }),
        defineField({
          name: 'nextLabel',
          title: 'Next Label',
          type: 'string',
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
      return {title: 'Portfolio Page'}
    },
  },
})
