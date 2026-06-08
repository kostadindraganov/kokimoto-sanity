import type {Metadata} from 'next'
import {stegaClean} from 'next-sanity'

import ContactStream from '@/app/components/portfolio/contact/ContactStream'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {CONTACT_PAGE_META_QUERY, SETTINGS_QUERY} from '@/sanity/lib/queries'
import type {SiteSettingsSeoData, PageSeoData} from '@/sanity/lib/seo-types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

import {CONTACT_PAGE_QUERY, type ContactPageQueryResult} from './queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''
const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const [{data: rawSettings}, {data: rawPage}] = await Promise.all([
    sanityFetchMetadata({query: SETTINGS_QUERY, perspective}),
    sanityFetchMetadata({query: CONTACT_PAGE_META_QUERY, perspective}),
  ])
  const settings = rawSettings as SiteSettingsSeoData | null
  const page = rawPage as PageSeoData | null

  const title = page?.seo?.metaTitle || settings?.seo?.metaTitle || settings?.name || ''
  const description =
    page?.seo?.metaDescription || settings?.seo?.metaDescription || settings?.shortBio || ''
  const ogImage =
    resolveOpenGraphImage(page?.seo?.ogImage) || resolveOpenGraphImage(settings?.seo?.ogImage)

  return {
    title,
    description,
    alternates: {canonical: SITE_URL + '/contact'},
    openGraph: {
      type: 'website',
      url: SITE_URL + '/contact',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage.url] : [],
    },
    robots: IS_PRODUCTION ? 'index,follow' : 'noindex',
  }
}

/* Cached server wrapper — mirrors CachedBlogPage's three-layer Cache
   Components pattern: dynamic options resolved in the page, data fetched
   inside 'use cache' with perspective/stega as cache keys. ContactForm
   imports the `submitContact` server action itself (client component
   contract), so no action prop is passed here. */
async function CachedContactPage({perspective, stega}: DynamicFetchOptions) {
  'use cache'

  const {data} = await sanityFetch({query: CONTACT_PAGE_QUERY, perspective, stega})
  const page = data as ContactPageQueryResult | null

  if (!page) return <div className="page" />

  const settings = page.settings

  /* derived strings only — "kostadin" from siteSettings.handle, route path */
  const who = stegaClean(settings?.handle ?? '').split('@')[0]
  /* schema stores full URLs; template displays them protocol-less (the
     sidebar re-adds https:// for the href). Prefix-replace keeps stega. */
  const stripProtocol = (url: string | null | undefined) =>
    url ? url.replace(/^https?:\/\//, '') : null

  return (
    <div className="page">
      <ContactStream
        documentId={page._id}
        documentType={page._type}
        who={who}
        promptCmd={page.chrome.promptCmd ?? 'connect'}
        promptFlag={page.chrome.promptFlag}
        eyebrow={page.eyebrow}
        heading={page.heading}
        intro={page.intro}
        formTitle={page.formTitle}
        formBadge={page.formBadge}
        nameField={page.nameField}
        emailField={page.emailField}
        messageField={page.messageField}
        submitLabel={page.submitLabel}
        formNote={page.formNote}
        validationMessages={page.validationMessages}
        successPanelTitle={page.successPanelTitle}
        successLines={page.successLines}
        successGreeting={page.successGreeting}
        sendAnotherLabel={page.sendAnotherLabel}
        availabilityHeading={page.availabilityHeading}
        availabilityText={page.availabilityText}
        resumeLabel={page.resumeLabel}
        email={settings?.email ?? null}
        github={stripProtocol(settings?.github)}
        linkedin={stripProtocol(settings?.linkedin)}
        cv={settings?.cv ?? null}
        location={settings?.location ?? null}
        availabilityStatus={settings?.availabilityStatus ?? null}
      />
    </div>
  )
}

export default async function ContactPage() {
  const fetchOptions = await getDynamicFetchOptions()
  return <CachedContactPage {...fetchOptions} />
}
