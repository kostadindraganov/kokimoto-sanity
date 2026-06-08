'use client'

/* ============================================================
   PortfolioStream.tsx — streaming reveal for the portfolio list
   page. Mirrors PortfolioPage steps from the source template
   (docs/kokikillara-porfolio/js/portfolio.jsx lines 191-215).
   Copy is sourced from CMS props already fetched by the server
   component; PortfolioBoard logic is untouched.
   ============================================================ */

import {useMemo} from 'react'

import {shellPrompt, Stream, type StreamStep} from '../home/fx/Streaming'
import {useStreamReveal} from '../fx/useStreamReveal'
import {PortfolioBoard} from './PortfolioBoard'
import type {PortfolioPageData, ProjectListItem, TagDoc} from './types'

type PageWithHandle = (PortfolioPageData & {settingsHandle: string | null}) | null

export function PortfolioStream({
  page,
  projects,
  tags,
}: {
  page: PageWithHandle
  projects: ProjectListItem[]
  tags: TagDoc[]
}) {
  const {animate, streamKey, onComplete} = useStreamReveal('portfolio')

  const steps = useMemo<StreamStep[]>(
    () => [
      {
        kind: 'node',
        delay: 160,
        gap: 0,
        node: (
          <div>
            <div className="eyebrow">{page?.eyebrow}</div>
            <h1
              className="h-display"
              style={{fontSize: 'clamp(28px,5vw,46px)', marginTop: 12}}
            >
              {page?.heading}
            </h1>
            <p className="hero-bio" style={{marginTop: 10}}>
              {page?.intro}
            </p>
          </div>
        ),
      },
      {
        kind: 'prompt',
        gap: 28,
        segments: shellPrompt(page?.settingsHandle ?? '', 'ls ./portfolio'),
      },
      {kind: 'think', duration: 900},
      {
        kind: 'tools',
        label: 'running tools',
        collapsedLabel: '4 tool uses',
        actions: [
          'Scanning repositories',
          'Reading deploy logs',
          'Resolving build status',
          'Computing impact deltas',
        ],
      },
      {
        kind: 'node',
        delay: 300,
        gap: 28,
        node: <PortfolioBoard page={page} projects={projects} tags={tags} />,
      },
    ],
    [page, projects, tags],
  )

  return <Stream key={streamKey} steps={steps} animate={animate} onComplete={onComplete} />
}
