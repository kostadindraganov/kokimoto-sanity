### Prompt AI Client for Setup Skill

Source: https://www.sanity.io/docs/ai/agent-context

Initiate the setup process by prompting your AI client to use the `create-agent-with-sanity-context` skill. This skill helps configure Agent Context, build an example agent, and optionally add a frontend UI.

```text
Use the create-agent-with-sanity-context skill to help me build an agent in this project.
```

--------------------------------

### Install Main Sanity AI Agent Context Skill

Source: https://www.sanity.io/docs/ai/agent-context

Installs only the main setup skill for scaffolding an AI agent with Sanity context.

```bash
npx skills add sanity-io/agent-context/create-agent-with-sanity-context
```

--------------------------------

### Start Server on a Specific Port

Source: https://www.sanity.io/docs/cli-reference/start

This command starts the preview server on a custom TCP port. Use this if the default port is already in use or if you need to specify a particular port for your setup.

```sh
sanity start --port=1942
```

--------------------------------

### Install Agent Context Skill

Source: https://www.sanity.io/docs/ai/agent-context

Use this command to add the Agent Context skill to your project, which guides you through the setup process.

```bash
npx skills add sanity-io/agent-context --all
```

--------------------------------

### Install Agent Context Skills

Source: https://www.sanity.io/docs/ai/skills

Install specific skills for Agent Context to guide setup of the Studio plugin, building AI agents, writing system prompts, and tuning agent instructions.

```sh
npx skills add sanity-io/agent-context
```

--------------------------------

### Welcome Event Example

Source: https://www.sanity.io/docs/http-reference/listen

An example of a 'welcome' SSE message.

```APIDOC
## Welcome Event

### Description
Sent when a new SSE connection is established.

### Event Type
`welcome`

### Data Example
```json
{
  "listenerName": "Ua6BR3GwQ14cnZXrgwCdsF"
}
```
```

--------------------------------

### Start CLI Command

Source: https://www.sanity.io/docs/cli-reference/start

Starts a server to preview a production build. You can specify an output directory, host, and port.

```APIDOC
## sanity start

### Description
Starts a server to preview a production build.

### Usage
```sh
sanit start [OUTPUTDIR]
```

### Arguments
#### [OUTPUTDIR]
- **OUTPUTDIR** (string) - Optional - Output directory for the build.

### Flags
#### --host=<HOST>
- **--host** (string) - The local network interface at which to listen.

#### --port=<PORT>
- **--port** (number) - TCP port to start server on.

### Examples
#### Basic Usage
```sh
sanit start --host=0.0.0.0
sanit start --port=1942
sanit start some/build-output-dir
```
```

--------------------------------

### Start Dev Server on Different Port

Source: https://www.sanity.io/docs/app-sdk/sdk-quickstart

If port 3333 is in use, you can start the development server on an alternative port by passing the --port flag. This example starts the server on port 3334.

```sh
npm run dev -- --port 3334
```

--------------------------------

### Start Server with Custom Host

Source: https://www.sanity.io/docs/cli-reference/start

Use this command to start the preview server and listen on all network interfaces. This is useful for accessing the preview from other devices on the same network.

```sh
sanity start --host=0.0.0.0
```

--------------------------------

### Full example: Create, add versions, and schedule a release

Source: https://www.sanity.io/docs/apis-and-sdks/js-client-releases

This comprehensive example demonstrates the complete workflow: creating a release, adding/unpublishing document versions, verifying contents, and scheduling the release for a future publication time.

```typescript
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'your-project-id',
  dataset: '<your-dataset>',
  apiVersion: '2026-03-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

// 1. Create a release
const {releaseId} = await client.releases.create({
  metadata: {
    title: 'Spring product launch',
    releaseType: 'scheduled',
  },
})

// 2. Add a new version of an existing product
await client.createVersion({
  releaseId,
  publishedId: 'product-123',
  document: {
    _type: 'product',
    title: 'Updated spring jacket',
    price: 89.99,
  },
})

// 3. Mark an old product for removal
await client.unpublishVersion({
  releaseId,
  publishedId: 'product-old-winter-coat',
})

// 4. Verify the release contents
const documents = await client.releases.getDocuments({releaseId})
console.log(`Release contains ${documents.length} document(s)`)

// 5. Schedule the release
await client.releases.schedule({
  releaseId,
  publishAt: '2026-04-01T09:00:00.000Z',
})

console.log('Release scheduled for April 1')
```

--------------------------------

### Translate Action with Style Guide and Target Overrides

Source: https://www.sanity.io/docs/agent-actions/targets-paths

Example of using the 'translate' action with a global style guide and specific style guides for target fields.

```APIDOC
## `translate` with Style Guide and Target Overrides

### Description
This example demonstrates the `translate` action, showcasing the use of a global `styleGuide` and `styleGuideParams`, as well as per-path `styleGuide` overrides for specific target fields.

### Method
`client.agent.action.translate`

### Parameters
- `schemaId` (string) - Required - The schema ID to use.
- `documentId` (string) - Required - The ID of the document to translate.
- `fromLanguage` (object) - Required - The source language.
  - `id` (string) - Required - Language ID (e.g., 'en-GB').
  - `title` (string) - Required - Language title (e.g., 'English').
- `toLanguage` (object) - Required - The target language.
  - `id` (string) - Required - Language ID (e.g., 'no-NB').
  - `title` (string) - Required - Language title (e.g., 'Norwegian Bokmål').
- `languageFieldPath` (array of strings) - Required - Path to the language field in the document.
- `styleGuide` (string) - Optional - The global style guide to apply.
- `styleGuideParams` (object) - Optional - Parameters for the global style guide.
  - `paramName` (object) - Example parameter.
    - `type` (string) - Required - Type of the parameter (e.g., 'field').
    - `path` (array of strings) - Required - Path to the parameter value.
- `target` (array of objects) - Required - An array of target configurations.
  - `path` (string or array of strings) - Required - The path to the field to translate.
  - `styleGuide` (string) - Optional - A specific style guide for this target field, overriding the global one.

### Request Example
```javascript
await client.agent.action.translate({
  schemaId: 'default-schema',
  documentId: 'drafts.id', 
  
  fromLanguage: { id: 'en-GB',title: 'English' },
  toLanguage: { id: 'no-NB', title: 'Norwegian Bokmål' },
  
  languageFieldPath: ['language'],
  
  styleGuide: 'Follow the vibe when translating: $vibe',
  styleGuideParams: {
    vibe: { type: 'field', path: ['vibe']}
  },
  target: [
    {path: 'title'}, // Uses the default style guide
    {path: 'description', styleGuide: 'Only lowercase.' }, // Uses its own style guide
  ]
})
```
```

--------------------------------

### InitialValues Example

Source: https://www.sanity.io/docs/http-reference/agent-actions

Example of setting initial values for a document, including a reference to another document.

```json
{
  "author": {
    "_ref": "abc123456",
    "_type": "reference"
  }
}
```

--------------------------------

### Fresh Install Sanity Studio with bun

Source: https://www.sanity.io/docs/changelog/047732d0-cce5-46f5-a897-cfd1008ac49f

Use this command to install and initiate a new Sanity Studio project without a global Sanity CLI installation.

```bash
bun create sanity@latest
```

--------------------------------

### Get Dataset Grants Example

Source: https://www.sanity.io/docs/http-reference/roles

Example JSON response for retrieving dataset grants. It details filter modes, grants with parameters, and configuration filters.

```json
{
  "sanity.document.filter.mode": [
    {
      "grants": [
        {
          "name": "mode",
          "params": {
            "mode": "publish",
            "history": true,
            "datasetPolicyName": "default"
          }
        }
      ],
      "config": {
        "filter": "_id in path(\"**\")"
      }
    }
  ]
}
```

--------------------------------

### Real-time updates with the Live Content API

Source: https://www.sanity.io/docs/apis-and-sdks/js-client-realtime

This example demonstrates fetching content, storing sync tags, and refetching content when a matching live event arrives. It uses `client.fetch()` with `filterResponse: false` to get sync tags and `client.live.events()` to subscribe to updates.

```APIDOC
## Real-time updates with the Live Content API

### Description
This example demonstrates fetching content, storing sync tags, and refetching content when a matching live event arrives. It uses `client.fetch()` with `filterResponse: false` to get sync tags and `client.live.events()` to subscribe to updates.

### Method
`client.fetch()` and `client.live.events()`

### Parameters for `client.fetch()`
#### Request Body
- `query` (string) - The GROQ query to fetch content.
- `params` (object) - Parameters for the query.
- `options` (object) - Fetch options.
  - `filterResponse` (boolean) - Required: `false` to include `syncTags`.
  - `lastLiveEventId` (string) - Optional: The ID of the last live event received.

### Parameters for `client.live.events()`
#### Request Body
- `options` (object) - Subscription options.
  - `includeDrafts` (boolean) - Optional: Set to `true` to receive updates for draft content.

### Event Types from `client.live.events()`
- `message`: Carries sync tags that you compare against your stored tags. If any match, your content has changed.
- `restart`: The event stream has reset. Refetch all content without passing a `lastLiveEventId`.
- `welcome`: Connection established successfully.
- `reconnect`: The client reconnected after a temporary disconnection.
- `goaway`: The connection was rejected. Consider falling back to polling.

### Request Example (Initial Fetch and Subscription)
```typescript
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'your-dataset-name',
  apiVersion: '2026-03-01',
  useCdn: true,
})

const query = '*[_type == "post" && slug.current == $slug][0]'
const params = {slug: 'hello-world'}

// Store sync tags from the initial fetch
let syncTags: string[] = []

async function render(lastLiveEventId?: string) {
  const response = await client.fetch(query, params, {
    // Required: returns the full response object including syncTags
    filterResponse: false,
    lastLiveEventId,
  })

  syncTags = response.syncTags
  const data = response.result
  console.log(data)
}

// Initial fetch
render()

// Subscribe to live events
const subscription = client.live.events().subscribe({
  next: (event) => {
    if (
      event.type === 'message' &&
      event.tags.some((tag) => syncTags.includes(tag))
    ) {
      // A matching tag means our content changed, so refetch
      render(event.id)
    }

    if (event.type === 'restart') {
      // Restart events mean we should refetch without an event ID
      render()
    }
  },
  error: (err) => {
    console.error('Live event stream error:', err)
  },
})

// Unsubscribe when no longer needed
// subscription.unsubscribe()
```

### Response Example (Data from `client.fetch()`)
```json
{
  "syncTags": ["tag1", "tag2"],
  "result": {
    "_id": "some-id",
    "_createdAt": "2023-01-01T10:00:00Z",
    "title": "Hello World",
    "slug": {"current": "hello-world"}
  }
}
```
```

--------------------------------

### Start Local Preview Server with Custom Host

Source: https://www.sanity.io/docs/cli-reference/preview

Use this command to start a local preview server listening on all network interfaces. This is useful for accessing the preview from other devices on the same network.

```sh
sanity preview --host=0.0.0.0
```

--------------------------------

### Full example: create and schedule a release

Source: https://www.sanity.io/docs/apis-and-sdks/js-client-releases

This comprehensive example demonstrates a complete workflow: creating a release, adding document versions, marking a document for unpublishing, verifying release contents, and scheduling the release for publication.

```APIDOC
## Full example: create and schedule a release

Here's a complete workflow that creates a release, adds document versions, and schedules it to publish:

```typescript
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'your-project-id',
  dataset: '<your-dataset>',
  apiVersion: '2026-03-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

// 1. Create a release
const {releaseId} = await client.releases.create({
  metadata: {
    title: 'Spring product launch',
    releaseType: 'scheduled',
  },
})

// 2. Add a new version of an existing product
await client.createVersion({
  releaseId,
  publishedId: 'product-123',
  document: {
    _type: 'product',
    title: 'Updated spring jacket',
    price: 89.99,
  },
})

// 3. Mark an old product for removal
await client.unpublishVersion({
  releaseId,
  publishedId: 'product-old-winter-coat',
})

// 4. Verify the release contents
const documents = await client.releases.getDocuments({releaseId})
console.log(`Release contains ${documents.length} document(s)`)

// 5. Schedule the release
await client.releases.schedule({
  releaseId,
  publishAt: '2026-04-01T09:00:00.000Z',
})

console.log('Release scheduled for April 1')
```
```

--------------------------------

### Start Server with Output Directory

Source: https://www.sanity.io/docs/cli-reference/start

Specify a custom directory for the production build output when starting the preview server. This allows you to preview builds located in non-default paths.

```sh
sanity start some/build-output-dir
```

--------------------------------

### Install Node.js via Homebrew on macOS

Source: https://www.sanity.io/docs/help/a5f6caba-53c9-4a9f-96ef-1bd1ae8f5c10

Use this command to install Node.js if you are on macOS and have Homebrew installed. Ensure Homebrew is set up first by following their official guide.

```bash
brew install node
```

--------------------------------

### Sanity CLI Init Flags: Bare and Env

Source: https://www.sanity.io/docs/changelog/d443f915-7c84-4070-8d9a-7ee0c187e740?from=%2Fdocs%2Fstudio%2Fdevelopment%2Fchangelog&fromId=4971976f-fc90-4fae-aea3-57240226c2cb&fromTitle=Development

These flags for `npm create sanity` and `sanity init` offer flexible project setup. `--bare` skips Studio installation for Content Lake-only setups, while `--env [path]` automatically creates environment files based on detected frameworks.

```bash
npm create sanity -- --bare
```

```bash
sanity init --bare
```

```bash
npm create sanity -- --env .env.development.local
```

```bash
sanity init --env .env.production
```

--------------------------------

### Fresh Install Sanity Studio with pnpm

Source: https://www.sanity.io/docs/changelog/047732d0-cce5-46f5-a897-cfd1008ac49f

Use this command to install and initiate a new Sanity Studio project without a global Sanity CLI installation.

```bash
pnpm create sanity@latest
```

--------------------------------

### Example CLI Output for Configuration

Source: https://www.sanity.io/docs/blueprints/blueprint-action

This is an example of the output you will receive after running the `sanity blueprints config` command, showing your project and deployment IDs.

```text
Current configuration:
  Sanity Project: <project_id>
  Deployment ID:  <stack_id>
```

--------------------------------

### Install React Compiler Babel and ESLint Plugins (bun)

Source: https://www.sanity.io/docs/help/react-compiler

Install the necessary Babel and ESLint plugins for the React Compiler using bun.

```bash
bun add --dev babel-plugin-react-compiler eslint-plugin-react-hooks
```

--------------------------------

### Install Dependencies for Sanity Functions

Source: https://www.sanity.io/docs/developer-guides/email-marketing-campaigns-powered-by-sanity-functions-and-klaviyo

Install necessary packages for the 'create' and 'send' functions. Ensure `@sanity/client` is installed in both.

```bash
pnpm install @sanity/client @portabletext/to-html
```

--------------------------------

### TranslateTarget Configuration Example

Source: https://www.sanity.io/docs/http-reference/agent-actions

Example of configuring a TranslateTarget, specifying path, operation, and nested includes.

```json
{
  "path": "body",
  "operation": "append",
  "maxPathDepth": 3,
  "include": {
    "path": "sections",
    "types": {
      "include": ["text", "image"]
    }
  }
}
```

--------------------------------

### Run Visual Editing Demo Server

Source: https://www.sanity.io/docs/visual-editing/build-a-visual-editing-integration

Start the demo server for the visual editing integration. This command should be run from the visual-editing-demo directory.

```bash
npx tsx server.ts
```

--------------------------------

### Initialize New App with App SDK Quickstart Template

Source: https://www.sanity.io/docs/app-sdk/installation-and-development

Use this command to bootstrap a new React application with the necessary dependencies and boilerplate preconfigured for the App SDK.

```sh
npx sanity@latest init --template app-quickstart
```

--------------------------------

### Install Dependencies for Sanity Blueprint

Source: https://www.sanity.io/docs/functions/asset-function-quickstart

After initializing the blueprint, run this command to install the required dependencies for your project.

```sh
npm install
```

--------------------------------

### Install dependencies for YouTube embed preview

Source: https://www.sanity.io/docs/developer-guides/portable-text-how-to-add-a-custom-youtube-embed-block

Install react-player and @sanity/ui to enable custom previews for YouTube embeds.

```sh
npm install react-player @sanity/ui
```

--------------------------------

### Install @sanity/blueprints with bun

Source: https://www.sanity.io/docs/changelog/b3c69b01-001b-496e-955d-a30517bb6ce1?from=%2Fdocs%2Fblueprints%2Fblueprint-config%2Fchangelog&fromId=ef6ca90d-6d76-4790-a50c-50188a934bdb&fromTitle=Blueprint+configuration+reference

Install the latest version of the `@sanity/blueprints` library using bun. Ensure you are in the directory containing your blueprint configuration file.

```bash
# In the directory housing your sanity.blueprint.ts/js file
bun add @sanity/blueprints@latest
```

--------------------------------

### Fresh Install Sanity Studio with npm

Source: https://www.sanity.io/docs/changelog/047732d0-cce5-46f5-a897-cfd1008ac49f

Use this command to install and initiate a new Sanity Studio project without a global Sanity CLI installation.

```bash
npm create sanity@latest
```

--------------------------------

### Fresh Install Sanity Studio with yarn

Source: https://www.sanity.io/docs/changelog/047732d0-cce5-46f5-a897-cfd1008ac49f

Use this command to install and initiate a new Sanity Studio project without a global Sanity CLI installation.

```bash
yarn create sanity@latest
```

--------------------------------

### Sanity Client Configuration

Source: https://www.sanity.io/docs/agent-actions/agent-actions-image-generation

Configure your Sanity client with project ID, dataset, API version, and editor token. This setup is required for all Agent Actions examples.

```javascript
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: '<project-id>',
  dataset: '<datset-name>',
  apiVersion: 'vX',
  token: '<editor-token>'
})
```

--------------------------------

### Install Sanity Studio Dependencies

Source: https://www.sanity.io/docs/cli-reference/install

Use this command to install default dependencies for a Sanity Studio project. No arguments are needed for a basic installation.

```bash
sanity install
```

--------------------------------

### Install next-sanity and @sanity/image-url

Source: https://www.sanity.io/docs/nextjs/next-sanity-image-component

Install the necessary libraries for integrating Sanity images with Next.js.

```sh
npx install next-sanity @sanity/image-url
```

--------------------------------

### Shopify Product Document Example

Source: https://www.sanity.io/docs/apis-and-sdks/sanity-connect-for-shopify-reference

An example of a product document synced from Shopify. It includes details like pricing, options, and references to its variants.

```json
{
  "_createdAt": "2022-05-18T07:45:26Z",
  "_id": "shopifyProduct-7696133062907",
  "_rev": "sERZ3ZJ9MtNiP4BmT5zftt",
  "_type": "product",
  "_updatedAt": "2022-08-31T21:41:10Z",
  "body": [],
  "store": {
    "createdAt": "2022-05-12T17:39:51+01:00",
    "descriptionHtml": "",
    "gid": "gid://shopify/Product/7696133062907",
    "id": 7696133062907,
    "isDeleted": false,
    "options": [
      {
        "_key": "Color",
        "_type": "option",
        "name": "Color",
        "values": [
          "Blue",
          "Ecru",
          "Pink"
        ]
      }
    ],
    "previewImageUrl": "https://cdn.shopify.com/s/files/1/0639/3285/8619/products/Green_1.jpg?v=1655598944",
    "priceRange": {
      "maxVariantPrice": 25.5,
      "minVariantPrice": 25
    },
    "productType": "",
    "slug": {
      "_type": "slug",
      "current": "soap-dish"
    },
    "status": "active",
    "tags": "",
    "title": "AUTOGRAF Soap Dish",
    "variants": [
      {
        "_key": "c8b492e1-3c24-527d-bffd-accc634177c7",
        "_ref": "shopifyProductVariant-43068621422843",
        "_type": "reference",
        "_weak": true
      },
      {
        "_key": "9128c62c-f887-594c-b9b8-ddaaf850ce84",
        "_ref": "shopifyProductVariant-43068621455611",
        "_type": "reference",
        "_weak": true
      },
      {
        "_key": "5d861cdf-bcfe-5781-81dd-d62db159442b",
        "_ref": "shopifyProductVariant-43068621488379",
        "_type": "reference",
        "_weak": true
      }
    ],
    "vendor": "Lucy Holdberg"
  }
}
```

--------------------------------

### Install React Compiler Babel and ESLint Plugins (npm)

Source: https://www.sanity.io/docs/help/react-compiler

Install the necessary Babel and ESLint plugins for the React Compiler using npm.

```bash
npm install --save-dev babel-plugin-react-compiler eslint-plugin-react-hooks
```

--------------------------------

### Welcome SSEMessage Example

Source: https://www.sanity.io/docs/http-reference/listen

Represents a welcome message from the server, often containing listener information.

```json
{
  "name": "welcome",
  "value": {
    "event": "welcome",
    "data": {
      "listenerName": "Ua6BR3GwQ14cnZXrgwCdsF"
    }
  }
}
```

--------------------------------

### Install @sanity/core-loader and @sanity/client

Source: https://www.sanity.io/docs/visual-editing/live-preview-content-updates

Install the necessary packages for core loader and client functionality.

```sh
npm install @sanity/core-loader @sanity/client
```

--------------------------------

### Asynchronous Initial Value with Axios

Source: https://www.sanity.io/docs/initial-value-templates

Fetch data from an API to set an initial value for a field. This example uses `axios` to get the first pet's name.

```javascript
import axios from 'axios'

export default {
  // ...
  initialValue: async () => {
    const response = await axios.get('https://api.sanity.io/pets')
    return {favoritePetName: response.data[0].name}
  }
}
```

--------------------------------

### Navigate to Project Directory

Source: https://www.sanity.io/docs/app-sdk/sdk-quickstart

Change into the newly created project directory to begin development.

```sh
cd my-cool-project
```

--------------------------------

### Start Astro Development Server

Source: https://www.sanity.io/docs/astro-quickstart/displaying-content-in-an-astro-front-end

Run the development server to preview your Astro application locally.

```sh
# your-project-folder/astro-hello-world
npm run dev
```

--------------------------------

### Initialize Sanity Studio with Shopify Template

Source: https://www.sanity.io/docs/apis-and-sdks/sanity-connect-for-shopify

Install a production-ready reference studio pre-configured for Shopify. Replace `PROJECT_ID` and `DATASET_NAME` with your project's specific values.

```sh
npx @sanity/cli init --template shopify --project PROJECT_ID --dataset DATASET_NAME
```

--------------------------------

### Example ResourceType

Source: https://www.sanity.io/docs/http-reference/access-api

This example shows a valid string value for the ResourceType property.

```json
"project"
```

--------------------------------

### Get Dataset ACL Example

Source: https://www.sanity.io/docs/http-reference/roles

Example JSON response for retrieving a dataset's access control list (ACL). It shows filter rules and associated grants.

```json
[
  {
    "filter": "_id in path(\"**\")",
    "grants": [
      "read",
      "update",
      "create",
      "history"
    ]
  }
]
```

--------------------------------

### Install @sanity/client

Source: https://www.sanity.io/docs/apis-and-sdks/js-client-getting-started

Command to install the Sanity client library using npm.

```shell
npm install @sanity/client
```

--------------------------------

### Install RxJS and Sanity ID Utils

Source: https://www.sanity.io/docs/visual-editing/presentation-resolver-api

Install necessary dependencies for handling observables and draft IDs.

```sh
npm install rxjs @sanity/id-utils
```

--------------------------------

### useTools

Source: https://www.sanity.io/docs/studio/studio-react-hooks

Returns an array listing all installed tools.

```APIDOC
## useTools

### Description
Returns an array listing all installed tools in the Studio.
```

--------------------------------

### Install Packages

Source: https://www.sanity.io/docs/cli-reference/install

The `sanity install` command allows you to install specified packages into your Sanity Studio project. You can install one or multiple packages at once.

```APIDOC
## sanity install [PACKAGES]

### Description
Install dependencies for the Sanity Studio project.

### Arguments
- **[PACKAGES]** (string) - Packages to install. This can be one or more package names.

### Usage Examples

Install default dependencies:
```sh
sanit install
```

Install a specific package:
```sh
sanit install @sanity/vision
```

Install multiple packages:
```sh
sanit install some-package another-package
```
```

--------------------------------

### Configure Sanity MCP Server using bunx

Source: https://www.sanity.io/docs/changelog/e75b1d45-03be-4fa6-994b-248750b3fa9f?category=integrations&product=5ba66ea7-d920-4b40-a2eb-8dccb0e31360%2C63a3933f-c596-483c-898b-8c9395566264%2C40e31675-4154-4d2f-ad93-90e00bad82a2%2C926becda-7e17-4e3a-9933-6b1b6d1c4eca%2C0292f29c-2f77-4126-ba47-d45ab773f368%2C2b0da051-9928-45b0-88ca-4bbe45178e7a%2C85affff6-043c-4f5a-bc24-f77ca6b72bf6%2C3c0380bb-b03e-44cb-b717-3aee15995c15%2Caa77521a-5888-4d2a-be7e-88f5c29ab545%2Cd7072523-7052-47c4-ab84-051a2691278d%2C1044e8ff-a741-467c-a33f-0be21de6e6e6%2Ce7fa62bc-7715-4c49-962e-08c06efb4ca1%2C4e72ec72-7127-441a-9031-a5a3b684c98e%2Cb74708a1-00a2-4f2c-8556-e366267f34e3%2Cdfd812db-074c-4f82-a992-19b409262687%2Cb88bb401-c9a1-4a8f-81d9-65ba5b9bce41

Use this command to automatically configure the Sanity MCP server for common AI-powered editors. This is the quickest way to get started.

```bash
bunx sanity@latest mcp configure
```

--------------------------------

### Client Implementation

Source: https://www.sanity.io/docs/agent-actions/translate-cheatsheet

Example of how to create and configure the Sanity client. Ensure your client is named 'client' or update the examples accordingly.

```typescript
import {
  createClient
} from "@sanity/client";

export const client = createClient({
  projectId: '<project-id>',
  dataset: '<dataset-name>',
  useCdn: 'true',
  apiVersion: 'vX',
  token: '<read-write-token>'
})
```

--------------------------------

### Install Visual Editing Dependencies

Source: https://www.sanity.io/docs/visual-editing/build-a-visual-editing-integration

Install the necessary packages for visual editing overlays and real-time content updates. Ensure React and ReactDOM are installed as they are required peer dependencies.

```sh
npm install @sanity/visual-editing
```

```sh
npm install react react-dom
```

--------------------------------

### Field-Level Translation Schema Example

Source: https://www.sanity.io/docs/studio/ai-assist-content-translation

Example schema structure for field-level translations where different language variants are stored within the same document using objects. This setup is compatible with the Internationalized Array plugin.

```typescript
{
	
type: 'document',
name: 'article',
fields: [
	{
		type: 'object',
name: 'localeTitle',
fields: [
		{type: 'string', name: 'en', title: 'English'},
		{type: 'string', name: 'de', title: 'German'},
	]
	}
]
}
```

--------------------------------

### Start the Functions Development Playground (NPM)

Source: https://www.sanity.io/docs/functions/functions-local-testing

Use this command to launch the interactive development playground for testing Sanity Functions. It starts a local server for real-time testing.

```bash
npx sanity@latest functions dev
```

--------------------------------

### Install Sanity UI Beta

Source: https://www.sanity.io/docs/changelog/f75445eb-3c3e-4d1e-986d-71a61223aa83

If you use Sanity UI for Studio customization, install the beta version of the new major release.

```bash
npm install @sanity/ui@beta
```

```bash
pnpm add @sanity/ui@beta
```

```bash
yarn add @sanity/ui@beta
```

```bash
bun add @sanity/ui@beta
```

--------------------------------

### Start Local Preview Server with Output Directory

Source: https://www.sanity.io/docs/cli-reference/preview

Use this command to specify a custom output directory for the production build that the preview server will serve. If not specified, it defaults to the current directory.

```sh
sanity preview some/build-output-dir
```

--------------------------------

### Paginate Book Results

Source: https://www.sanity.io/docs/content-lake/graphql

Use 'limit' and 'offset' arguments to implement pagination, controlling the number of results returned and the starting point of the result set. This example fetches the second set of 10 books.

```graphql
{
  allBook(limit: 10, offset: 10) {
    title
  }
}
```

--------------------------------

### Get Role Example

Source: https://www.sanity.io/docs/http-reference/roles

This JSON object shows the structure of a role retrieved from the Sanity API, including its name, title, description, and grants.

```json
{
  "name": "administrator",
  "title": "Administrator",
  "description": "Administrate projects",
  "isCustom": false,
  "projectId": "3do82whm",
  "grants": {
    "sanity.document.filter.mode": [
      {
        "grants": [
          {
            "name": "mode",
            "params": {
              "mode": "publish",
              "history": true,
              "datasetPolicyName": "default"
            }
          }
        ],
        "config": {
          "filter": "_id in path(\"**\")"
        }
      }
    ]
  }
}
```

--------------------------------

### Initialize Project with Default Dataset

Source: https://www.sanity.io/docs/cli-reference/init

Initializes a new project and sets up a public dataset named "production".

```sh
sanity init --dataset-default
```

--------------------------------

### Welcome SSE Event

Source: https://www.sanity.io/docs/http-reference/listen

This is an example of the initial 'welcome' event received when establishing a connection to the Listen API. It includes a listener name.

```json
{
  "event": "welcome",
  "data": {
    "listenerName": "Ua6BR3GwQ14cnZXrgwCdsF"
  }
}
```

--------------------------------

### Define Deprecated Document Type

Source: https://www.sanity.io/docs/changelog/5a99e214-6088-4d10-a0b7-14ca7c555c01?from=%2Fdocs%2Fcontent-lake%2Fgraphql%2Fchangelog&fromId=83e0a089-eabb-4fdc-8bd1-3bea6c607a70&fromTitle=GraphQL

Example of marking a document type as deprecated with a reason. This helps guide users towards alternative document types.

```javascript
export const deprecatedDocument = defineType({
  name: 'deprecatedDocument',
  title: 'Deprecated Document',
  type: 'document',
  deprecated: {
    reason: 'Use the Author document type instead',
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      deprecated: {
        reason: 'This field was used in a legacy system and is no longer used.',
      },
    }),
  ],
})
```

--------------------------------

### Configuring Listener Options

Source: https://www.sanity.io/docs/apis-and-sdks/js-client-realtime

This example demonstrates advanced configuration options for `client.listen()`, including including previous revisions, mutations, controlling result inclusion, visibility, event types, and adding tags.

```APIDOC
### Listener options

The third argument to `listen()` accepts several options that control what data each event includes.

```typescript
const subscription = client.listen(
  '*[_type == "post"]',
  {},
  {
    // Include the document before the mutation was applied
    includePreviousRevision: true,

    // Include the raw mutations that caused the change
    includeMutations: true,

    // Set to false to omit the result document (saves bandwidth)
    includeResult: true,

    // Control visibility: 'query' (default), 'sync', or 'async'
    visibility: 'query',

    // Filter which event types to receive
    events: ['welcome', 'mutation', 'reconnect'],

    // Tag for request logs
    tag: 'post-listener',
  }
).subscribe((update) => {
  if (update.previous) {
    console.log('Before:', update.previous.title)
    console.log('After:', update.result.title)
  }
})
```

Setting `includeResult: false` reduces bandwidth when you only need to know that a change occurred. Combining `includePreviousRevision: true` with `includeMutations: true` gives you a complete before-and-after picture along with the specific operations that were applied.
```

--------------------------------

### Install Multiple Sanity Packages

Source: https://www.sanity.io/docs/cli-reference/install

Install multiple packages simultaneously by listing them as space-separated arguments after the `sanity install` command.

```bash
sanity install some-package another-package
```

--------------------------------

### Initialize New Astro Project

Source: https://www.sanity.io/docs/developer-guides/sanity-astro-blog

Use this command to create a new Astro project. Select 'A basic, minimal starter' when prompted.

```sh
npm create astro@latest
```

--------------------------------

### IncludeInstruction Example

Source: https://www.sanity.io/docs/http-reference/agent-actions

An example of an IncludeInstruction that references top-level instruction parameters using the $variable syntax. This instruction is used to describe the content for included targets.

```json
"Update the $title based on the $backgroundContext.\n"

```

--------------------------------

### Initialize Project with Template and Specific Path

Source: https://www.sanity.io/docs/cli-reference/init

Initializes a project using a specific template ('moviedb') and dataset ('staging'), outputting to the current directory. Uses unattended mode.

```sh
sanity init -y --project abc123 --dataset staging --template moviedb --output-path .
```

--------------------------------

### Patching with Numeric Field Names (API v2025-08-18 and later)

Source: https://www.sanity.io/docs/changelog/76bf5f16-3216-4ec9-9b12-8e91892f5b38

Starting with API version 2025-08-18, patch mutations with numeric field names will return validation errors. Use bracket notation, e.g., `['fieldName']`, to correctly reference fields that start with digits. This example demonstrates the correct usage.

```javascript
// This now returns a helpful error: 
// "Field path "7819f29-cd8e-438a-bf53-27953351677a" starts with a digit, which is not allowed. Use bracket notation instead: ['7819f29-cd8e-438a-bf53-27953351677a']"
patch.setIfMissing({  '7819f29-cd8e-438a-bf53-27953351677a': 0 })  

// Correct usage with bracket notation: 
patch.setIfMissing({  "['7819f29-cd8e-438a-bf53-27953351677a']": 0 })
```

--------------------------------

### Create Sanity Client

Source: https://www.sanity.io/docs/agent-actions/agent-action-cheatsheet

Example of how to create and configure the Sanity client. Ensure your client is named 'client' or update the examples accordingly.

```typescript
// client.ts
import { createClient } from "@sanity/client";
export const client = createClient({
  projectId: '<project-id>',
  dataset: '<dataset-name>',
  useCdn: 'true',
  apiVersion: 'vX',
  token: '<read-write-token>'
})
```

--------------------------------

### Example Book Document

Source: https://www.sanity.io/docs/content-source-maps

This is an example document representing a book, with a reference to its author.

```json
{
  "_id": "book-animal-farm-3856",
  "_type": "book",
  "description": "It tells the story of a group of farm animals who rebel against their human farmer",
  "title": "Animal Farm",
  "author": {
    "_ref": "author-george-orwell-4c9f"
  }
}
```

--------------------------------

### Example Authorization Header

Source: https://www.sanity.io/docs/content-lake/http-auth

This is an example of how an Authorization header should be formatted when making API requests.

```text
Authorization: Bearer skE5UXUmBEy7U50jcG4In4v4xoHZTlduDxQYet8Y84tsTqAZxp2reIPJsA1JzqXJno2qcpauGwPfjHpU
```

--------------------------------

### Basic Listening to Queries

Source: https://www.sanity.io/docs/apis-and-sdks/js-client-realtime

This example demonstrates how to listen for changes to documents matching a GROQ query and subscribe to updates. It also shows how to unsubscribe when no longer needed.

```APIDOC
## Listening to queries with client.listen()

The `listen()` method opens a server-sent event (SSE) stream that notifies your application whenever documents matching a GROQ query are created, updated, or deleted.

```typescript
const query = '*[_type == "comment" && authorId != $ownerId]'
const params = {ownerId: 'bikeOwnerUserId'}

const subscription = client.listen(query, params).subscribe((update) => {
  const comment = update.result
  console.log(`${comment.author} commented: ${comment.text}`)
})

// Unsubscribe when no longer needed
subscription.unsubscribe()
```

The `listen()` method returns an Observable. Call `.subscribe()` to start receiving events, and `.unsubscribe()` to stop. By default, each event includes a `result` property with the document after the mutation is applied. For delete mutations, `result` is not present.
```

--------------------------------

### Install Sanity CLI

Source: https://www.sanity.io/docs/visual-editing/visual-editing-with-react-native

Install the latest version of Sanity to access the presentationTool plugin.

```bash
pnpm install sanity@latest
// or install with npm or yarn
```

--------------------------------

### Create New Project with Name and Configuration

Source: https://www.sanity.io/docs/cli-reference/init

Creates a brand new project with a specified name, dataset, visibility, template, and output path. Uses unattended mode.

```sh
sanity init -y --project-name "Movies Unlimited" --dataset moviedb --visibility private --template moviedb --output-path /Users/espenh/movies-unlimited
```

--------------------------------

### Customize Studio Navbar with Contextual Information

Source: https://www.sanity.io/docs/studio/studio-components-reference

Override the default navbar to display dataset-specific information. This example uses `useWorkspace` to get the dataset name and `renderDefault` to include the original navbar.

```typescript
// ./sanity.config.tsx|jsx

import {defineConfig, NavbarProps, useWorkspace} from 'sanity'
import {Card, Stack, Text} from '@sanity/ui'

function CustomNavbar(props: NavbarProps) {
  const {dataset} = useWorkspace()

  return (
    <Stack>
      <Card padding={3} tone="primary">
        <Text size={1}>
          Using the <b>{dataset}</b> dataset
        </Text>
      </Card>

			
      {props.renderDefault(props)} {/* Render the default navbar */}
    </Stack>
  )
}

export default defineConfig({
  // rest of config ...
	
  studio: {
    components: {
      navbar: CustomNavbar,
    }
  }
})
```

--------------------------------

### Install React Compiler Runtime (bun)

Source: https://www.sanity.io/docs/help/react-compiler

Install the `react-compiler-runtime` package if your library supports React 18.

```bash
bun add react-compiler-runtime
```

--------------------------------

### Add Algolia Document Sync Function Example

Source: https://www.sanity.io/docs/developer-guides/how-to-implement-front-end-search-with-sanity

Add the Algolia document sync example to your Sanity project. This command fetches the example and integrates it into your project structure, typically within a 'functions' directory.

```bash
npx sanity blueprints add function --example algolia-document-sync
```

--------------------------------

### Install next-sanity Package

Source: https://www.sanity.io/docs/developer-guides/live-content-guide

Install or update the next-sanity package to the latest version.

```sh
npm install next-sanity@latest
```

--------------------------------

### Install Sanity Client

Source: https://www.sanity.io/docs/developer-guides/live-content-guide

Install the latest version of the Sanity JS client using npm.

```sh
npm install @sanity/client@latest
```

--------------------------------

### Initialize a project using a personal auth token

Source: https://www.sanity.io/docs/cli-reference/login

This example demonstrates how to initialize a Sanity project on a server or in an environment without a browser, by using a personal authentication token.

```bash
SANITY_AUTH_TOKEN=ab97ae7...0f9ff sanity init -y \
  --create-project "Movies Unlimited" \
  --dataset moviedb \
  --visibility private \
  --template moviedb \
  --output-path /path/to/folder
```

--------------------------------

### Configure Sanity MCP Server using yarn dlx

Source: https://www.sanity.io/docs/changelog/e75b1d45-03be-4fa6-994b-248750b3fa9f?category=integrations&product=5ba66ea7-d920-4b40-a2eb-8dccb0e31360%2C63a3933f-c596-483c-898b-8c9395566264%2C40e31675-4154-4d2f-ad93-90e00bad82a2%2C926becda-7e17-4e3a-9933-6b1b6d1c4eca%2C0292f29c-2f77-4126-ba47-d45ab773f368%2C2b0da051-9928-45b0-88ca-4bbe45178e7a%2C85affff6-043c-4f5a-bc24-f77ca6b72bf6%2C3c0380bb-b03e-44cb-b717-3aee15995c15%2Caa77521a-5888-4d2a-be7e-88f5c29ab545%2Cd7072523-7052-47c4-ab84-051a2691278d%2C1044e8ff-a741-467c-a33f-0be21de6e6e6%2Ce7fa62bc-7715-4c49-962e-08c06efb4ca1%2C4e72ec72-7127-441a-9031-a5a3b684c98e%2Cb74708a1-00a2-4f2c-8556-e366267f34e3%2Cdfd812db-074c-4f82-a992-19b409262687%2Cb88bb401-c9a1-4a8f-81d9-65ba5b9bce41

Use this command to automatically configure the Sanity MCP server for common AI-powered editors. This is the quickest way to get started.

```bash
yarn dlx sanity@latest mcp configure
```

--------------------------------

### Install @sanity/visual-editing

Source: https://www.sanity.io/docs/visual-editing/visual-editing-overlays

Install the @sanity/visual-editing package and its required peer dependencies, react and react-dom.

```sh
npm install @sanity/visual-editing
```

--------------------------------

### Configure Sanity MCP Server using pnpm dlx

Source: https://www.sanity.io/docs/changelog/e75b1d45-03be-4fa6-994b-248750b3fa9f?category=integrations&product=5ba66ea7-d920-4b40-a2eb-8dccb0e31360%2C63a3933f-c596-483c-898b-8c9395566264%2C40e31675-4154-4d2f-ad93-90e00bad82a2%2C926becda-7e17-4e3a-9933-6b1b6d1c4eca%2C0292f29c-2f77-4126-ba47-d45ab773f368%2C2b0da051-9928-45b0-88ca-4bbe45178e7a%2C85affff6-043c-4f5a-bc24-f77ca6b72bf6%2C3c0380bb-b03e-44cb-b717-3aee15995c15%2Caa77521a-5888-4d2a-be7e-88f5c29ab545%2Cd7072523-7052-47c4-ab84-051a2691278d%2C1044e8ff-a741-467c-a33f-0be21de6e6e6%2Ce7fa62bc-7715-4c49-962e-08c06efb4ca1%2C4e72ec72-7127-441a-9031-a5a3b684c98e%2Cb74708a1-00a2-4f2c-8556-e366267f34e3%2Cdfd812db-074c-4f82-a992-19b409262687%2Cb88bb401-c9a1-4a8f-81d9-65ba5b9bce41

Use this command to automatically configure the Sanity MCP server for common AI-powered editors. This is the quickest way to get started.

```bash
pnpm dlx sanity@latest mcp configure
```

--------------------------------

### Install Portable Text Editor Plugin

Source: https://www.sanity.io/docs/studio/add-portable-text-plugins

Commands to install the CharacterPairDecoratorPlugin using common package managers.

```bash
npm install @portabletext/plugin-character-pair-decorator
```

```bash
pnpm add @portabletext/plugin-character-pair-decorator
```

--------------------------------

### Install Sanity CLI

Source: https://www.sanity.io/docs/apis-and-sdks/cli

Commands to install the Sanity CLI globally using various package managers or to run it on-demand using npx. Requires Node.js and npm to be installed on the system.

```sh
npm install --global sanity@latest
yarn global add sanity@latest
pnpm install --global sanity@latest
npx -y sanity@latest [command]
```

--------------------------------

### Define Main Document Resolver

Source: https://www.sanity.io/docs/visual-editing/presentation-resolver-api

Configure the `resolve.mainDocuments` property to specify how routes map to documents. This example shows a basic setup using a GROQ filter to match a document by its slug.

```typescript
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {defineDocuments, presentationTool} from 'sanity/presentation'

export default defineConfig({
  /* ... */
  plugins: [
    presentationTool({
      /* ... */
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/posts/:slug',
            filter: `_type == "post" && slug.current == $slug`,
          },
        ]),
      },
    }),
    structureTool(),
  ],
})
```

--------------------------------

### Install German Language Plugin for Studio

Source: https://www.sanity.io/docs/studio/localizing-studio-ui

Install the German language plugin using npm. This command should be run from the root of your studio project.

```bash
npm install @sanity/locale-de-de
```

--------------------------------

### Preview Using Fields from Referenced Documents

Source: https://www.sanity.io/docs/previews-list-views

Display data from a referenced document in the preview by using dot notation in `preview.select`. This example shows how to get the director's name from a referenced 'person' document.

```javascript
export const movie = {
  name: 'movie',
  type: 'document',
  fields: [
    //...other fields
    {
      name: 'director',
      type: 'reference',
      to: [{ type: 'person' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      director: 'director.name' // if the movie has a director, follow the reference and get the name
    },
    prepare(selection) {
      const {title, director} = selection
      return {
        title: title,
        subtitle: `Directed by: ${director ? director : 'unknown'}`
      }
    }
  }
}
```

--------------------------------

### Sanity Client Implementation

Source: https://www.sanity.io/docs/agent-actions/transform-cheatsheet

Example of how to create and configure the Sanity client. Ensure your client is named 'client' or update the examples accordingly.

```typescript
import { createClient } from "@sanity/client";
export const client = createClient({
  projectId: '<project-id>',
  dataset: '<dataset-name>',
  useCdn: 'true',
  apiVersion: 'vX',
  token: '<read-write-token>'
})
```

--------------------------------

### Install @sanity/google-maps-input Plugin with Bun

Source: https://www.sanity.io/docs/geopoint-type

Installs the @sanity/google-maps-input plugin using Bun for a visual geopoint input.

```bash
cd my-project
bun add @sanity/google-maps-input
```

--------------------------------

### Install Sanity and Plugins

Source: https://www.sanity.io/docs/changelog/e215973b-784d-46a8-9f5d-6ffac4dc9ace?from=%2Fdocs%2Fcontent-lake%2Fids%2Fchangelog&fromId=b067bbbb-a0dc-45f8-8dfe-ba728cee322f&fromTitle=IDs+and+Paths

Install the latest versions of Sanity, AI Assist, and Vision using npm, pnpm, yarn, or bun.

```bash
npm install sanity@latest @sanity/assist@latest @sanity/vision@latest
```

```bash
pnpm add sanity@latest @sanity/assist@latest @sanity/vision@latest
```

```bash
yarn add sanity@latest @sanity/assist@latest @sanity/vision@latest
```

```bash
bun add sanity@latest @sanity/assist@latest @sanity/vision@latest
```

--------------------------------

### Configure Document Types to Include

Source: https://www.sanity.io/docs/http-reference/agent-actions

Use the 'types' property to specify which document types should be included in the instruction. This example includes 'text', 'image', and 'video' types.

```json
{
  "include": ["text", "image", "video"]
}
```

--------------------------------

### Configure Client with withConfig

Source: https://www.sanity.io/docs/apis-and-sdks/js-client-getting-started

Demonstrates how to extend an existing client instance with new configuration options using the withConfig method.

```typescript
import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: '<your-project-id>',
  dataset: '<your-dataset>',
  useCdn: false,
  apiVersion: '2026-03-01',
  token: 'your-auth-token'
})

const draftClient = client.withConfig({
  perspective: 'drafts'
})
```

--------------------------------

### Start Sanity Studio Locally

Source: https://www.sanity.io/docs/help/outdated-modules

After upgrading modules, run this command to start your Sanity studio locally and verify that everything is working correctly.

```bash
sanity start
```

--------------------------------

### Shopify Collection Document Example

Source: https://www.sanity.io/docs/apis-and-sdks/sanity-connect-for-shopify-reference

This is an example of a collection document as stored in Sanity.

```json
{
  "_createdAt": "2022-06-07T10:00:11Z",
  "_id": "shopifyCollection-396461834491",
  "_rev": "0penztPZlC32Cv2tesREk7",
  "_type": "collection",
  "_updatedAt": "2022-08-26T15:07:57Z",
  "store": {
    "createdAt": "2022-08-26T15:07:56.895Z",
    "descriptionHtml": "",
    "disjunctive": false,
    "gid": "gid://shopify/Collection/396461834491",
    "id": 396461834491,
    "imageUrl": "https://cdn.shopify.com/s/files/1/0639/3285/8619/collections/BLOMST_print.jpg?v=1655599663",
    "isDeleted": false,
    "rules": [
      {
        "_key": "7803ad21-682e-56b6-ae2a-4d380d0d120c",
        "_type": "object",
        "column": "TYPE",
        "condition": "Poster",
        "relation": "CONTAINS"
      }
    ],
    "slug": {
      "_type": "slug",
      "current": "prints"
    },
    "sortOrder": "BEST_SELLING",
    "title": "Prints"
  }
}
```

--------------------------------

### Access tools with useTools

Source: https://www.sanity.io/docs/studio/studio-react-hooks

Returns an array of all installed tools in the Studio.

```javascript
import { useTools } from 'sanity'

export function MyComponent() {
  const tools = useTools();
  
	return (
		<div>
			<h1>Studio Tools</h1>
		  <ul>
				{tools.map(tool => <li key={tool.name}>{tool.title}</li>)}
			</ul>
		</div>
		)
```

--------------------------------

### GROQ Example Project List with Completion Flag

Source: https://www.sanity.io/docs/groq

Example of a project list where each project includes its ID, title, and a boolean flag indicating if it is completed.

```json
[
  {
    _id: "timmerhuis",
    title: "Timmerhuis",
    completed: true
  },
  …
]
```

--------------------------------

### Custom String Validation with Undefined Check

Source: https://www.sanity.io/docs/studio/validation

Implement custom validation for string fields that allows `undefined` values. This example checks if a name starts with 'Brew' and returns a specific error message or `true` if valid.

```javascript
defineField({
  name: 'breweryName',
  type: 'string',
  title: 'Brewery name',
  validation: rule => rule.custom(name => {
    if (typeof name === 'undefined') {
      return true // Allow undefined values
    }
    
    // This would crash if we didn't check
    // for undefined values first
    return name.startsWith('Brew')
      ? 'Please be more creative'
      : true
  }).warning()
})
```

--------------------------------

### Initialize Studio with specific package manager (bun)

Source: https://www.sanity.io/docs/changelog/98b6c3db-20de-4332-bc2c-1cddcea83ccb?from=%2Fdocs%2Fcli-reference%2Finit%2Fchangelog&fromId=6af2b8dd-076f-4457-b714-4276da99cda2&fromTitle=Init+CLI+command+reference

Initialize a new Sanity Studio and specify 'pnpm' as the package manager in a single command line.

```bash
bun create sanity@latest --package-manager pnpm
```

--------------------------------

### Install React Compiler Babel and ESLint Plugins (yarn)

Source: https://www.sanity.io/docs/help/react-compiler

Install the necessary Babel and ESLint plugins for the React Compiler using yarn.

```bash
yarn add --dev babel-plugin-react-compiler eslint-plugin-react-hooks
```

--------------------------------

### Install Sanity UI and styled-components

Source: https://www.sanity.io/docs/app-sdk/sanity-ui-sdk

Install the necessary packages for Sanity UI and styled-components in your existing app.

```sh
npm install @sanity/ui styled-components
```