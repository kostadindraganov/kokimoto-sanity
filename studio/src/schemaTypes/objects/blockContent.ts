import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Portable Text used for article bodies.
 *
 * Supports: normal/h2/h3/blockquote blocks, strong/em/code marks, link
 * annotations (external href or internal route), syntax-highlighted code
 * blocks (@sanity/code-input) and captioned images ("fig.N" frames).
 *
 * The article TOC derives from the h2/h3 headings in this field.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                initialValue: 'external',
                options: {
                  list: [
                    {title: 'External URL', value: 'external'},
                    {title: 'Internal Route', value: 'internal'},
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'string',
                description: 'External URL, e.g. "https://example.com".',
                hidden: ({parent}) => parent?.linkType === 'internal',
                validation: (rule) =>
                  rule.custom((value, context) => {
                    const parent = context.parent as {linkType?: string} | undefined
                    if ((parent?.linkType ?? 'external') === 'external' && !value) {
                      return 'URL is required for external links'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'route',
                title: 'Internal Route',
                type: 'string',
                description: 'Internal route path, e.g. "portfolio/promptforge" or "about".',
                hidden: ({parent}) => parent?.linkType !== 'internal',
                validation: (rule) =>
                  rule.custom((value, context) => {
                    const parent = context.parent as {linkType?: string} | undefined
                    if (parent?.linkType === 'internal' && !value) {
                      return 'A route is required for internal links'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'newTab',
                title: 'Open in New Tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'code',
      title: 'Code Block',
      options: {
        language: 'typescript',
        languageAlternatives: [
          {title: 'TypeScript', value: 'typescript'},
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TSX', value: 'tsx'},
          {title: 'JSX', value: 'jsx'},
          {title: 'Shell', value: 'sh'},
          {title: 'JSON', value: 'json'},
          {title: 'CSS', value: 'css'},
          {title: 'HTML', value: 'html'},
          {title: 'Python', value: 'python'},
          {title: 'GROQ', value: 'groq'},
          {title: 'Plain text', value: 'text'},
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              if (parent?.asset?._ref && !alt) {
                return 'Alternative text is required when an image is set'
              }
              return true
            }),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Rendered as the "fig.N" figure caption.',
        }),
      ],
    }),
  ],
})
