import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {token} from '@/sanity/lib/token'

/**
 * Base Sanity client — no hardcoded perspective or stega so callers can
 * pass the correct values per context (draft mode vs. published, with/without
 * visual-editing overlays). Perspective and stega are supplied at the
 * sanityFetch() call level via next-sanity's defineLive pattern (§5.3).
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token, // Required if you have a private dataset
  stega: {studioUrl},
})
