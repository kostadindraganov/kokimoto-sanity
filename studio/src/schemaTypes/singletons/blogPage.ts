import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Blog page singleton (`_id: blogPage`). Blog index copy plus all labels
 * for the article view. Tokens in {curly braces} are interpolated by the
 * frontend; the article TOC derives from post body h2/h3 headings.
 */
export const blogPage = defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  icon: BookIcon,
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
      name: 'featuredPanelTitle',
      title: 'Featured Panel Title',
      type: 'string',
      description: 'E.g. "~/blog".',
    }),
    defineField({
      name: 'featuredBadge',
      title: 'Featured Badge',
      type: 'string',
      description: 'E.g. "pinned".',
    }),
    defineField({
      name: 'readButtonLabel',
      title: 'Read Button Label',
      type: 'string',
      description: 'E.g. "read article".',
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Search Placeholder',
      type: 'string',
      description: 'E.g. "/search field notes…".',
    }),
    defineField({
      name: 'noMatchesText',
      title: 'No Matches Text',
      type: 'string',
    }),
    defineField({
      name: 'loadingText',
      title: 'Loading Text',
      type: 'string',
      description: 'E.g. "loading next {n} entries…".',
    }),
    defineField({
      name: 'endText',
      title: 'End Text',
      type: 'string',
      description: 'E.g. "end of feed · {n} entries".',
    }),
    defineField({
      name: 'archiveLabel',
      title: 'Archive Label',
      type: 'string',
      description: 'E.g. "// archive".',
    }),
    defineField({
      name: 'archiveNote',
      title: 'Archive Note',
      type: 'string',
      description: 'E.g. "{n} unique entries · {year} · rss available".',
    }),
    defineField({
      name: 'articleLabels',
      title: 'Article Labels',
      type: 'object',
      description: 'Labels for the /blog/[slug] article view.',
      fields: [
        defineField({
          name: 'tocHeading',
          title: 'TOC Heading',
          type: 'string',
          description: 'E.g. "on this page".',
        }),
        defineField({
          name: 'searchHeading',
          title: 'Search Heading',
          type: 'string',
        }),
        defineField({
          name: 'categoriesHeading',
          title: 'Categories Heading',
          type: 'string',
        }),
        defineField({
          name: 'tagsHeading',
          title: 'Tags Heading',
          type: 'string',
        }),
        defineField({
          name: 'recentHeading',
          title: 'Recent Heading',
          type: 'string',
          description: 'E.g. "recent posts".',
        }),
        defineField({
          name: 'archivesHeading',
          title: 'Archives Heading',
          type: 'string',
        }),
        defineField({
          name: 'readingTimeHeading',
          title: 'Reading Time Heading',
          type: 'string',
          description: 'E.g. "reading time".',
        }),
        defineField({
          name: 'categoryHeading',
          title: 'Category Heading',
          type: 'string',
          description: 'E.g. "category".',
        }),
        defineField({
          name: 'moreNotesHeading',
          title: 'More Notes Heading',
          type: 'string',
          description: 'E.g. "more notes".',
        }),
        defineField({
          name: 'backLabel',
          title: 'Back Label',
          type: 'string',
          description: 'E.g. "back to blog".',
        }),
        defineField({
          name: 'figCaptionPrefix',
          title: 'Figure Caption Prefix',
          type: 'string',
          description: 'E.g. "fig.".',
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
      return {title: 'Blog Page'}
    },
  },
})
