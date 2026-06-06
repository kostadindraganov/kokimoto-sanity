import {InboxIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Contact form submission. Created ONLY by the frontend server action
 * (write token) into the private `inbox` dataset — never authored in
 * the Studio. Only the `update` action is enabled so editors can toggle
 * `read` but cannot create, delete or duplicate submissions.
 *
 * `{strict: false}` is required because `__experimental_actions` is not
 * part of the strict `defineType` input type.
 */
export const contactSubmission = defineType(
  {
    name: 'contactSubmission',
    title: 'Contact Submission',
    type: 'document',
    icon: InboxIcon,
    // Disable create/delete/duplicate/publish from the Studio UI —
    // submissions are only created by the frontend server action.
    __experimental_actions: ['update'],
    fields: [
      defineField({
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'email',
        title: 'Email',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'message',
        title: 'Message',
        type: 'text',
        rows: 5,
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'submittedAt',
        title: 'Submitted At',
        type: 'datetime',
      }),
      defineField({
        name: 'read',
        title: 'Read',
        type: 'boolean',
        initialValue: false,
      }),
    ],
    orderings: [
      {
        title: 'Newest first',
        name: 'submittedAtDesc',
        by: [{field: 'submittedAt', direction: 'desc'}],
      },
    ],
    preview: {
      select: {name: 'name', email: 'email', read: 'read', submittedAt: 'submittedAt'},
      prepare({name, email, read, submittedAt}) {
        return {
          title: `${read ? '' : '● '}${name ?? 'Unknown sender'}`,
          subtitle: [email, submittedAt?.slice(0, 10)].filter(Boolean).join(' · '),
        }
      },
    },
  },
  {strict: false},
)
