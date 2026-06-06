import {draftMode} from 'next/headers'
import {sanityFetch} from '@/sanity/lib/live'
import {CONTACT_PAGE_QUERY, SITE_SETTINGS_CONTACT_QUERY} from '@/sanity/lib/queries'
import ContactForm from '@/app/components/portfolio/contact/ContactForm'
import ContactSidebar from '@/app/components/portfolio/contact/ContactSidebar'

// Types for data returned from Sanity (schema not yet in typegen)
interface ContactPageData {
  formTitle?: string | null
  formBadge?: string | null
  heading?: string | null
  intro?: string | null
  nameField?: {label?: string | null; placeholder?: string | null} | null
  emailField?: {label?: string | null; placeholder?: string | null} | null
  messageField?: {label?: string | null; placeholder?: string | null} | null
  submitLabel?: string | null
  formNote?: string | null
  validationMessages?: {
    nameRequired?: string | null
    emailRequired?: string | null
    emailInvalid?: string | null
    messageRequired?: string | null
    messageTooShort?: string | null
  } | null
  successPanelTitle?: string | null
  successLines?: string[] | null
  successGreeting?: string | null
  sendAnotherLabel?: string | null
  availabilityHeading?: string | null
  availabilityText?: string | null
  resumeLabel?: string | null
}

interface SiteSettingsContactData {
  email?: string | null
  github?: string | null
  linkedin?: string | null
  cv?: string | null
  location?: string | null
  availabilityStatus?: boolean | null
  handle?: string | null
  availability?: string | null
}

export default async function ContactPage() {
  const {isEnabled: isDraftMode} = await draftMode()
  void isDraftMode

  const [{data: rawContactPage}, {data: rawSiteSettings}] = await Promise.all([
    sanityFetch({query: CONTACT_PAGE_QUERY}),
    sanityFetch({query: SITE_SETTINGS_CONTACT_QUERY}),
  ])

  const contactPage = rawContactPage as ContactPageData | null
  const siteSettings = rawSiteSettings as SiteSettingsContactData | null

  return (
    <div className="page">
      <div className="eyebrow">/contact</div>
      <h1 className="h-display" style={{fontSize: 'clamp(28px,5vw,46px)', marginTop: 12}}>
        {contactPage?.heading ?? 'Run the final command'}
      </h1>
      {contactPage?.intro && (
        <p className="hero-bio" style={{marginTop: 10}}>
          {contactPage.intro}
        </p>
      )}

      <div style={{marginTop: 28}}>
        <div className="prompt">
          <span className="who">{siteSettings?.handle ?? 'user'}</span>
          <span className="path">:~</span>
          <span className="cmd"> connect</span>
          <span className="flag"> --with Kostadin</span>
          <span className="cursor" />
        </div>
      </div>

      <div className="think" style={{marginTop: 14}}>
        <span className="think-glyph">&#9679;</span> thinking
      </div>

      <div className="split-2" style={{marginTop: 24}}>
        <ContactForm
          formTitle={contactPage?.formTitle}
          formBadge={contactPage?.formBadge}
          nameField={contactPage?.nameField}
          emailField={contactPage?.emailField}
          messageField={contactPage?.messageField}
          submitLabel={contactPage?.submitLabel}
          formNote={contactPage?.formNote}
          validationMessages={contactPage?.validationMessages}
          successPanelTitle={contactPage?.successPanelTitle}
          successLines={contactPage?.successLines}
          successGreeting={contactPage?.successGreeting}
          sendAnotherLabel={contactPage?.sendAnotherLabel}
        />
        <ContactSidebar
          availabilityHeading={contactPage?.availabilityHeading}
          availabilityText={contactPage?.availabilityText}
          resumeLabel={contactPage?.resumeLabel}
          email={siteSettings?.email}
          github={siteSettings?.github}
          linkedin={siteSettings?.linkedin}
          cv={siteSettings?.cv}
          location={siteSettings?.location}
          availabilityStatus={siteSettings?.availabilityStatus}
        />
      </div>
    </div>
  )
}
