import {defineQuery} from 'next-sanity'

/* ============================================================
   Contact route query + result types.
   CONTRACT: colocated with the route (contact workstream file
   scope, mirroring home/queries.ts) because the shared
   sanity/lib/queries.ts `contactPageQuery` predates the deployed
   contactPage schema (it projects a `formFields` object that the
   schema does not have). Integration into the shared data layer
   is a move + import-path swap.

   Chrome strings the schema doesn't model (prompt cmd/flag) are
   projected with template-exact `coalesce` defaults so no
   visitor-visible copy is hardcoded in any component. The result
   types below are hand-written until `sanity typegen` runs
   against the new studio schema.
   ============================================================ */

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_id == "contactPage"][0]{
    _id,
    _type,
    "eyebrow": coalesce(eyebrow, "/contact"),
    "heading": coalesce(heading, "Run the final command"),
    "intro": coalesce(intro, "Tell me what you're building. The form validates like a terminal and replies in kind."),
    formTitle,
    formBadge,
    nameField{label, placeholder},
    emailField{label, placeholder},
    messageField{label, placeholder},
    submitLabel,
    formNote,
    validationMessages{
      nameRequired,
      emailRequired,
      emailInvalid,
      messageRequired,
      messageTooShort
    },
    successPanelTitle,
    successLines,
    successGreeting,
    sendAnotherLabel,
    availabilityHeading,
    availabilityText,
    resumeLabel,
    "chrome": {
      "promptCmd": coalesce(promptCmd, "connect"),
      "promptFlag": coalesce(
        promptFlag,
        "--with " + string::split(*[_id == "siteSettings"][0].name, " ")[0]
      )
    },
    "settings": *[_id == "siteSettings"][0]{
      _id,
      _type,
      handle,
      email,
      github,
      linkedin,
      "cv": cv.asset->url,
      location,
      availabilityStatus
    }
  }
`)

/* ---------- hand-written result types (until typegen covers the new schema) ---------- */

export interface ContactFieldDef {
  label: string | null
  placeholder: string | null
}

export interface ContactValidationMessages {
  nameRequired: string | null
  emailRequired: string | null
  emailInvalid: string | null
  messageRequired: string | null
  messageTooShort: string | null
}

export interface ContactPageSettings {
  _id: string
  _type: string
  handle: string | null
  email: string | null
  github: string | null
  linkedin: string | null
  cv: string | null
  location: string | null
  availabilityStatus: boolean | null
}

export interface ContactPageQueryResult {
  _id: string
  _type: string
  eyebrow: string | null
  heading: string | null
  intro: string | null
  formTitle: string | null
  formBadge: string | null
  nameField: ContactFieldDef | null
  emailField: ContactFieldDef | null
  messageField: ContactFieldDef | null
  submitLabel: string | null
  formNote: string | null
  validationMessages: ContactValidationMessages | null
  successPanelTitle: string | null
  successLines: string[] | null
  successGreeting: string | null
  sendAnotherLabel: string | null
  availabilityHeading: string | null
  availabilityText: string | null
  resumeLabel: string | null
  chrome: {
    promptCmd: string | null
    promptFlag: string | null
  }
  settings: ContactPageSettings | null
}
