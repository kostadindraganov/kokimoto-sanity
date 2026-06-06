'use client'

import {stegaClean} from 'next-sanity'
import {useEffect, useMemo, useRef, useState} from 'react'

import {dataAttr} from '@/sanity/lib/utils'

import {BENTO_SIZES_FULL, BentoCard} from './BentoCard'
import {interpolate} from './interpolate'
import {Spinner} from './Spinner'
import type {PortfolioPageData, ProjectListItem, TagDoc} from './types'

/** One full bento pattern cycle per batch keeps sizes stable while streaming. */
const BATCH_SIZE = 6

const ALL = 'all'

function BentoGrid({projects, gridKey}: {projects: ProjectListItem[]; gridKey: string}) {
  return (
    <div className="bento-grid" key={gridKey}>
      {projects.map((p, i) => {
        const size = BENTO_SIZES_FULL[i % BENTO_SIZES_FULL.length] || 'm'
        return <BentoCard key={p._id} p={p} size={size} idx={i} />
      })}
    </div>
  )
}

export function PortfolioBoard({
  page,
  projects,
  tags,
}: {
  page: PortfolioPageData | null
  projects: ProjectListItem[]
  tags: TagDoc[]
}) {
  const [active, setActive] = useState<string>(ALL)
  const [pages, setPages] = useState(1)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // selecting a flag also resets paging
  const selectFlag = (slug: string) => {
    setActive(slug)
    setPages(1)
  }

  const filtered = useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((p) => (p.tags ?? []).some((t) => stegaClean(t.slug) === active)),
    [active, projects],
  )

  const totalBatches = Math.max(1, Math.ceil(filtered.length / BATCH_SIZE))
  const visible = filtered.slice(0, pages * BATCH_SIZE)
  const atEnd = pages >= totalBatches

  // observe the sentinel — when it nears the viewport, load the next batch of real documents
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    if (atEnd) return
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setPages((p) => Math.min(totalBatches, p + 1))
          }
        }
      },
      {rootMargin: '0px 0px 600px 0px'},
    )
    io.observe(el)
    return () => io.disconnect()
  }, [atEnd, totalBatches, filtered.length])

  const pageAttr = (path: string) =>
    page ? dataAttr({id: page._id, type: page._type, path}).toString() : undefined

  return (
    <div>
      <div className="row wrap gap-8 portfolio-filter">
        <span
          className="faint"
          style={{fontSize: 12, alignSelf: 'center', marginRight: 4}}
          data-sanity={pageAttr('filterLabel')}
        >
          {page?.filterLabel}
        </span>
        <button className={'flag' + (active === ALL ? ' on' : '')} onClick={() => selectFlag(ALL)}>
          <span className="dd">›</span>--{ALL}
        </button>
        {tags.map((t) => {
          const slug = stegaClean(t.slug) || ''
          return (
            <button
              key={t._id}
              className={'flag' + (active === slug ? ' on' : '')}
              onClick={() => selectFlag(slug)}
              data-sanity={dataAttr({id: t._id, type: 'tag', path: 'title'}).toString()}
            >
              <span className="dd">›</span>--{stegaClean(t.title)}
            </button>
          )
        })}
        <span
          className="faint"
          style={{fontSize: 12, alignSelf: 'center', marginLeft: 4, whiteSpace: 'nowrap'}}
          data-sanity={pageAttr('matchesText')}
        >
          {interpolate(page?.matchesText, {n: filtered.length, m: pages, max: totalBatches})}
        </span>
      </div>

      <BentoGrid projects={visible} gridKey={active} />

      <div ref={sentinelRef} className="bento-sentinel" aria-live="polite">
        {atEnd ? (
          <span className="bento-sentinel-end" data-sanity={pageAttr('endText')}>
            <span className="bs-dot">●</span> {interpolate(page?.endText, {n: visible.length})}
          </span>
        ) : (
          <span className="bento-sentinel-loading" data-sanity={pageAttr('loadingText')}>
            <Spinner />
            <span>{interpolate(page?.loadingText, {n: filtered.length - visible.length})}</span>
            <span className="bs-meta">
              {pages + 1}/{totalBatches}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
