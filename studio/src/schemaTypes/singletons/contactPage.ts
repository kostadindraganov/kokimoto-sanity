import {EnvelopeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

function formField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'label',
        title: 'Label',
        type: 'string',
        description: 'E.g. "--name".',
      }),
      defineField({
        name: 'placeholder',
        title: 'Placeholder',
        type: 'string',
        description: 'E.g. "your name".',
      }),
    ],
  })
}

/**
 * Contact page singleton (`_id: contactPage`). Form copy, validation
 * messages and the success "exit 0" panel. Link cards (email/GitHub/
 * LinkedIn/CV) derive from Site Settings.
 */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
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
      name: 'formTitle',
      title: 'Form Title',
      type: 'string',
      description: 'E.g. "~/connect.sh".',
    }),
    defineField({
      name: 'formBadge',
      title: 'Form Badge',
      type: 'string',
      description: 'E.g. "[stdin]".',
    }),
    formField('nameField', 'Name Field'),
    formField('emailField', 'Email Field'),
    formField('messageField', 'Message Field'),
    defineField({
      name: 'submitLabel',
      title: 'Submit Label',
      type: 'string',
      description: 'E.g. "run connect".',
    }),
    defineField({
      name: 'formNote',
      title: 'Form Note',
      type: 'string',
    }),
    defineField({
      name: 'validationMessages',
      title: 'Validation Messages',
      type: 'object',
      description: 'Inline "✗" error strings shown by the form.',
      fields: [
        defineField({
          name: 'nameRequired',
          title: 'Name Required',
          type: 'string',
        }),
        defineField({
          name: 'emailRequired',
          title: 'Email Required',
          type: 'string',
        }),
        defineField({
          name: 'emailInvalid',
          title: 'Email Invalid',
          type: 'string',
        }),
        defineField({
          name: 'messageRequired',
          title: 'Message Required',
          type: 'string',
        }),
        defineField({
          name: 'messageTooShort',
          title: 'Message Too Short',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'successPanelTitle',
      title: 'Success Panel Title',
      type: 'string',
      description: 'E.g. "connect — exit 0".',
    }),
    defineField({
      name: 'successLines',
      title: 'Success Lines',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) =>
        rule.length(3).warning('The success panel is designed for exactly 3 lines'),
    }),
    defineField({
      name: 'successGreeting',
      title: 'Success Greeting',
      type: 'string',
      description: 'E.g. "Thanks, {firstName}…" — {firstName} is interpolated.',
    }),
    defineField({
      name: 'sendAnotherLabel',
      title: 'Send Another Label',
      type: 'string',
      description: 'E.g. "↻ send another".',
    }),
    defineField({
      name: 'availabilityHeading',
      title: 'Availability Heading',
      type: 'string',
      description: 'E.g. "● Available".',
    }),
    defineField({
      name: 'availabilityText',
      title: 'Availability Text',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'resumeLabel',
      title: 'Resume Label',
      type: 'string',
      description: 'E.g. "↓ resume".',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact Page'}
    },
  },
})
