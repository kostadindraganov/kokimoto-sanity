import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {default: sanity},
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
}

export default nextConfig
