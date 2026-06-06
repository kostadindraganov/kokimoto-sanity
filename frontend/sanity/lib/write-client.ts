import 'server-only'

import {createClient} from 'next-sanity'

const writeToken = process.env.SANITY_API_WRITE_TOKEN
if (!writeToken) {
  throw new Error('Missing environment variable: SANITY_API_WRITE_TOKEN')
}

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'inbox',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: writeToken,
  useCdn: false,
})
