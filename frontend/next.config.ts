import path from 'node:path'
import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {default: sanity},
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
  turbopack: {
    // Monorepo root — silences incorrect workspace-root inference caused by a
    // stray lockfile in the home directory.
    root: path.join(__dirname, '..'),
  },
}

export default nextConfig
