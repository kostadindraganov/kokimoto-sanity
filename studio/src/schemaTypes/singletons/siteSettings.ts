import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/

/**
 * Site Settings singleton (`_id: siteSettings`). Global identity, links,
 * theme, Ask Console copy, statusbar labels, UI chrome strings and SEO
 * defaults for the whole site.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'links', title: 'Links'},
    {name: 'theme', title: 'Theme'},
    {name: 'askConsole', title: 'Ask Console'},
    {name: 'statusbar', title: 'Statusbar'},
    {name: 'uiText', title: 'UI Text'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ── identity ────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'identity',
      description: 'Hero name and article author, e.g. "Kostadin Draganov".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'handle',
      title: 'Handle',
      type: 'string',
      group: 'identity',
      description: 'Topbar brand mark, e.g. "kostadin@portfolio".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'identity',
      description: 'E.g. "Senior Software Developer · AI-Native Engineer".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      group: 'identity',
      description: 'Home hero bio.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'identity',
      validation: (rule) =>
        rule
          .required()
          .regex(EMAIL_REGEX, {name: 'email', invert: false})
          .error('Must be a valid email address'),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'identity',
      description: 'E.g. "Sofia, BG · remote".',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      group: 'identity',
      description: 'E.g. "available for selected collaborations".',
    }),
    defineField({
      name: 'availabilityStatus',
      title: 'Availability Status',
      type: 'boolean',
      group: 'identity',
      description: 'Shows the green "online" dot in the topbar and on the contact page.',
      initialValue: true,
    }),
    defineField({
      name: 'cv',
      title: 'CV',
      type: 'file',
      group: 'identity',
      description: 'Downloadable resume.',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      group: 'identity',
      description: 'ASCII-reveal portrait used on home and about.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              if (parent?.asset?._ref && !alt) {
                return 'Alternative text is required when an image is set'
              }
              return true
            }),
        }),
      ],
    }),
    // ── links ───────────────────────────────────────────────────────────
    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
      group: 'links',
      description: 'Displayed without protocol.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'links',
      description: 'Displayed without protocol.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    // ── theme ───────────────────────────────────────────────────────────
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'object',
      group: 'theme',
      fields: [
        defineField({
          name: 'accentColor',
          title: 'Accent Color',
          type: 'color',
          description: 'Sets --accent. Pick one of the preset swatches to stay in the warm family.',
          options: {
            disableAlpha: true,
            colorList: ['#db8c4e', '#e7c277', '#8fb573', '#7f9ec2'],
          },
        }),
        defineField({
          name: 'grain',
          title: 'Film Grain + Vignette',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'heroLayout',
          title: 'Hero Layout',
          type: 'string',
          options: {
            list: [
              {title: 'Boot', value: 'boot'},
              {title: 'Split', value: 'split'},
            ],
            layout: 'radio',
          },
          initialValue: 'boot',
        }),
      ],
    }),
    // ── askConsole ──────────────────────────────────────────────────────
    defineField({
      name: 'askConsole',
      title: 'Ask Console',
      type: 'object',
      group: 'askConsole',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description: 'Section index label, e.g. "ask the console".',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          description: 'E.g. "A live session — type below…".',
        }),
        defineField({
          name: 'placeholder',
          title: 'Placeholder',
          type: 'string',
          description: 'Animated scramble placeholder, e.g. "Ask me something".',
        }),
        defineField({
          name: 'emptyMessage',
          title: 'Empty Message',
          type: 'string',
          description: 'E.g. "session listening — the prompt is at the bottom".',
        }),
        defineField({
          name: 'suggestions',
          title: 'Suggestions',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description: 'Suggestion chips (max 6).',
          validation: (rule) => rule.max(6),
        }),
        defineField({
          name: 'fallback',
          title: 'Fallback',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description: 'Answer lines streamed when no Q&A entry matches.',
        }),
      ],
    }),
    // ── statusbar ───────────────────────────────────────────────────────
    defineField({
      name: 'statusbar',
      title: 'Statusbar',
      type: 'object',
      group: 'statusbar',
      fields: [
        defineField({
          name: 'branchLabel',
          title: 'Branch Label',
          type: 'string',
          initialValue: 'main',
        }),
        defineField({
          name: 'statusText',
          title: 'Status Text',
          type: 'string',
          initialValue: 'ready',
        }),
      ],
    }),
    // ── uiText ──────────────────────────────────────────────────────────
    defineField({
      name: 'uiText',
      title: 'UI Text',
      type: 'object',
      group: 'uiText',
      description: 'Global chrome strings. Page-specific labels live on the page singletons.',
      fields: [
        defineField({
          name: 'notFoundTitle',
          title: 'Not Found Title',
          type: 'string',
          description: '404 page title, e.g. "✗ route not found · exit 127".',
        }),
        defineField({
          name: 'notFoundBody',
          title: 'Not Found Body',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'commandPalettePlaceholder',
          title: 'Command Palette Placeholder',
          type: 'string',
          description: 'E.g. "type a command…".',
        }),
        defineField({
          name: 'mobileConsolePrompt',
          title: 'Mobile Console Prompt',
          type: 'string',
          description: 'E.g. "nav".',
        }),
        defineField({
          name: 'newSessionLabel',
          title: 'New Session Label',
          type: 'string',
        }),
        defineField({
          name: 'copyEmailLabel',
          title: 'Copy Email Label',
          type: 'string',
        }),
      ],
    }),
    // ── seo ─────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      description: 'Site-wide SEO defaults.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
