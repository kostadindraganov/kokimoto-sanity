'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {fmtDate, formatReadTime} from '@/app/components/portfolio/blog/utils'
import type {ArticleLabels, BlogPost, BlogTag} from '@/app/components/portfolio/blog/types'

interface TocItem {
  id: string
  label: string
  level: 'h2' | 'h3'
}

interface SidebarCategories {
  title: string
  slug: string
  count: number
}

interface RecentPost {
  _id: string
  title: string
  slug: string
  date: string
}

interface ArticleSidebarProps {
  post: BlogPost
  tocItems: TocItem[]
  categories: SidebarCategories[]
  allTags: BlogTag[]
  recentPosts: RecentPost[]
  archiveEntries: Array<[string, number]>
  labels: ArticleLabels | null
}

export function ArticleSidebar({
  post,
  tocItems,
  categories,
  allTags,
  recentPosts,
  archiveEntries,
  labels,
}: ArticleSidebarProps) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(tocItems[0]?.id ?? '')

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    if (tocItems.length === 0) return
    if (typeof IntersectionObserver === 'undefined') return

    let io: IntersectionObserver | undefined

    const attach = () => {
      const els = tocItems
        .map((t) => document.getElementById(t.id))
        .filter((el): el is HTMLElement => Boolean(el))
      if (els.length === 0) return false

      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActive(e.target.id)
          }
        },
        {rootMargin: '-80px 0px -65% 0px', threshold: 0},
      )
      els.forEach((el) => io!.observe(el))
      return true
    }

    // Body streams in, so retry until headings exist
    let tries = 0
    const id = setInterval(() => {
      if (attach() || ++tries > 40) clearInterval(id)
    }, 250)

    return () => {
      clearInterval(id)
      io?.disconnect()
    }
  }, [tocItems])

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({top, behavior: 'smooth'})
  }

  const tocHeading = labels?.tocHeading ?? 'on this page'
  const searchHeading = labels?.searchHeading ?? 'search'
  const categoriesHeading = labels?.categoriesHeading ?? 'categories'
  const tagsHeading = labels?.tagsHeading ?? 'tags'
  const recentHeading = labels?.recentHeading ?? 'recent posts'
  const archivesHeading = labels?.archivesHeading ?? 'archives'
  const readingTimeLabel = labels?.readingTimeHeading ?? 'reading time'
  const categoryHeading = labels?.categoryHeading ?? 'category'

  const readTimeDisplay = post.readTime
    ? formatReadTime(post.readTime)
    : formatReadTime(3)

  return (
    <div className="aside-stack">
      {/* Post meta */}
      <div className="aside-card">
        <div className="aside-grid2">
          <div>
            <div className="aside-k">{readingTimeLabel}</div>
            <div className="aside-v acc">{readTimeDisplay}</div>
          </div>
          <div>
            <div className="aside-k">{categoryHeading}</div>
            <div className="aside-v">{post.category?.title}</div>
          </div>
        </div>
        <div className="aside-k" style={{marginTop: 14}}>
          tags
        </div>
        <div className="aside-tags" style={{marginTop: 7}}>
          {(post.tags ?? []).map((t) => (
            <Link
              key={t._id}
              href={`/blog?search=${encodeURIComponent(t.title)}`}
              className="aside-tag on"
            >
              #{t.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Table of contents */}
      {tocItems.length > 0 && (
        <div className="aside-card">
          <div className="aside-head">{tocHeading}</div>
          <nav className="aside-toc">
            {tocItems.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={'aside-toc-link' + (active === t.id ? ' active' : '')}
                onClick={(e) => jump(e, t.id)}
              >
                <span className="dot" />
                {t.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Search */}
      <div className="aside-card">
        <div className="aside-head">{searchHeading}</div>
        <form
          className="aside-search"
          onSubmit={(e) => {
            e.preventDefault()
            if (q.trim()) {
              window.location.href = `/blog?search=${encodeURIComponent(q.trim())}`
            }
          }}
        >
          <span className="pfx">/</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search field notes…"
            aria-label="Search posts"
          />
        </form>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="aside-card">
          <div className="aside-head">{categoriesHeading}</div>
          <ul className="aside-list">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/blog?category=${encodeURIComponent(c.title)}`}>
                  <span>{c.title}</span>
                  <span className="ct">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="aside-card">
          <div className="aside-head">{tagsHeading}</div>
          <div className="aside-tags">
            {allTags.map((t) => (
              <Link
                key={t._id}
                href={`/blog?search=${encodeURIComponent(t.title)}`}
                className="aside-tag"
              >
                #{t.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div className="aside-card">
          <div className="aside-head">{recentHeading}</div>
          <ul className="aside-recent">
            {recentPosts.map((p) => (
              <li key={p._id}>
                <Link href={`/blog/${p.slug}`}>
                  <span className="rt">{p.title}</span>
                  <span className="rd tnum">{fmtDate(p.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Archives */}
      {archiveEntries.length > 0 && (
        <div className="aside-card">
          <div className="aside-head">{archivesHeading}</div>
          <ul className="aside-list">
            {archiveEntries.map(([month, n]) => (
              <li key={month}>
                <Link href="/blog">
                  <span>{month}</span>
                  <span className="ct">{n}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
