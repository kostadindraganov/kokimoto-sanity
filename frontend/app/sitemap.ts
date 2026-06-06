import type {MetadataRoute} from 'next'

import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {PROJECTS_SLUG_QUERY, POSTS_SLUG_QUERY} from '@/sanity/lib/queries'
import type {SlugItem} from '@/sanity/lib/seo-types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {perspective} = await getDynamicFetchOptions()

  const [{data: rawProjects}, {data: rawPosts}] = await Promise.all([
    sanityFetchMetadata({query: PROJECTS_SLUG_QUERY, perspective}),
    sanityFetchMetadata({query: POSTS_SLUG_QUERY, perspective}),
  ])

  const projects = (rawProjects as SlugItem[] | null) ?? []
  const posts = (rawPosts as SlugItem[] | null) ?? []

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/portfolio/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified:
      p._updatedAt ? new Date(p._updatedAt) : p.date ? new Date(p.date) : new Date(),
    changeFrequency: 'never' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
