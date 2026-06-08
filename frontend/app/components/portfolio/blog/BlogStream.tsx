'use client'

import {useMemo} from 'react'

import {Stream, type StreamStep} from '../home/fx/Streaming'
import {useStreamReveal} from '../fx/useStreamReveal'
import {BlogBoard} from './BlogBoard'
import type {BlogPageData, BlogPost, BlogCategory} from './types'

interface BlogStreamProps {
  blogPage: BlogPageData | null
  posts: BlogPost[]
  categories: BlogCategory[]
  initialSearch?: string
  initialCategory?: string
  eyebrow: string
  heading: string
  intro: string
}

export function BlogStream({
  blogPage,
  posts,
  categories,
  initialSearch,
  initialCategory,
  eyebrow,
  heading,
  intro,
}: BlogStreamProps) {
  const {animate, streamKey, onComplete} = useStreamReveal('blog')

  const steps = useMemo<StreamStep[]>(
    () => [
      {
        kind: 'node',
        delay: 160,
        gap: 0,
        node: (
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h1
              className="h-display"
              style={{fontSize: 'clamp(28px,5vw,46px)', marginTop: 12}}
            >
              {heading}
            </h1>
            <p className="hero-bio" style={{marginTop: 10}}>
              {intro}
            </p>
          </div>
        ),
      },
      {
        kind: 'prompt',
        gap: 28,
        segments: [
          {t: 'kostadin', c: 'who'},
          {t: '~/blog', c: 'path'},
          {t: 'tail -f ./blog', c: 'cmd'},
          {t: '--latest', c: 'flag'},
        ],
      },
      {kind: 'think', duration: 1000},
      {
        kind: 'tools',
        label: 'running tools',
        collapsedLabel: '4 tool uses',
        actions: [
          'Opening content layer',
          'Sorting by published_at',
          'Computing reading time',
          'Streaming entries',
        ],
      },
      {
        kind: 'node',
        delay: 300,
        gap: 24,
        node: (
          <BlogBoard
            posts={posts}
            categories={categories}
            blogPage={blogPage}
            initialSearch={initialSearch}
            initialCategory={initialCategory}
          />
        ),
      },
    ],
    [blogPage, posts, categories, initialSearch, initialCategory, eyebrow, heading, intro],
  )

  return <Stream key={streamKey} steps={steps} animate={animate} onComplete={onComplete} />
}
