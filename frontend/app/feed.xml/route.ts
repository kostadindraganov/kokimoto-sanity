import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {RSS_POSTS_QUERY, SETTINGS_QUERY} from '@/sanity/lib/queries'
import type {SiteSettingsSeoData, RssPostItem} from '@/sanity/lib/seo-types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

/** Convert ISO date string to RFC 822 format for RSS pubDate */
function toRfc822(dateStr: string | null | undefined): string {
  if (!dateStr) return new Date().toUTCString()
  return new Date(dateStr).toUTCString()
}

/** Escape XML special characters */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  const {perspective} = await getDynamicFetchOptions()

  const [{data: rawSettings}, {data: rawPosts}] = await Promise.all([
    sanityFetchMetadata({query: SETTINGS_QUERY, perspective}),
    sanityFetchMetadata({query: RSS_POSTS_QUERY, perspective}),
  ])

  const settings = rawSettings as SiteSettingsSeoData | null
  const posts = (rawPosts as RssPostItem[] | null) ?? []

  const siteTitle = settings?.name || 'Portfolio'
  const siteDescription = settings?.shortBio || ''
  const feedUrl = `${SITE_URL}/feed.xml`

  const items = posts
    .map((post) => {
      const postUrl = `${SITE_URL}/blog/${post.slug}`
      return `
    <item>
      <title>${escapeXml(post.title || '')}</title>
      <link>${postUrl}</link>
      <description>${escapeXml(post.summary || '')}</description>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <guid isPermaLink="true">${postUrl}</guid>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${SITE_URL}/</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
