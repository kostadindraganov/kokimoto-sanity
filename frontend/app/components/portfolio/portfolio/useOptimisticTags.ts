'use client'

import {type SanityDocument} from 'next-sanity'
import {useOptimistic} from 'next-sanity/hooks'

import type {ProjectTag} from './types'

type ProjectTagsDocument = {
  _id: string
  _type: string
  tags?: {_key: string; _ref?: string}[]
}

/**
 * Optimistically reconciles a project's `tags[]` reference array (by `_key`)
 * while editing in Presentation — reorders/removals appear instantly, newly
 * added references resolve on the next Live refresh.
 */
export function useOptimisticTags(documentId: string, initial: ProjectTag[]): ProjectTag[] {
  return useOptimistic<ProjectTag[], SanityDocument<ProjectTagsDocument>>(
    initial,
    (currentTags, action) => {
      // If the edit was to a different document, ignore it
      if (action.id !== documentId) {
        return currentTags
      }

      if (action.document.tags) {
        // Reconcile references by _key against the already-resolved tags
        return action.document.tags
          .map((ref) => currentTags.find((tag) => tag._key === ref._key))
          .filter((tag): tag is ProjectTag => Boolean(tag))
      }

      return currentTags
    },
  )
}
