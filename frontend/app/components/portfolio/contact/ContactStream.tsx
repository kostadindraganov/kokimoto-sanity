'use client'

/* ============================================================
   ContactStream.tsx — streaming reveal for the Contact page.
   Verbatim port of docs/kokikillara-porfolio/js/contact.jsx
   ContactPage steps, wired to CMS props + Sanity Presentation
   click-to-edit via data-sanity attributes.
   ============================================================ */

import {useMemo} from 'react'

import {dataAttr} from '@/sanity/lib/utils'

import {Stream, type StreamStep} from '../home/fx/Streaming'
import {useStreamReveal} from '../fx/useStreamReveal'
import ContactForm, {type ContactFormProps} from './ContactForm'
import ContactSidebar from './ContactSidebar'

interface ContactSidebarProps {
  availabilityHeading?: string | null
  availabilityText?: string | null
  resumeLabel?: string | null
  email?: string | null
  github?: string | null
  linkedin?: string | null
  cv?: string | null
  location?: string | null
  availabilityStatus?: boolean | null
}

export interface ContactStreamProps extends ContactFormProps, ContactSidebarProps {
  documentId: string
  documentType: string
  who: string
  promptCmd: string
  promptFlag?: string | null
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
}

export default function ContactStream({
  documentId,
  documentType,
  who,
  promptCmd,
  promptFlag,
  eyebrow,
  heading,
  intro,
  /* ContactForm props */
  formTitle,
  formBadge,
  nameField,
  emailField,
  messageField,
  submitLabel,
  formNote,
  validationMessages,
  successPanelTitle,
  successLines,
  successGreeting,
  sendAnotherLabel,
  /* ContactSidebar props */
  availabilityHeading,
  availabilityText,
  resumeLabel,
  email,
  github,
  linkedin,
  cv,
  location,
  availabilityStatus,
}: ContactStreamProps) {
  const {animate, streamKey, onComplete} = useStreamReveal('contact')

  const attr = (path: string) => dataAttr({id: documentId, type: documentType, path}).toString()

  const steps = useMemo<StreamStep[]>(
    () => [
      {
        kind: 'node',
        gap: 0,
        delay: 160,
        node: (
          <div>
            <div className="eyebrow" data-sanity={attr('eyebrow')}>
              {eyebrow}
            </div>
            <h1
              className="h-display"
              style={{fontSize: 'clamp(28px,5vw,46px)', marginTop: 12}}
              data-sanity={attr('heading')}
            >
              {heading}
            </h1>
            <p className="hero-bio" style={{marginTop: 10}} data-sanity={attr('intro')}>
              {intro}
            </p>
          </div>
        ),
      },
      {
        kind: 'prompt',
        gap: 28,
        segments: [
          {t: who, c: 'who'},
          {t: '~/contact', c: 'path'},
          {t: promptCmd, c: 'cmd'},
          ...(promptFlag ? [{t: promptFlag, c: 'flag'}] : []),
        ],
      },
      {kind: 'think', duration: 1000},
      {
        kind: 'node',
        delay: 320,
        node: (
          <div className="split-2" style={{marginTop: 6}}>
            <ContactForm
              formTitle={formTitle}
              formBadge={formBadge}
              nameField={nameField}
              emailField={emailField}
              messageField={messageField}
              submitLabel={submitLabel}
              formNote={formNote}
              validationMessages={validationMessages}
              successPanelTitle={successPanelTitle}
              successLines={successLines}
              successGreeting={successGreeting}
              sendAnotherLabel={sendAnotherLabel}
              data-sanity={attr('formTitle')}
            />
            <ContactSidebar
              availabilityHeading={availabilityHeading}
              availabilityText={availabilityText}
              resumeLabel={resumeLabel}
              email={email}
              github={github}
              linkedin={linkedin}
              cv={cv}
              location={location}
              availabilityStatus={availabilityStatus}
              data-sanity={attr('availabilityHeading')}
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      documentId,
      documentType,
      who,
      promptCmd,
      promptFlag,
      eyebrow,
      heading,
      intro,
      formTitle,
      formBadge,
      nameField,
      emailField,
      messageField,
      submitLabel,
      formNote,
      validationMessages,
      successPanelTitle,
      successLines,
      successGreeting,
      sendAnotherLabel,
      availabilityHeading,
      availabilityText,
      resumeLabel,
      email,
      github,
      linkedin,
      cv,
      location,
      availabilityStatus,
    ],
  )

  return <Stream key={streamKey} steps={steps} animate={animate} onComplete={onComplete} />
}
