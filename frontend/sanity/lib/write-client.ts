import 'server-only'

import {createClient} from 'next-sanity'

import {apiVersion, projectId, studioUrl} from '@/sanity/lib/api'
import {token} from '@/sanity/lib/token'

/**
 * Write client — always targets the 'inbox' dataset per PRD §11.
 * This client is server-only and must never be imported from client components.
 */
export const writeClient = createClient({
  projectId,
  dataset: 'inbox',
  apiVersion,
  useCdn: false,
  token,
  stega: {studioUrl},
})
