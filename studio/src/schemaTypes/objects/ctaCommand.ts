import {TerminalIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A terminal-styled call-to-action rendered as a command line,
 * e.g. `open ./portfolio --all` with an optional sub-caption.
 */
export const ctaCommand = defineType({
  name: 'ctaCommand',
  title: 'CTA Command',
  type: 'object',
  icon: TerminalIcon,
  fields: [
    defineField({
      name: 'cmd',
      title: 'Command',
      type: 'string',
      description: 'The command verb, e.g. "open", "connect".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'flag',
      title: 'Flag',
      type: 'string',
      description: 'Amber flag/argument rendered after the command, e.g. "--all".',
    }),
    defineField({
      name: 'sub',
      title: 'Sub-caption',
      type: 'string',
      description: 'Muted line rendered under the command.',
    }),
    defineField({
      name: 'primary',
      title: 'Primary',
      type: 'boolean',
      description: 'Renders as the primary (accent) button.',
      initialValue: false,
    }),
    defineField({
      name: 'route',
      title: 'Route',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description:
        'Target as path segments for internal pages — e.g. ["portfolio"] or ["portfolio", "promptforge"] — or a single external URL, e.g. ["https://github.com/…"].',
    }),
    defineField({
      name: 'file',
      title: 'Download file (e.g. CV / résumé PDF)',
      type: 'file',
      description:
        'Optional. Upload a file (such as your CV as a PDF). When set, this button downloads the file and the Route/Sub-caption link is ignored.',
      options: {
        accept: 'application/pdf',
      },
    }),
  ],
  preview: {
    select: {cmd: 'cmd', flag: 'flag', sub: 'sub', file: 'file.asset'},
    prepare({cmd, flag, sub, file}) {
      return {
        title: [cmd, flag].filter(Boolean).join(' '),
        subtitle: [sub, file ? '↓ file attached' : null].filter(Boolean).join(' · '),
      }
    },
  },
})
