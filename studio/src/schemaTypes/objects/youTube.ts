import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * YouTube embed block for Portable Text (`blockContent`).
 *
 * Stores only the video URL — the frontend parses the video ID and renders a
 * privacy-friendly iframe, keeping the content free of presentation assumptions.
 */
export const youTube = defineType({
  name: 'youTube',
  title: 'YouTube Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube video URL',
      type: 'url',
      description: 'Paste a full URL, e.g. https://www.youtube.com/watch?v=… or https://youtu.be/…',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {url: 'url'},
    prepare({url}) {
      return {title: 'YouTube Embed', subtitle: url || 'No URL set', media: PlayIcon}
    },
  },
})
