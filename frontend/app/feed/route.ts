import {client} from '@/sanity/lib/client'
import {RSS_POSTS_QUERY} from '@/sanity/lib/queries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kostalindraganov.com'
const siteTitle = 'Kostadin Draganov'
const siteDescription = 'Senior software developer & AI-native engineer'

type RssPost = {
  title: string | null
  slug: string | null
  summary: string | null
  date: string | null
  categoryTitle: string | null
}

export async function GET() {
  const posts = await client.fetch<RssPost[]>(RSS_POSTS_QUERY)

  const items = (posts ?? [])
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title ?? ''}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date ?? '').toUTCString()}</pubDate>
      ${post.summary ? `<description><![CDATA[${post.summary}]]></description>` : ''}
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle}</title>
    <link>${siteUrl}</link>
    <description>${siteDescription}</description>
    <language>en</language>
    <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
