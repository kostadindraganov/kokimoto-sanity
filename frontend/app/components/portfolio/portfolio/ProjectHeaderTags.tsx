'use client'

import {stegaClean} from 'next-sanity'

import {dataAttr} from '@/sanity/lib/utils'

import type {ProjectTag} from './types'
import {useOptimisticTags} from './useOptimisticTags'

/** Project detail header tag chips (`--tag`) with optimistic `tags[]` reconciliation. */
export function ProjectHeaderTags({
  projectId,
  projectType,
  tags,
}: {
  projectId: string
  projectType: string
  tags: ProjectTag[]
}) {
  const optimisticTags = useOptimisticTags(projectId, tags)
  return (
    <div
      className="chips"
      style={{marginTop: 14}}
      data-sanity={dataAttr({id: projectId, type: projectType, path: 'tags'}).toString()}
    >
      {optimisticTags.map((t) => (
        <span
          key={t._key}
          className="acc"
          style={{fontSize: 12}}
          data-sanity={dataAttr({
            id: projectId,
            type: projectType,
            path: `tags[_key=="${t._key}"]`,
          }).toString()}
        >
          --{stegaClean(t.slug)}
        </span>
      ))}
    </div>
  )
}
