### Install next-sanity with bun

Source: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md

Install the next-sanity toolkit and the Sanity image URL package using bun.

```bash
bun install next-sanity @sanity/image-url
```

--------------------------------

### Install next-sanity with yarn

Source: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md

Install the next-sanity toolkit and the Sanity image URL package using yarn.

```bash
yarn add next-sanity @sanity/image-url
```

--------------------------------

### Install next-sanity with npm

Source: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md

Install the next-sanity toolkit and the Sanity image URL package using npm.

```bash
npm install next-sanity @sanity/image-url
```

--------------------------------

### Install next-sanity with pnpm

Source: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md

Install the next-sanity toolkit and the Sanity image URL package using pnpm.

```bash
pnpm install next-sanity @sanity/image-url
```

--------------------------------

### Install next-sanity v13

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/SKILL.md

Install the specified version of `next-sanity` to integrate with Next.js Cache Components.

```bash
npm install next-sanity@^13 --save-exact
```

--------------------------------

### Create Sanity Client Instance

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/live-helpers.md

Use this shape as a starting point for `src/sanity/lib/client.ts` if it doesn't exist. Ensure all required environment variables are set.

```typescript
// src/sanity/lib/client.ts
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2026-05-19',
  perspective: 'published',
  stega: {studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'},
})
```

--------------------------------

### Install Peer Dependencies with yarn

Source: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md

For yarn v1, use this command to install peer dependencies required for the embedded Sanity Studio.

```bash
npx install-peerdeps --yarn next-sanity
```

--------------------------------

### Initialize Sanity Project

Source: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md

Use this command to create a new Sanity project and link it to your Next.js application. It sets up basic utilities for content querying and optionally embeds the Sanity Studio.

```bash
npx sanity@latest init
```

--------------------------------

### Create Next.js Application

Source: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md

If you don't have a Next.js application, use this command to create one. This README assumes default options were chosen.

```bash
npx create-next-app@latest
```

--------------------------------

### Define Live Fetcher and Helpers

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/live-helpers.md

Set up `src/sanity/lib/live.ts` to enable live content previews. This includes defining the `SanityLive` component, `sanityFetch` function, and utility functions for fetching dynamic options, static params, and metadata. Ensure `SANITY_API_READ_TOKEN` is securely handled.

```typescript
// src/sanity/lib/live.ts
import {type QueryParams} from 'next-sanity'
import {defineLive, resolvePerspectiveFromCookies, type LivePerspective} from 'next-sanity/live'
import {cookies, draftMode} from 'next/headers'
import {client} from './client'

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}

export const {SanityLive, sanityFetch} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

export interface DynamicFetchOptions {
  perspective: LivePerspective
  stega: boolean
}
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return {perspective: 'published', stega: false}
  }

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', stega: true}
}

// For usage within `generateStaticParams`
export async function sanityFetchStaticParams<const QueryString extends string>({ 
  query,
  params = {},
}: {
  query: QueryString
  params?: QueryParams
}) {
  'use cache'
  const {data} = await sanityFetch({query, params, perspective: 'published', stega: false})
  return {data}
}

// For usage within `generateMetadata` and `generateViewport`
export async function sanityFetchMetadata<const QueryString extends string>({ 
  query,
  params = {},
  perspective,
}: {
  query: QueryString
  params?: QueryParams
  perspective: LivePerspective
}) {
  'use cache'
  const {data} = await sanityFetch({query, params, perspective, stega: false})
  return {data}
}
```

--------------------------------

### Three-Layer Pattern for Pages and Layouts

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/SKILL.md

Illustrates the structure for statically prerendered routes, differentiating between draft and non-draft modes. Layer 3 is the only layer that should carry 'use cache'.

```text
Page/Layout (Layer 1: draftMode branch)
  ├── NOT draft mode → <CachedX perspective="published" stega={false} />  (no Suspense)
  └── draft mode → <Suspense fallback={...}>
                      <DynamicX params={params} />  (Layer 2: awaits dynamic APIs)
                        └── <CachedX perspective={p} stega={s} />  (Layer 3: 'use cache')
```

--------------------------------

### Define Live Helpers with defineLive

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/SKILL.md

Configure `defineLive` to export helpers like `SanityLive` and `sanityFetch`. Ensure `client`, `serverToken`, and `browserToken` are provided. `strict: true` is recommended for type safety.

```typescript
// src/sanity/lib/live.ts (excerpt)
export const {SanityLive, sanityFetch} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})
```

--------------------------------

### Structure of the Three-layer Component Pattern

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/three-layer-pattern.md

Illustrates the component hierarchy and data flow for static prerendering and draft mode handling.

```text
Page/Layout (Layer 1)
  ├── NOT draft mode → <CachedX perspective="published" stega={false} />  (no Suspense)  
  └── draft mode → <Suspense fallback={...}>
                      <DynamicX params={params} />  (Layer 2)
                        └── <CachedX params={await params} perspective={p} stega={s} />  (Layer 3)
```

--------------------------------

### Loading fallback UI for dynamic routes

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/dynamic-segments.md

Use a sibling `loading.tsx` file to provide fallback UI for dynamic routes when using partial static generation. This component should be lightweight and avoid layout shifts.

```tsx
// src/app/[slug]/loading.tsx
export default function Loading() {
  return (
    <article aria-busy>
      <p>Loading…</p>
    </article>
  )
}
```

--------------------------------

### Shared 'use cache' Helper for Draft/Published Branches

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/layouts.md

This pattern demonstrates how to use a shared `'use cache'` helper to fetch settings data. It ensures that data fetching is optimized for both draft and published branches, preventing redundant fetches and improving performance. Use this when components need the same data and you want to leverage caching.

```tsx
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

async function fetchSettings({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const settingsQuery = defineQuery(`*[_type == "settings"][0]`)
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  return data
}

export default async function WebsiteLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <>
      {isDraftMode ? (
        <Suspense fallback={<NavbarFallback />}>
          <DynamicNavbar />
        </Suspense>
      ) : (
        <CachedNavbar perspective="published" stega={false} />
      )}
      {children}
      {isDraftMode ? (
        <Suspense>
          <DynamicFooter />
        </Suspense>
      ) : (
        <CachedFooter perspective="published" stega={false} />
      )}
    </>
  )
}

async function DynamicNavbar() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedNavbar perspective={perspective} stega={stega} />
}
async function CachedNavbar({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  return <Navbar data={data} />
}

async function DynamicFooter() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedFooter perspective={perspective} stega={stega} />
}
async function CachedFooter({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  return <Footer data={data} />
}
```

--------------------------------

### Using sanityFetch within Server Actions

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/live-helpers.md

Shows how to use `sanityFetch` inside server actions by resolving `perspective` and `stega` within a separate 'use cache' boundary. Avoid calling `sanityFetch` directly inside 'use server'.

```tsx
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

async function fetchMore({page, perspective, stega}: {page: string} & DynamicFetchOptions) {
  'use cache'
  const pagesQuery = defineQuery(`*[_type == "page"][0...$page]`)
  const {data} = await sanityFetch({query: pagesQuery, params: {page}, perspective, stega})
  return data
}
async function renderMore({page}: {page: string}) {
  'use server'
  const {perspective, stega} = await getDynamicFetchOptions()
  const data = await fetchMore({page, perspective, stega})
}
```

--------------------------------

### Anti-pattern: Hardcoding options in sanityFetch

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/live-helpers.md

Illustrates an anti-pattern where `perspective` and `stega` are hardcoded in `sanityFetch`. This breaks Visual Editing and content-release previewing.

```tsx
async function CachedComponent({slug}: {slug: string}) {
  'use cache'
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug},
    perspective: 'published', // hardcoded
    stega: false, // hardcoded
  })
}
```

--------------------------------

### Using sanityFetch in React Server Components

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/live-helpers.md

Demonstrates the correct pattern for using `sanityFetch` within React Server Components that have a 'use cache' directive. Ensure `perspective` and `stega` are passed as props and not hardcoded.

```tsx
import {sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

async function CachedComponent({slug, perspective, stega}: {slug: string} & DynamicFetchOptions) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({query: pageQuery, params: {slug}, perspective, stega})
}
```

--------------------------------

### Render SanityLive in Root Layout

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/SKILL.md

Include `<SanityLive>` and `<VisualEditing>` in your root `layout.tsx`. Pass `includeDrafts={isDraftMode}` to `SanityLive` when `strict: true` is configured. Ensure these components are rendered at most once.

```tsx
// src/app/layout.tsx
import {SanityLive} from '@/sanity/lib/live'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
```

--------------------------------

### Configure next.config.ts for Sanity Live Cache

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/SKILL.md

Enable `cacheComponents` and set `cacheLife.default` to `sanity` for a 1-year cache duration. This configuration is optimized for on-demand revalidation.

```typescript
// next.config.ts
import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {default: sanity},
}

export default nextConfig
```

--------------------------------

### Using sanityFetchMetadata in Next.js metadata functions

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/live-helpers.md

Demonstrates fetching data for metadata generation using `sanityFetchMetadata`. This function is optimized for metadata contexts, omitting `stega` and automatically providing `'use cache'`. It's crucial to resolve `perspective` for correct content-release previews.

```ts
import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

export async function generateMetadata({params}: PageProps<'/[slug]'>) {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetchMetadata({query: pageQuery, params: {slug}, perspective})
}
```

--------------------------------

### Attempt to Import defineLive in Client Components

Source: https://github.com/sanity-io/next-sanity/blob/main/AGENTS.md

Illustrates an attempt to import and use `defineLive` from `next-sanity/live` within a Client Component. This operation must fail loudly at runtime.

```typescript
'use client'
import {defineLive} from 'next-sanity/live'

defineLive({client})
```

--------------------------------

### Anti-pattern: Hardcoding perspective in sanityFetchMetadata

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/live-helpers.md

Highlights the anti-pattern of hardcoding `perspective: 'published'` when using `sanityFetchMetadata`. This prevents correct content-release previewing.

```ts
import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

export async function generateMetadata({params}: PageProps<'/[slug]'>) {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetchMetadata({query: pageQuery, params: {slug}, perspective: 'published'}) // anti-pattern
}
```

--------------------------------

### Layout component with non-blocking dynamic params and Suspense

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/dynamic-segments.md

In a layout, use `<Suspense>` to fetch data dependent on dynamic `params` without blocking the streaming of child components. Pass the unawaited `params` promise into the `Suspense` boundary and await it within the component inside.

```tsx
// src/app/(website)/[slug]/layout.tsx

import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import {Suspense} from 'react'

export default function WebsiteLayout({children, params}: LayoutProps<'/[slug]'>) {
  return (
    <>
      {children}
      {/* The footer renders below the fold, no fallback needed */}
      <Suspense>
        <DynamicFooter
          // Don't await `params` here — pass the promise and await inside Suspense so `children` streams in parallel
          params={params}
        />
      </Suspense>
    </>
  )
}
async function DynamicFooter({params}: Pick<LayoutProps<'/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <Footer slug={slug} perspective={perspective} stega={stega} />
}
async function Footer({
  slug,
  perspective,
  stega,
}: Awaited<LayoutProps<'/[slug]'>['params']> & DynamicFetchOptions) {
  'use cache'
  const footerQuery = defineQuery(`*[_type == "footer" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({query: footerQuery, params: {slug}, perspective, stega})
  return <footer>{/* use `data` to render stuff */}</footer>
}
```

--------------------------------

### Generate Static Params for Dynamic Routes

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/three-layer-pattern.md

Fetches page slugs to enable static generation for dynamic routes. Requires `sanityFetchStaticParams` and `defineQuery`.

```tsx
// src/app/[slug]/page.tsx
import {sanityFetchStaticParams} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

export async function generateStaticParams() {
  const pageSlugsQuery = defineQuery(
    `*[_type == "page" && defined(slug.current)]{ "slug": slug.current}`,
  )
  const {data} = await sanityFetchStaticParams({query: pageSlugsQuery})
  return data
}
```

--------------------------------

### Using Suspense with Dynamic APIs in Next.js

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/three-layer-pattern.md

This snippet demonstrates how to integrate dynamic APIs like `searchParams` with `sanityFetch` using React's Suspense. It's crucial to wrap dynamic content in `<Suspense>` and avoid exporting an async function at the page level to prevent blocking renders. The `params` prop should be awaited within the suspense boundary.

```tsx
import {Suspense} from 'react'

// Do not export an async function here, to avoid accidentally blocking render while awaiting a dynamic API
export default function Page({params}: PageProps<'/[slug]'>) {
  return (
    <Suspense
      // not optional — no draftMode branch means a missing skeleton causes massive layout shift
      fallback={<PageFallback />}
    >
      <DynamicPage
        // do not await `params` here, it needs to be awaited in `<DynamicPage>` so the Suspense boundary works
        params={params}
      />
    </Suspense>
  )
}
```

--------------------------------

### Website Layout with Dynamic Footer

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/layouts.md

This layout component fetches footer data dynamically for draft mode and uses a static footer otherwise. It demonstrates Suspense for streaming data in draft mode.

```tsx
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

export default async function WebsiteLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <>
      {children}
      {isDraftMode ? (
        <Suspense fallback={<FooterFallback />}>
          <DynamicFooter />
        </Suspense>
      ) : (
        <Footer perspective="published" stega={false} />
      )}
    </>
  )
}
async function DynamicFooter() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <Footer perspective={perspective} stega={stega} />
}
async function Footer({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const footerQuery = defineQuery(`*[_type == "footer"][0]`)
  const {data} = await sanityFetch({query: footerQuery, perspective, stega})
  return <footer>{/* use `data` to render stuff */}</footer>
}
function FooterFallback() {
  return (
    <footer>
      <p>Loading footer...</p>
    </footer>
  )
}
```

--------------------------------

### Configure Custom Exports in tsdown.config.ts

Source: https://github.com/sanity-io/next-sanity/blob/main/AGENTS.md

This configuration in `tsdown.config.ts` wires condition-specific files into the published `./live` export, mapping them to specific conditions.

```typescript
pkg['./live'] = {
  'next-js': pkg['./live/conditions/next-js'],
  'react-server': pkg['./live/conditions/react-server'],
  'default': pkg['./live/conditions/default'],
}
```

--------------------------------

### Page component with partial generateStaticParams

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/dynamic-segments.md

Implement `generateStaticParams` to pre-render a subset of dynamic routes (e.g., 100 most recent). The page component can directly await `params` and fetch data without needing a `<Suspense>` wrapper due to the sibling `loading.tsx`.

```tsx
// src/app/[slug]/page.tsx
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

export async function generateStaticParams() {
  const pageSlugsQuery = defineQuery(
    `*[_type == "page" && defined(slug.current)] | order(_updatedAt desc) [0...100]{\"slug\": slug.current}`,
  )
  const {data} = await sanityFetchStaticParams({query: pageSlugsQuery})
  return data
}

// With sibling `loading.tsx`, skip the `<Suspense>` + `DynamicPage` indirection: await `params`
// and `getDynamicFetchOptions` directly inside `Page`.
export default async function Page({params}: PageProps<'/[slug]'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedPage slug={slug} perspective={perspective} stega={stega} />
}
async function CachedPage({
  slug,
  perspective,
  stega,
}: Awaited<PageProps<'/[slug]'>['params']> & DynamicFetchOptions) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug},
    perspective,
    stega,
  })
  return <article>{/* use `data` to render stuff */}</article>
}
```

--------------------------------

### Anti-pattern: Wrapping Children in a Single Cached Layout

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/layouts.md

This anti-pattern shows a layout that caches data, blocking the streaming of its children. Avoid this approach as it prevents the page content from streaming in independently, negatively impacting perceived performance. This is generally used to illustrate what not to do.

```tsx
export default async function WebsiteLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicWebsiteLayout>{children}</DynamicWebsiteLayout>
      </Suspense>
    )
  }
  return (
    <CachedWebsiteLayout perspective="published" stega={false}>
      {children}
    </CachedWebsiteLayout>
  )
}
async function CachedWebsiteLayout({
  children,
  perspective,
  stega,
}: {children: ReactNode} & DynamicFetchOptions) {
  'use cache'
  const settingsQuery = defineQuery(`*[_type == "settings"][0]`)
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})

  return (
    <>
      <Navbar data={data} />
      {children}
      <Footer data={data} />
    </>
  )
}
```

--------------------------------

### Import isCorsOriginError in Client Components

Source: https://github.com/sanity-io/next-sanity/blob/main/AGENTS.md

Demonstrates importing `isCorsOriginError` from `next-sanity/live` in a Client Component. This export is allowed in Client Components.

```typescript
'use client'
import {isCorsOriginError} from 'next-sanity/live'
```

--------------------------------

### Layer 1: Page Component - Handling Draft Mode

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/three-layer-pattern.md

The main page component that checks draft mode and conditionally renders either a cached or dynamic version of the page. It uses Suspense for draft mode to work correctly.

```tsx
// src/app/[slug]/page.tsx (continued)
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

export default async function Page({params}: PageProps<'/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DynamicPage
          // do not await `params` here, it needs to be awaited in `<DynamicPage>` so the Suspense boundary works
          params={params}
        />
      </Suspense>
    )
  }
  const {slug} = await params
  return <CachedPage slug={slug} perspective="published" stega={false} />
}
```

--------------------------------

### Layer 2: Dynamic Component - Resolving Dynamic APIs

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/three-layer-pattern.md

This component resolves dynamic APIs like `params`, `cookies()`, and `headers()` outside the cache boundary. It then passes plain props to the cached component.

```tsx
// src/app/[slug]/page.tsx (continued)
import {getDynamicFetchOptions} from '@/sanity/lib/live'

async function DynamicPage({params}: Pick<PageProps<'/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])

  return <CachedPage slug={slug} perspective={perspective} stega={stega} />
}
```

--------------------------------

### Layer 3: Cached Component - Data Fetching and Rendering

Source: https://github.com/sanity-io/next-sanity/blob/main/skills/sanity-live-cache-components/reference/three-layer-pattern.md

This component is marked with 'use cache' and receives only serializable props. It fetches data using `sanityFetch` with specified perspective and stega options.

```tsx
// src/app/[slug]/page.tsx (continued)
import {sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

async function CachedPage({
  slug,
  perspective,
  stega,
}: Awaited<PageProps<'/[slug]'>['params']> & DynamicFetchOptions) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug},
    perspective,
    stega,
  })
  return <article>{/* use `data` to render stuff */}</article>
}
```