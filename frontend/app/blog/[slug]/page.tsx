import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {CachedArticlePage} from '@/app/components/portfolio/article/CachedArticlePage'
import {getDynamicFetchOptions, sanityFetchMetadata, sanityFetchStaticParams} from '@/sanity/lib/live'
import {POST_META_QUERY, POSTS_SLUG_QUERY, SETTINGS_QUERY} from '@/sanity/lib/queries'
import type {SiteSettingsSeoData, PostMetaData, SlugItem} from '@/sanity/lib/seo-types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''
const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({query: POSTS_SLUG_QUERY})
  return ((data as SlugItem[] | null) ?? []).map((item) => ({slug: item.slug}))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const {slug} = await props.params
  const {perspective} = await getDynamicFetchOptions()
  const [{data: rawSettings}, {data: rawPost}] = await Promise.all([
    sanityFetchMetadata({query: SETTINGS_QUERY, perspective}),
    sanityFetchMetadata({query: POST_META_QUERY, params: {slug}, perspective}),
  ])
  const settings = rawSettings as SiteSettingsSeoData | null
  const post = rawPost as PostMetaData | null

  if (!post) return {}

  const title =
    post.seo?.metaTitle || post.title || settings?.seo?.metaTitle || settings?.name || ''
  const description =
    post.seo?.metaDescription || post.summary || settings?.seo?.metaDescription || settings?.shortBio || ''
  const ogImage =
    resolveOpenGraphImage(post.seo?.ogImage) ||
    resolveOpenGraphImage(post.coverImage) ||
    resolveOpenGraphImage(settings?.seo?.ogImage)

  return {
    title,
    description,
    alternates: {canonical: `${SITE_URL}/blog/${slug}`},
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/blog/${slug}`,
      title,
      description,
      images: ogImage ? [ogImage] : [],
      publishedTime: post.date || undefined,
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

function BlogPostingJsonLd({
  title,
  slug,
  description,
  datePublished,
  ogImageUrl,
  authorName,
  authorUrl,
}: {
  title: string
  slug: string
  description: string
  datePublished?: string | null
  ogImageUrl?: string
  authorName: string
  authorUrl: string
}) {
  const articleUrl = `${SITE_URL}/blog/${slug}`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: title,
        description,
        url: articleUrl,
        ...(datePublished ? {datePublished} : {}),
        ...(ogImageUrl ? {image: ogImageUrl} : {}),
        author: {
          '@type': 'Person',
          name: authorName,
          url: authorUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL + '/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: SITE_URL + '/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: articleUrl,
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
    />
  )
}

export default async function BlogPostPage(props: Props) {
  const {slug} = await props.params
  const {perspective, stega} = await getDynamicFetchOptions()
  const [{data: rawPost}, {data: rawSettings}] = await Promise.all([
    sanityFetchMetadata({query: POST_META_QUERY, params: {slug}, perspective}),
    sanityFetchMetadata({query: SETTINGS_QUERY, perspective}),
  ])
  const post = rawPost as PostMetaData | null
  const settings = rawSettings as SiteSettingsSeoData | null

  if (!post) return notFound()

  const ogImage = resolveOpenGraphImage(post.seo?.ogImage) || resolveOpenGraphImage(post.coverImage)

  return (
    <>
      <BlogPostingJsonLd
        title={post.title || ''}
        slug={slug}
        description={post.summary || ''}
        datePublished={post.date}
        ogImageUrl={ogImage?.url}
        authorName={settings?.name || ''}
        authorUrl={SITE_URL + '/about'}
      />
      <CachedArticlePage slug={slug} perspective={perspective} stega={stega} />
    </>
  )
}
