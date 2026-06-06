import {sanityFetch} from '@/sanity/lib/live'
import {allPostsQuery} from '@/sanity/lib/queries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kostalindraganov.com'
const siteTitle = 'Kostadin Draganov'
const siteDescription = 'Senior software developer & AI-native engineer'

export async function GET() {
  const {data: posts} = await sanityFetch({query: allPostsQuery})

  const items = (posts ?? [])
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.excerpt ? `<description><![CDATA[${post.excerpt}]]></description>` : ''}
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
