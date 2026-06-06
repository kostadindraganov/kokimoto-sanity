/**
 * Sanity Studio configuration — two workspaces:
 *   1. "default"  — dataset: production  — full schema + all plugins
 *   2. "inbox"    — dataset: inbox        — contactSubmission only, read-only
 */

import {createAuthStore, defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineDocuments, defineLocations} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {media} from 'sanity-plugin-media'
import {colorInput} from '@sanity/color-input'
import {codeInput} from '@sanity/code-input'
import {dashboardTool, projectInfoWidget, sanityTutorialsWidget} from '@sanity/dashboard'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'

import {schemaTypes} from './src/schemaTypes'
import {structure, inboxStructure, filterHiddenTemplates} from './src/structure'

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// Auth is project-scoped — both workspaces must share a single auth store
// instance, otherwise the studio warns about divergent `auth` configurations.
const sharedAuth = createAuthStore({projectId, dataset: 'production'})

// ---------------------------------------------------------------------------
// Custom Vercel Deploy widget
// sanity-plugin-vercel-deploy only supports Sanity v3 — use approved fallback:
// a custom widget that POSTs to the Vercel Deploy Hook URL.
// ---------------------------------------------------------------------------

interface VercelDeployWidgetOptions {
  layout?: {width?: 'auto' | 'small' | 'medium' | 'large' | 'full'}
}

function vercelDeployWidget(options?: VercelDeployWidgetOptions) {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL

  return {
    name: 'vercel-deploy',
    layout: options?.layout ?? {width: 'medium'},
    component: function VercelDeployWidget() {
      // Inline React component — no JSX needed; use createElement via React global.
      // Sanity Studio ships React so we can import it.
      const React = require('react') as typeof import('react')
      const [status, setStatus] = React.useState<'idle' | 'deploying' | 'done' | 'error'>('idle')

      async function triggerDeploy() {
        if (!deployHookUrl) {
          setStatus('error')
          return
        }
        setStatus('deploying')
        try {
          await fetch(deployHookUrl, {method: 'POST'})
          setStatus('done')
          setTimeout(() => setStatus('idle'), 4000)
        } catch {
          setStatus('error')
          setTimeout(() => setStatus('idle'), 4000)
        }
      }

      const label =
        status === 'deploying'
          ? 'Deploying…'
          : status === 'done'
            ? 'Deployed!'
            : status === 'error'
              ? 'Error — check hook URL'
              : 'Deploy to Vercel'

      return React.createElement(
        'div',
        {
          style: {
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.75rem',
          },
        },
        React.createElement('h3', {style: {margin: 0, fontSize: '1rem'}}, 'Vercel Deploy'),
        React.createElement(
          'p',
          {style: {margin: 0, fontSize: '0.85rem', color: '#888'}},
          deployHookUrl
            ? 'Trigger a new production deployment on Vercel.'
            : 'Set VERCEL_DEPLOY_HOOK_URL to enable deployments.',
        ),
        React.createElement(
          'button',
          {
            onClick: triggerDeploy,
            disabled: status === 'deploying' || !deployHookUrl,
            style: {
              alignSelf: 'flex-start',
              padding: '0.5rem 1rem',
              background: status === 'done' ? '#0070f3' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: deployHookUrl && status === 'idle' ? 'pointer' : 'not-allowed',
              opacity: status === 'deploying' || !deployHookUrl ? 0.6 : 1,
            },
          },
          label,
        ),
      )
    },
  }
}

// ---------------------------------------------------------------------------
// contactSubmission schema type — imported individually for the inbox workspace
// ---------------------------------------------------------------------------

// We import the full schema array and extract contactSubmission from it so the
// inbox workspace gets only that type. The schema index is the single source of
// truth — we do NOT import the type definition directly to avoid drift.
// Cast to unknown[] first to avoid TypeScript narrowing on the current schema
// union names — the 1A agent will add contactSubmission to the schema index.
type AnySchemaType = (typeof schemaTypes)[number]
const allSchemaTypes = schemaTypes as AnySchemaType[]
const contactSubmissionType = (allSchemaTypes as any[]).find(
  (t: {name: string}) => t.name === 'contactSubmission',
) as AnySchemaType | undefined
const inboxSchemaTypes: AnySchemaType[] = contactSubmissionType ? [contactSubmissionType] : []

// Schema types for the default workspace — all types except contactSubmission
// (contact submissions are written only to the private inbox dataset).
const defaultSchemaTypes = (allSchemaTypes as any[]).filter(
  (t: {name: string}) => t.name !== 'contactSubmission',
) as AnySchemaType[]

// ---------------------------------------------------------------------------
// Workspace 1 — default (dataset: production)
// ---------------------------------------------------------------------------

const defaultWorkspace = defineConfig({
  name: 'default',
  title: 'Kokimoto Studio',
  basePath: '/studio',

  projectId,
  dataset: 'production',
  auth: sharedAuth,

  plugins: [
    structureTool({structure}),

    presentationTool({
      previewUrl: {
        origin: previewUrl,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "homePage"`,
          },
          {
            route: '/portfolio',
            filter: `_type == "portfolioPage"`,
          },
          {
            route: '/portfolio/:slug',
            filter: `_type == "project" && slug.current == $slug`,
          },
          {
            route: '/blog',
            filter: `_type == "blogPage"`,
          },
          {
            route: '/blog/:slug',
            filter: `_type == "post" && slug.current == $slug`,
          },
          {
            route: '/about',
            filter: `_type == "aboutPage"`,
          },
          {
            route: '/contact',
            filter: `_type == "contactPage"`,
          },
        ]),

        locations: {
          project: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Project',
                  href: `/portfolio/${doc?.slug}`,
                },
              ],
            }),
          }),

          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Post',
                  href: `/blog/${doc?.slug}`,
                },
              ],
            }),
          }),

          tag: defineLocations({
            select: {},
            resolve: () => ({
              locations: [
                {title: 'Portfolio', href: '/portfolio'},
                {title: 'Blog', href: '/blog'},
              ],
            }),
          }),

          category: defineLocations({
            select: {},
            resolve: () => ({
              locations: [{title: 'Blog', href: '/blog'}],
            }),
          }),

          siteSettings: defineLocations({
            select: {},
            resolve: () => ({
              locations: [
                {title: 'Home', href: '/'},
                {title: 'Portfolio', href: '/portfolio'},
                {title: 'Blog', href: '/blog'},
                {title: 'About', href: '/about'},
                {title: 'Contact', href: '/contact'},
              ],
              tone: 'positive' as const,
              message: 'Used on all pages',
            }),
          }),

          navigation: defineLocations({
            select: {},
            resolve: () => ({
              locations: [
                {title: 'Home', href: '/'},
                {title: 'Portfolio', href: '/portfolio'},
                {title: 'Blog', href: '/blog'},
                {title: 'About', href: '/about'},
                {title: 'Contact', href: '/contact'},
              ],
              tone: 'positive' as const,
              message: 'Used on all pages',
            }),
          }),
        },
      },
    }),

    media(),
    colorInput(),
    codeInput(),

    dashboardTool({
      widgets: [
        vercelDeployWidget({layout: {width: 'medium'}}),
        projectInfoWidget({layout: {width: 'small'}}),
        sanityTutorialsWidget({layout: {width: 'medium'}}),
      ],
    }),

    assist(),
    unsplashImageAsset(),
    visionTool(),
  ],

  schema: {
    types: defaultSchemaTypes,
    // Hide singletons + contactSubmission from "Create new document" menu
    templates: (prev) => prev.filter(filterHiddenTemplates),
  },

  document: {
    // Disable NewDocumentAction and DeleteAction for singletons + contactSubmission
    actions: (prev, {schemaType}) => {
      const lockedTypes = new Set([
        'siteSettings',
        'navigation',
        'homePage',
        'aboutPage',
        'portfolioPage',
        'blogPage',
        'contactPage',
        'contactSubmission',
      ])

      if (lockedTypes.has(schemaType)) {
        return prev.filter(
          ({action}) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish',
        )
      }

      return prev
    },
  },
})

// ---------------------------------------------------------------------------
// Workspace 2 — inbox (dataset: inbox, private)
// ---------------------------------------------------------------------------

const inboxWorkspace = defineConfig({
  name: 'inbox',
  title: 'Inbox',
  basePath: '/inbox',

  projectId,
  dataset: 'inbox',
  auth: sharedAuth,

  plugins: [
    structureTool({structure: inboxStructure}),
  ],

  schema: {
    types: inboxSchemaTypes,
    // No templates — creation is disabled for contactSubmission
    templates: () => [],
  },

  document: {
    // Disable all create/delete actions for the inbox workspace
    actions: (prev) =>
      prev.filter(({action}) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish'),
  },
})

// ---------------------------------------------------------------------------
// Export — array of two workspaces (not a single config)
// ---------------------------------------------------------------------------

export default [defaultWorkspace, inboxWorkspace]
