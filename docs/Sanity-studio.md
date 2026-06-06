### Setup and Development Environment

Source: https://github.com/sanity-io/sanity/blob/main/CONTRIBUTING.md

Commands to clone the repository, install dependencies, and start the development server. Ensure Node.js v18+ and pnpm are installed.

```sh
git clone git@github.com:sanity-io/sanity.git
cd sanity
pnpm install
pnpm build
pnpm dev
```

--------------------------------

### Setup Script-Local Environment File

Source: https://github.com/sanity-io/sanity/blob/main/scripts/trigger-triage/README.md

Copies the example .env file to create a script-local environment file. This allows Miriad credentials to be scoped specifically to the trigger-triage helper.

```bash
cp scripts/trigger-triage/.env.example scripts/trigger-triage/.env
```

--------------------------------

### Start Auth Test Studio

Source: https://github.com/sanity-io/sanity/blob/main/e2e/tests/auth/README.md

Command to start the auth test studio. Keep this running while executing tests.

```bash
pnpm --filter auth-test-studio dev --port 3340
```

--------------------------------

### Install Dependencies with pnpm

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Installs all project dependencies using pnpm. This command is enforced and must be run before other build or test commands.

```bash
pnpm install
```

--------------------------------

### Start the Dev Studio

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Starts the development studio, which requires browser authentication on first visit. It connects to a real Sanity project and uses staging APIs by default.

```bash
pnpm dev  # Starts at http://localhost:3333
```

--------------------------------

### Install Project and Function Dependencies

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/product-mapping/README.md

Installs project-level dependencies and specific dependencies for the Sanity function. This ensures all necessary packages are available for the blueprint to run correctly.

```bash
npm install
cd functions/product-mapping
npm install
cd ../..
```

--------------------------------

### Run Development Studio

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Starts the development studio, typically used for local development and testing. Requires Sanity user authentication.

```bash
pnpm dev
```

--------------------------------

### Install Dependencies

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/social-media-crosspost/README.md

Commands to install necessary dependencies in the project root and the specific functions directory.

```bash
npm install dotenv
cd functions/social-media-crosspost
npm install
```

--------------------------------

### Install Project and Function Dependencies

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-create/README.md

Bash commands to install necessary npm packages for the Sanity project and specifically for the Klaviyo function. This ensures all required libraries are available.

```bash
npm install dotenv @portabletext/to-html
cd functions/klaviyo-campaign-create
npm install
cd ../..
```

--------------------------------

### Install Project Dependencies (Bash)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-summary/README.md

This command installs all the necessary Node.js dependencies for your Sanity project, including those required for the auto-summary function. Run this from the root of your project.

```bash
npm install
```

--------------------------------

### Good PR Title Examples

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Examples of correctly formatted PR titles adhering to the conventional commit standard.

```text
fix(groq): resolve CJS type export issue
feat(form): add new array input component
chore(deps): update dependencies
```

--------------------------------

### Initialize Sanity Blueprint Example

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-create/README.md

Commands to initialize or add the Klaviyo campaign create blueprint to a Sanity project. This sets up the necessary files and configurations for the blueprint.

```bash
npx sanity blueprints init --example klaviyo-campaign-create
```

```bash
npx sanity blueprints add function --example klaviyo-campaign-create
```

--------------------------------

### Install Dependencies and Deploy Schema

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/social-media-crosspost/README.md

Commands to install necessary UI dependencies and deploy the updated schema configuration to the Sanity project.

```bash
cd studio
npm install @sanity/ui

cd studio
npx sanity schema deploy
```

--------------------------------

### Initialize Sanity Blueprints

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/mastodon-post/README.md

Commands to initialize the blueprint system and add the mastodon-post function example to your Sanity project.

```bash
npx sanity blueprints init
npx sanity blueprints add function --example mastodon-post
```

--------------------------------

### Install GROQ dependency

Source: https://github.com/sanity-io/sanity/blob/main/packages/groq/README.md

The command to install the groq package via npm for use in a JavaScript or TypeScript project.

```bash
npm install --save groq
```

--------------------------------

### Build All Packages

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Builds all packages within the monorepo. This is a prerequisite for running tests and must be executed after installing dependencies.

```bash
pnpm build
```

--------------------------------

### Initialize and Add Auto-Changelog Blueprint

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-changelog/README.md

These bash commands guide you through initializing Sanity blueprints and adding the 'auto-changelog' example function. This sets up the necessary project structure and configuration for the function.

```bash
npx sanity blueprints init
npx sanity blueprints add function --example auto-changelog
```

--------------------------------

### Test Sanity Functions via CLI

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/product-mapping/README.md

Commands to test Sanity functions using the CLI. These examples demonstrate creating test documents, querying existing data, and executing the 'product-mapping' function against specific datasets.

```bash
cd studio
cat > test-product.json << EOF
{
  "_type": "product",
  "title": "Test Product with Tags",
  "store": {
    "tags": ["sanity-parent-summer-collection", "sanity-color-blue", "cotton", "t-shirt"],
    "slug": {
      "current": "test-product-tags"
    }
  }
}
EOF

npx sanity documents create test-product.json --replace
cd ..
npx sanity functions test product-mapping --file studio/test-product.json --dataset production --with-user-token
```

```bash
cd studio
npx sanity documents query "*[_type == 'product'][0]" > ../real-product.json
cd ..
npx sanity functions test product-mapping --file real-product.json --dataset production --with-user-token
```

```bash
npx sanity functions dev
```

```bash
cd studio
REAL_DOC_ID=$(npx sanity documents query "*[_type == 'product'][0]._id" | tr -d '"')
cd ..
cat > test-custom-product.json << EOF
{
  "_type": "product",
  "_id": "$REAL_DOC_ID",
  "title": "Custom Test Product",
  "store": {
    "tags": ["sanity-parent-winter-collection", "sanity-color-red", "wool", "sweater"],
    "slug": {
      "current": "custom-test-product"
    }
  }
}
EOF
npx sanity functions test product-mapping --file test-custom-product.json --dataset production --with-user-token
```

```bash
cd studio
npx sanity documents query "*[_type == 'product' && defined(store.tags)][0]" > ../test-real-product.json
cd ..
npx sanity functions test product-mapping --file test-real-product.json --dataset production --with-user-token
```

--------------------------------

### Start Sanity Functions Development Server (Bash)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-summary/README.md

This command starts the Sanity development server in interactive mode, allowing you to test and debug your Sanity Functions, including the auto-summary function, in real-time.

```bash
npx sanity functions dev
```

--------------------------------

### Add Brand Voice Validator Example (Bash)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/brand-voice-validator/README.md

This command adds the 'brand-voice-validator' example function to your Sanity project using the blueprints CLI. Ensure you have initialized blueprints first.

```bash
npx sanity blueprints add function --example brand-voice-validator
```

--------------------------------

### Customize Created Document Structure

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/product-mapping/README.md

Example of using the Sanity client to create a new document with custom fields and references.

```typescript
const newProductMap = await client.create({
  _id: productMapId,
  _type: 'productMap',
  id: productMapName,
  products: [{_key: `product-${_id}`, _ref: _id, _type: 'reference'}],
  description: `Product map for ${productMapName}`,
  careInstructions: [],
  // Add custom fields
  category: 'auto-generated',
  createdAt: new Date().toISOString(),
})
```

--------------------------------

### Add Auto-Summary Example Blueprint (Bash)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-summary/README.md

This command adds the 'auto-summary' example blueprint to your Sanity project, setting up the necessary function files and configurations.

```bash
npx sanity blueprints add function --example auto-summary
```

--------------------------------

### Add a New Dev Dependency to the Root

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Install a new development dependency at the root level of the monorepo.

```bash
pnpm add -w -D <package>
```

--------------------------------

### Local Environment: GitHub Token

Source: https://github.com/sanity-io/sanity/blob/main/scripts/trigger-triage/README.md

Example of setting the GITHUB_TOKEN for local runs when testing against private repositories or to avoid GitHub API rate limits. The script automatically loads local .env files.

```bash
GITHUB_TOKEN=ghp_example pnpm issue-triage --dry-run https://github.com/sanity-io/sanity/issues/725
```

--------------------------------

### Initialize Sanity Blueprints (Bash)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-summary/README.md

This command initializes Sanity Blueprints in your project if you haven't already. It guides you through selecting your organization and Sanity studio.

```bash
npx sanity blueprints init
```

--------------------------------

### Bad PR Title Examples

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Examples of incorrectly formatted PR titles, highlighting common mistakes like using backticks or incorrect casing.

```text
feat(groq): add `types` condition     # no backticks allowed
Fix(cli): Handle missing config        # type must be lowercase, description must start lowercase
added new feature                       # missing type and scope
```

--------------------------------

### Install Dependencies for Sanity Blueprint

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/bluesky-post/README.md

Command to install the 'dotenv' package, which is required for loading environment variables in the Sanity blueprint configuration.

```bash
npm install dotenv
```

--------------------------------

### Install Project and Function Dependencies (Bash)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/stale-products-analysis/README.md

Bash commands to install npm dependencies for the project root and specifically for the Sanity function. This ensures all required packages are available.

```bash
npm install

npm install @sanity/functions
cd functions/stale-products-analysis
npm install
cd ../..
```

--------------------------------

### Router utility methods for 404s and base paths

Source: https://github.com/sanity-io/sanity/blob/main/packages/sanity/src/router/README.md

Provides examples for checking invalid paths using isNotFound and managing base path redirects using isRoot and getRedirectBase.

```javascript
const router = route('/pages/:page')
router.isNotFound('/some/invalid/path')

// Base path redirect logic
const redirectTo = router.getRedirectBase(location.pathname)
if (redirectTo) {
  history.replaceState(null, null, redirectTo)
}
```

--------------------------------

### Add a New Dependency to a Specific Package

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Install a new package and associate it with a particular package within the monorepo.

```bash
pnpm --filter sanity add <package>
```

--------------------------------

### Environment Variable Configuration

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/social-media-crosspost/README.md

Example structure for the .env file required to store platform-specific API credentials.

```env
TWITTER_ACCESS_TOKEN_KEY=your-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-access-secret
TWITTER_API_CONSUMER_KEY=your-consumer-key
TWITTER_API_CONSUMER_SECRET=your-consumer-secret
MASTODON_ACCESS_TOKEN=your-access-token
MASTODON_HOST=mastodon.social
BLUESKY_IDENTIFIER=yourname.bsky.social
BLUESKY_PASSWORD=xxxx-xxxx-xxxx-xxxx
BLUESKY_HOST=bsky.social
LINKEDIN_ACCESS_TOKEN=your-linkedin-token
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_CHANNEL=your-channel-id
DEVTO_API_KEY=your-api-key
```

--------------------------------

### Configure Product Mapping Blueprint in Sanity

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/product-mapping/README.md

Configures the 'product-mapping' blueprint by defining its resource, including event triggers, filters, and projections. This setup specifies when and how the function should execute.

```typescript
import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'product-mapping',
      memory: 1,
      timeout: 10,
      src: './functions/product-mapping',
      event: {
        on: ['create', 'update'],
        filter:
          "_type == 'product' && (delta::changedAny(store.tags) || (delta::operation() == 'create' && defined(store.tags)))",
        projection:
          '{_id, _type, store, colorVariant, productMap, "operation": delta::operation()}',
      },
    }),
  ],
})
```

--------------------------------

### React Router Setup with Sanity Router

Source: https://github.com/sanity-io/sanity/blob/main/packages/sanity/src/router/README.md

Illustrates how to set up routing within a React application using `sanity/router`. It covers defining routes, creating a history object, handling navigation, and integrating with a `RouterProvider` and `withRouter` HOC to access router state within components.

```jsx
import {route} from 'sanity/router'
import {RouterProvider, withRouter} from 'sanity/router'

const router = route('/', [route('/bikes/:bikeId')])

const history = createHistory()

function handleNavigate(nextUrl, {replace} = {}) {
  if (replace) {
    history.replace(nextUrl)
  } else {
    history.push(nextUrl)
  }
}

const App = withRouter(function App({router}) {
  if (router.state.bikeId) {
    return <BikePage id={router.state.bikeId} />
  }
  return (
    <div>
      <h1>Welcome</h1>
      <StateLink state={{bikeId: 22}}>Go to bike 22</StateLink>
    </div>
  )
})

function render(location) {
  ReactDOM.render(
    <RouterProvider
      router={router}
      onNavigate={handleNavigate}
      state={router.decode(location.pathname)}
    >
      <App />
    </RouterProvider>,
    document.getElementById('container'),
  )
}
history.listen(() => render(document.location))
```

--------------------------------

### Configure Environment Variables for Bluesky Integration

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/bluesky-post/README.md

Example .env file content for configuring Bluesky credentials and host. Requires BLUESKY_USERNAME and BLUESKY_PASSWORD.

```env
# Required
BLUESKY_USERNAME=yourname.bsky.social
BLUESKY_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Optional (defaults shown)
BLUESKY_HOST=bsky.social
```

--------------------------------

### Start Sanity Interactive Development Mode (Bash)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/slack-notify/README.md

Starts the Sanity development server in interactive mode, allowing for real-time testing of functions. This mode requires the Slack OAuth token to be set as an environment variable.

```bash
SLACK_OAUTH_TOKEN=slack-OAuth-token npx sanity functions dev
```

--------------------------------

### Customize Blueprint Logic and Projections

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/mastodon-post/README.md

Examples for filtering content triggers, defining data projections, and formatting post content with hashtags using JavaScript/TypeScript.

```typescript
filter: "_type == 'post' && defined(mastodonPost) && postToMastodon == true"
projection: '{title, mastodonPost, slug, author, tags}'
const hashtags = data.tags?.map((tag) => `#${tag}`).join(' ') || ''
const postContent = `${title}\n\n${mastodonPost}\n\n${slug.current}\n\n${hashtags}`
```

--------------------------------

### Sample Input Marketing Campaign Document (JSON)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-send/README.md

An example JSON structure for a marketing campaign document within Sanity.io. This document includes essential fields like status, Klaviyo campaign ID, and references to email content, serving as a typical input for the campaign sending function.

```json
{
  "_type": "marketingCampaign",
  "_id": "marketing-campaign-123",
  "title": "Product Launch Campaign",
  "status": "ready",
  "klaviyoCampaignId": "abc123",
  "klaviyoTemplateId": "def456",
  "email": {
    "_ref": "email-123",
    "_type": "reference"
  },
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

--------------------------------

### Get Sanity CLI Debug Token

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Retrieve your authentication token using the Sanity CLI for debugging purposes.

```bash
sanity login
sanity debug --secrets  # Look for "Auth token"
```

--------------------------------

### Debug Sanity Function Execution

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-create/README.md

Example of logging function execution steps to the console for monitoring operations like API calls and template creation.

```typescript
console.log('👋 Marketing Campaign Function called at', new Date().toISOString())
console.log('✅ Created Klaviyo template:', template.data.id)
console.log('✅ Created Klaviyo campaign:', campaign.data.id)
```

--------------------------------

### Define Event with Optional Sampling

Source: https://github.com/sanity-io/sanity/blob/main/docs/TELEMETRY.md

Events can specify a maxSampleRate to throttle high-frequency metrics, ensuring they are not sent too often. This example sets a 30-second interval for INP measurements.

```typescript
export const PerformanceINPMeasuredV2 = defineEvent<INPMetricWithAttribution>({
  name: 'Performance INP Measured',
  version: 2,
  description: 'Interaction to Next Paint with attribution',
  maxSampleRate: 30_000, // At most once every 30 seconds
})
```

--------------------------------

### Sanity CLI Commands for Function Management

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-tag/README.md

Essential CLI commands for initializing, deploying, and testing the auto-tag function. These commands handle blueprint setup, schema deployment, and local function execution.

```bash
# Deploy schema
npx sanity schema deploy

# Initialize blueprints
npx sanity blueprints init

# Add auto-tag function
npx sanity blueprints add function --example auto-tag

# Test function locally
npx sanity functions test auto-tag --document-id <insert-document-id> --dataset production --with-user-token

# Start dev mode
npx sanity functions dev
```

--------------------------------

### Customize Blueprint Logic

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-tag/README.md

Examples for modifying AI instructions, changing the target document field, or updating the document filter criteria.

```typescript
// Adjust AI instructions
instruction: `Based on the $content, create 5 relevant tags instead of 3. Focus on technical topics and use camelCase format.`

// Change target field
target: {
  path: 'categories', // Instead of 'tags'
}

// Filter different document types
filter: "_type == 'article' && !defined(keywords) && delta::changedAny(content)"
```

--------------------------------

### Debug Sanity Function Logs

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/product-mapping/README.md

Example of logging statements used within a Sanity function to track execution flow and data processing results.

```typescript
console.log('👋 Your Sanity Function was called at', new Date().toISOString())
console.log('🏷️ Processing tags for product:', _id, 'Tags:', tags)
console.log('✅ Created productMap:', productMapName, 'with ID:', newProductMap._id)
console.log('✅ Created colorVariant:', colorName, 'with ID:', newColorVariant._id)
```

--------------------------------

### Build and Run E2E Tests

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Build the End-to-End test studio and then execute the E2E tests. Use the --ui flag for an interactive mode.

```bash
pnpm e2e:build              # Build E2E studio
pnpm test:e2e               # Run E2E tests
pnpm test:e2e --ui          # Interactive mode
```

--------------------------------

### Define Custom Studio Tools

Source: https://github.com/sanity-io/sanity/blob/main/docs/CORE_CONCEPTS.md

Provides the interface definition for creating custom tools in Sanity Studio and an example of how to register a new tool using the definePlugin function.

```typescript
interface Tool<Options = any> {
  name: string
  title: string
  icon?: ComponentType
  component: ComponentType<{tool: Tool<Options>}>
  options?: Options
  router?: Router
  canHandleIntent?: (intent, params, payload) => boolean
  getIntentState?: (intent, params, routerState, payload) => unknown
}

import {definePlugin} from 'sanity'

export const myTool = definePlugin({
  name: 'my-tool',
  tools: [
    {
      name: 'analytics',
      title: 'Analytics',
      icon: ChartIcon,
      component: AnalyticsDashboard,
    },
  ],
})
```

--------------------------------

### Implement Custom Age Calculation Strategies

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/stale-products-analysis/README.md

Examples of advanced age calculation, including weighted averages and type-specific thresholds.

```typescript
// Weight creation vs update dates differently
const weightedAge = createdAgeInDays * 0.7 + updatedAgeInDays * 0.3

// Use different thresholds for different product types
const getAgeThreshold = (product: ProductWithDates) => {
  if (product.store?.productType === 'seasonal') return 14
  if (product.store?.productType === 'evergreen') return 90
  return 30
}
```

--------------------------------

### Test Algolia Document Sync Function Locally with Real Document Data

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/algolia-document-sync/README.md

This bash command sequence tests the 'algolia-document-sync' Sanity function locally using a real document exported from the Sanity dataset. It first navigates to the `studio` directory, retrieves a specific document using `sanity documents get`, saves it to `../test-document.json`, then returns to the project root to run the test command with the exported file. This ensures the function handles actual data correctly.

```bash
# From the studio/ folder export a real document for testing
cd studio
npx sanity documents get "your-post-id" > ../test-document.json

# Back to project root for function testing
cd ..
npx sanity functions test algolia-document-sync --file test-document.json --dataset production --with-user-token

```

--------------------------------

### Initialize Sanity Blueprints

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/first-published/README.md

Commands to initialize Sanity blueprints and add the 'first-published' example function. This sets up the necessary project structure for custom functions.

```bash
npx sanity blueprints init
npx sanity blueprints add function --example first-published
```

--------------------------------

### Implement Conditional Bluesky Posting

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/bluesky-post/README.md

Example of adding a filter to the blueprint configuration to only post when the `postToBlue` field is set to true.

```javascript
filter: "_type == 'post' && defined(blueskyPost) && postToBluesky == true"
```

--------------------------------

### Function Debugging Logs

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-send/README.md

Example of logging patterns used within Sanity functions to track execution flow and API responses.

```typescript
console.log('🚀 Marketing Campaign Send Function called at', new Date().toISOString())
console.log('📢 Sending Klaviyo campaign:', klaviyoCampaignId)
console.log('✅ Campaign send job created successfully:', sendJobResponse.data.id)
```

--------------------------------

### Configure Sanity Vision Plugin

Source: https://github.com/sanity-io/sanity/blob/main/packages/@sanity/vision/README.md

This snippet shows how to install and configure the sanity-vision plugin in your Sanity Studio project. It includes optional parameters for setting the default API version and dataset.

```typescript
import {
  defineConfig
} from 'sanity'
import {
  visionTool
} from '@sanity/vision'

export default defineConfig({
  // ...
  plugins: [
    visionTool({
      // Note: These are both optional
      defaultApiVersion: 'v2021-10-21',
      defaultDataset: 'some-dataset',
    }),
  ],
})
```

--------------------------------

### Run ESLint

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Executes ESLint for comprehensive linting of the codebase. Fix issues with `pnpm chore:lint:fix`.

```bash
pnpm lint
```

--------------------------------

### Apply Patches in Sanity Forms (TypeScript)

Source: https://github.com/sanity-io/sanity/blob/main/docs/CORE_CONCEPTS.md

Demonstrates the use of Sanity's patching system to modify document data. This includes examples for setting values, inserting items into arrays, and unsetting fields, all managed via the `onChange` function.

```typescript
import {set, unset, insert, setIfMissing} from 'sanity'

// Set a value
onChange(set('New Title', ['title']))

// Insert into array
onChange(insert([{_key: 'abc', ...}], 'after', ['items', 0]))

// Unset a field
onChange(unset(['description']))
```

--------------------------------

### Configure Document Action Visibility for Scheduled Publishing

Source: https://github.com/sanity-io/sanity/blob/main/packages/sanity/src/core/scheduled-publishing/README.md

Demonstrates how to manually configure the visibility of the Schedule document action, for example, to only show it on specific document types like 'movie'. This affects the Studio UI but not direct API access.

```javascript
import {scheduledPublishing, ScheduleAction} from '@sanity/scheduled-publishing'

export default defineConfig({
  // ...
  plugins: [scheduledPublishing()],
  document: {
    actions: (previousActions, {schemaType}) => {
      /*
       * Please note that this will only alter the visibility of the button in the studio.
       * Users with document publish permissions will be able to create schedules directly
       * via the Scheduled Publishing API.
       */
      if (schemaType.name !== 'movie') {
        // Remove the schedule action from any documents that is not 'movie'.
        return previousActions.filter((action) => action !== ScheduleAction)
      }
      return previousActions
    },
  },
})
```

--------------------------------

### Customize Bluesky Post Content Format

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/bluesky-post/README.md

Example of modifying the `postContent` template in `index.ts` to change the format of posts sent to Bluesky.

```typescript
const postContent = `🚀 ${title}

${blueskyPost}

Read more: ${slug.current}`
```

--------------------------------

### JavaScript Global Error Handling and DevTools Hook for Sanity.io

Source: https://github.com/sanity-io/sanity/blob/main/dev/test-studio/preview/index.html

This JavaScript code sets a global error handler for uncaught exceptions, logging them to the console with a '[preview]' prefix. It also facilitates React Developer Tools integration by copying the `__REACT_DEVTOOLS_GLOBAL_HOOK__` from the parent window if the current window is an iframe.

```javascript
window.onerror = function (err) {
  console.error('\[preview\] Uncaught error:', err);
};

if (window.parent !== window) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}
```

--------------------------------

### Clean and Bootstrap Project Dependencies

Source: https://github.com/sanity-io/sanity/blob/main/CONTRIBUTING.md

Use this command to resolve build issues by cleaning all node_modules, reinstalling dependencies, and building ES6 code to ES5.

```sh
pnpm clean && pnpm clean:deps
pnpm bootstrap
```

--------------------------------

### Encapsulate Telemetry Logic with Custom Hook

Source: https://github.com/sanity-io/sanity/blob/main/docs/TELEMETRY.md

For features with multiple events, a dedicated hook can encapsulate telemetry logic, providing a cleaner interface for components. This example shows a hook for comment-related telemetry.

```typescript
// useCommentsTelemetry.ts
export function useCommentsTelemetry() {
  const telemetry = useTelemetry()

  return {
    linkCopied: () => telemetry.log(CommentLinkCopied),
    viewedFromLink: () => telemetry.log(CommentViewedFromLink),
    listViewChanged: () => telemetry.log(CommentListViewChanged),
  }
}
```

--------------------------------

### Clean and Rebuild Project

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Command to clean the project, reinstall dependencies, and rebuild. Useful for resolving build issues.

```bash
# Clean everything and rebuild
pnpm clean && pnpm install && pnpm build
```

--------------------------------

### Debug Logging for Sanity Functions

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/stale-products-analysis/README.md

Example of using console logs to track function execution, product identification, and analysis results within a Sanity function.

```typescript
console.log('📄 Page Product Age Analysis Function called at', new Date().toISOString())
console.log('🔍 Analyzing product ages for page:', _id)
console.log(
  '📦 Found products:',
  uniqueProducts.map((p) => p._id),
)
console.log('📈 Product age analysis:', {totalProducts, oldProducts, averageAge})
```

--------------------------------

### Set Environment Variables for Telegram Bot

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/telegram-notify/README.md

This example shows how to configure environment variables for the Telegram notification function. It requires setting the TELEGRAM_BOT_TOKEN obtained from BotFather and the TELEGRAM_CHAT_ID retrieved using the Telegram API. A STUDIO_URL is also recommended for constructing the link to the Sanity Studio.

```env
TELEGRAM_BOT_TOKEN=<YOUR_BOT_TOKEN>
TELEGRAM_CHAT_ID=<YOUR_CHAT_ID>
STUDIO_URL=http://localhost:3333
```

--------------------------------

### Include Additional Fields in Sanity Projection

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/bluesky-post/README.md

Example of modifying the projection in the Sanity query to include additional fields that can be used in the Bluesky post.

```javascript
projection: '{title, blueskyPost, slug, author}'
```

--------------------------------

### Run All Auth Tests

Source: https://github.com/sanity-io/sanity/blob/main/e2e/tests/auth/README.md

Command to execute all authentication-related end-to-end tests.

```bash
pnpm --filter e2e test:auth
```

--------------------------------

### HTML Structure and Styling for Sanity.io

Source: https://github.com/sanity-io/sanity/blob/main/dev/test-studio/preview/index.html

This CSS targets the html and body elements to ensure consistent rendering across browsers and devices. It sets base font adjustments, removes tap highlight on touch devices, and enables font smoothing. It also ensures the root element takes up full height and removes default margins.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Sanity.io Project</title>
  <style>
    html {
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
    }
    html, body, #root {
      height: 100%;
      margin: 0;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="app.js"></script>
</body>
</html>
```

--------------------------------

### Run a Single Unit Test File with Verbose Output

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Execute a specific unit test file with verbose logging enabled for detailed output.

```bash
pnpm vitest run --project=sanity --reporter=verbose packages/sanity/src/core/hooks/useClient.test.ts
```

--------------------------------

### Define a Custom Input Component in Sanity Schema (TypeScript)

Source: https://github.com/sanity-io/sanity/blob/main/docs/CORE_CONCEPTS.md

Provides an example of how to define a custom input component for a specific field within a Sanity schema using `defineField`. This allows for specialized editing experiences, like a star rating input.

```typescript
defineField({
  name: 'rating',
  type: 'number',
  components: {
    input: StarRatingInput, // Custom component
  },
})
```

--------------------------------

### Run All Unit Tests (Vitest)

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Execute all unit tests using Vitest. This command can be combined with flags for watch mode or snapshot updates.

```bash
pnpm test                    # Run all tests
pnpm test -- --watch        # Watch mode
pnpm test -- -u             # Update snapshots
pnpm test -- --project=sanity  # Run specific project
```

--------------------------------

### Test Sanity Function Locally

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/first-published/README.md

Commands for testing a Sanity function locally. Includes a simple command to test with a specific document ID and a command to start an interactive development server for more dynamic testing.

```bash
npx sanity functions test first-published --document-id <insert-document-id> --dataset production --with-user-token
npx sanity functions dev
```

--------------------------------

### Sanity Blueprint Configuration for Prettier Code Formatting Function

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/prettier-format-code/README.md

Configures a Sanity Blueprint to include the 'prettier-format-code' document function. This setup specifies the trigger events ('create', 'update'), the filter conditions for when the function should run (e.g., changes to code blocks in 'post' documents), and the data projection.

```typescript
import {
  defineBlueprint,
  defineDocumentFunction
} from '@sanity/blueprints'

export default defineBlueprint({
  // ...all other settings
  resources: [
    //...all other functions
    defineDocumentFunction({
      name: 'prettier-format-code',
      event: {
        on: ['create', 'update'],
        filter:
          '_type == "post" && (delta::changedAny(content[_type == "code"]) || (delta::operation() == "create" && defined(content[_type == "code"])))',
        projection: '{_id, content}',
      },
    }),
  ],
})
```

--------------------------------

### Test Sanity Functions with Custom Data

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-create/README.md

Demonstrates how to create a local JSON file representing a document and execute a function against it using the Sanity CLI.

```bash
cd studio
REAL_DOC_ID=$(npx sanity documents query "*[_type == 'emails'][0]._id" | tr -d '"')
cd ..
cat > test-custom-data.json << EOF
{
  "_type": "emails",
  "_id": "$REAL_DOC_ID",
  "title": "Custom Test Email Campaign",
  "body": [
    {
      "_type": "block",
      "children": [{"_type": "span", "text": "Custom test content"}]
    }
  ],
  "status": "inprogress"
}
EOF
npx sanity functions test klaviyo-campaign-create --file test-custom-data.json --dataset production --with-user-token
```

--------------------------------

### Define Redirect Schema in Sanity

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-redirect/README.md

Defines the 'redirect' document type in Sanity, which stores source and destination slugs along with a permanent redirect flag. It includes a shared validator to ensure slugs start with a forward slash.

```typescript
import {defineType, defineField, type Rule, type Slug} from 'sanity'

const slugValidator = (rule: Rule) =>
  rule.required().custom((value: Slug) => {
    if (!value || !value.current) return "Can't be blank"
    if (!value.current.startsWith('/')) {
      return 'The path must start with a /'
    }
    return true
  })

export const redirectType = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  description: 'Redirect for next.config.js',
  fields: [
    defineField({
      name: 'source',
      type: 'slug',
      validation: (rule: Rule) => slugValidator(rule),
    }),
    defineField({
      name: 'destination',
      type: 'slug',
      validation: (rule: Rule) => slugValidator(rule),
    }),
    defineField({
      name: 'permanent',
      type: 'boolean',
    }),
  ],
  initialValue: {
    permanent: true,
  },
})
```

--------------------------------

### Example Schema Definition for Post Document

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/prettier-format-code/README.md

Defines a 'post' document type with a 'content' field that can include both standard blocks and code blocks. This structure is necessary for the Prettier formatting function to identify and process code snippets. It utilizes Sanity's schema definition tools.

```typescript
import {
  defineType,
  defineArrayMember
} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'code'}),
        // Add other block types as needed
      ],
    },
    // Add other fields as needed
  ],
})
```

--------------------------------

### Run Single Auth Spec File

Source: https://github.com/sanity-io/sanity/blob/main/e2e/tests/auth/README.md

Command to run a specific authentication test file, identified by its path.

```bash
pnpm --filter e2e test:auth tests/auth/cookieAuth.spec.ts
```

--------------------------------

### Auth Test Studio Configuration Toggle

Source: https://github.com/sanity-io/sanity/blob/main/e2e/tests/auth/README.md

Configuration variable within the auth-test-studio to switch between production and staging API environments.

```typescript
const USE_STAGING = false
```

--------------------------------

### Adjust Timeout for Function Execution (TypeScript)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-changelog/README.md

This TypeScript code snippet demonstrates how to adjust the timeout setting for a Sanity function. Increasing the 'timeout' value, for example from 90 to 120 seconds, can be necessary for processing longer posts or more complex changes.

```typescript
timeout: 120, // Increase from 90 to 120 seconds
```

--------------------------------

### Sample Shopify Product Document

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/product-mapping/README.md

A JSON representation of a Sanity product document containing store tags that trigger the automated mapping process.

```json
{
  "_type": "product",
  "_id": "product-123",
  "title": "Summer Cotton T-Shirt",
  "store": {
    "tags": ["sanity-parent-summer-collection", "sanity-color-blue", "cotton", "t-shirt", "casual"],
    "slug": {
      "current": "summer-cotton-t-shirt"
    }
  }
}
```

--------------------------------

### DateTimeInput with Custom Validation (JavaScript)

Source: https://github.com/sanity-io/sanity/blob/main/packages/sanity/src/core/scheduled-publishing/components/dateInputs/README.md

Demonstrates how to use the customValidation and customValidationMessage options within the DateTimeInput component to restrict selectable date ranges. It utilizes the useTimeZone hook for time zone conversion and date-fns for date manipulation. This example prevents scheduling on weekends.

```javascript
import React from 'react';
import { DateTimeInput } from '@sanity/form-builder/inputs/DateInputs'; // Assuming this path
import { useTimeZone } from 'your-timezone-hook'; // Assuming a hook for time zone management
import { isWeekend } from 'date-fns'; // Assuming date-fns is used

const MyComponent = () => {
  const { utcToCurrentZoneDate } = useTimeZone({ type: 'scheduledPublishing' });

  const handleCustomValidation = (selectedDate: Date): boolean => {
    return !isWeekend(utcToCurrentZoneDate(selectedDate));
  };

  return (
    <DateTimeInput
      type={{
        name: 'date',
        options: {
          customValidation: handleCustomValidation,
          customValidationmessage: 'No schedules on weekends please',
        },
        title: 'Date and time',
      }}
    />
  );
};

export default MyComponent;
```

--------------------------------

### Add Debugging Logs to Sanity Function

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/first-published/README.md

Example TypeScript code snippet to add temporary console logging within a Sanity function for debugging purposes. This helps in inspecting event data and the document ID being processed.

```typescript
// Add debugging logs
console.log('Event data:', JSON.stringify(event.data, null, 2))
console.log('Setting firstPublished for:', data._id)
```

--------------------------------

### Test Sanity Function Locally (Create Document)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-create/README.md

Bash commands to test the 'klaviyo-campaign-create' function locally. It first creates a test document using a JSON file and then runs the function test using the Sanity CLI.

```bash
# From the studio/ folder, create a test document
cd studio
npx sanity documents create ../functions/klaviyo-campaign-create/document.json --replace

# Back to project root for function testing
cd ..
npx sanity functions test klaviyo-campaign-create --file functions/klaviyo-campaign-create/document.json --dataset production --with-user-token
```

--------------------------------

### Update Sanity Document Fields with Patch

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/first-published/README.md

Examples of using the Sanity client patch method to set fields conditionally. This includes changing field names and setting multiple metadata fields simultaneously using setIfMissing to prevent overwriting existing data.

```typescript
await client.patch(data._id, {
  setIfMissing: {
    initialPublishDate: new Date().toISOString(),
  },
})
```

```typescript
await client.patch(data._id, {
  setIfMissing: {
    firstPublished: new Date().toISOString(),
    publishedYear: new Date().getFullYear(),
    publishedMonth: new Date().getMonth() + 1,
  },
})
```

--------------------------------

### Check Oxlint

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Runs Oxlint, a fast Rust-based linter, to check for code quality issues. Fix issues with `pnpm chore:oxlint:fix`.

```bash
pnpm check:oxlint
```

--------------------------------

### Configure Sanity Studio Workspace

Source: https://github.com/sanity-io/sanity/blob/main/ARCHITECTURE.md

Demonstrates the use of defineConfig to initialize a Sanity Studio workspace. It defines the project connection settings, schema types, and active plugins.

```typescript
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

export default defineConfig({
  name: 'default',
  projectId: 'your-project-id',
  dataset: 'production',

  schema: {
    types: [
      /* document and object types */
    ],
  },

  plugins: [
    structureTool(),
    // Additional plugins...
  ],
})
```

--------------------------------

### Run Tests

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Executes all unit tests using Vitest. Tests are sharded in the CI environment.

```bash
pnpm test
```

--------------------------------

### Run a Single Unit Test File

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Execute a specific unit test file using Vitest directly. Ensure you use the --project flag to target the correct project and avoid running all tests.

```bash
pnpm vitest run --project=sanity packages/sanity/src/core/hooks/useClient.test.ts
```

--------------------------------

### Check Code for Issues

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Use oxlint and eslint to check for code quality issues. Run lint:fix to automatically resolve fixable issues.

```bash
pnpm lint              # Check for issues
pnpm lint:fix          # Auto-fix issues
```

--------------------------------

### Check Dependencies

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Runs depcheck to identify unused or missing dependencies in the project.

```bash
pnpm depcheck
```

--------------------------------

### Run Export Tests

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Verifies that the project's exports are compatible across different module formats (ESM, CJS, DTS).

```bash
pnpm test:exports
```

--------------------------------

### Handling global intents

Source: https://github.com/sanity-io/sanity/blob/main/packages/sanity/src/router/README.md

Explains how to mount intent routes for global action dispatching and how to use the IntentLink component in React.

```javascript
route.intents('/intents')

// React usage:
<IntentLink intent="open" params={{id: 'abc33'}}>
  Open document
</IntentLink>
```

--------------------------------

### Configure Environment Variables for E2E Tests

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Set environment variables in .env.local to provide authentication tokens and project details for End-to-End tests.

```bash
SANITY_E2E_SESSION_TOKEN=<your-token>
SANITY_E2E_PROJECT_ID=<project-id>
SANITY_E2E_DATASET=<dataset-name>
```

--------------------------------

### Create Sanity Studio Plugin

Source: https://github.com/sanity-io/sanity/blob/main/ARCHITECTURE.md

Shows how to extend Sanity Studio functionality using the definePlugin factory. Plugins can inject custom schema types, tools, document actions, and UI components.

```typescript
import {definePlugin} from 'sanity'

export const myPlugin = definePlugin({
  name: 'my-plugin',

  // Add schema types
  schema: {
    types: [
      /* custom types */
    ],
  },

  // Add tools to navigation
  tools: [
    /* custom tools */
  ],

  // Customize document actions
  document: {
    actions: (prev, context) => [...prev, customAction],
  },

  // Add studio components
  studio: {
    components: {
      /* component overrides */
    },
  },
})
```

--------------------------------

### Watch Mode for Development

Source: https://github.com/sanity-io/sanity/blob/main/AGENTS.md

Enables watch mode for the build system, automatically rebuilding packages when changes are detected. Useful during development.

```bash
pnpm watch
```

--------------------------------

### Implementing router scopes

Source: https://github.com/sanity-io/sanity/blob/main/packages/sanity/src/router/README.md

Shows how to create isolated routing namespaces where specific application parts remain agnostic of the global routing schema.

```javascript
import {route} from './src'
function findAppByName(name) {
  return (
    name === 'pokemon' && {
      name: 'pokemon',
      router: route('/:section', route('/:pokemonName')),
    }
  )
}

const router = route('/', [
  route('/users/:username'),
  route('/apps/:appName', (params) => {
    const app = findAppByName(params.appName)
    return app && route.scope(app.name, '/', app.router)
  }),
])
```

--------------------------------

### Archive Channel via Miriad API

Source: https://github.com/sanity-io/sanity/blob/main/scripts/trigger-triage/README.md

Demonstrates the Miriad REST API call equivalent for archiving a channel. This is what the archive mode of the script interacts with.

```bash
curl -X POST "$MIRIAD_URL/channels/$CHANNEL_ID/archive" \
  -H "Authorization: Bearer $MIRIAD_TOKEN"
```

--------------------------------

### CLI Commands for Sanity Function Management

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/auto-redirect/README.md

Essential CLI commands for initializing blueprints, adding the auto-redirect function, and testing the implementation locally.

```bash
npx sanity blueprints init
npx sanity blueprints add function --example auto-redirect
npx sanity functions test auto-redirect --file functions/auto-redirect/document.json --with-user-token
npx sanity functions dev
```

--------------------------------

### Running Headful eFPS Tests

Source: https://github.com/sanity-io/sanity/blob/main/dev/efps/README.md

This command executes the eFPS performance tests with the `HEADLESS` environment variable set to `false`. This will open a Chrome browser instance, allowing you to visually observe the tests as they are being performed.

```bash
HEADLESS=false pnpm run efps:test
```

--------------------------------

### Initialize Stale Products Analysis Blueprint (Bash)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/stale-products-analysis/README.md

Commands to initialize or add the 'stale-products-analysis' blueprint to your Sanity.io project. This sets up the necessary files and configurations for the blueprint.

```bash
npx sanity blueprints init --example stale-products-analysis
```

```bash
npx sanity blueprints add function --example stale-products-analysis
```

--------------------------------

### Test Sanity Function Locally (Existing Document)

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-create/README.md

Bash commands to test the 'klaviyo-campaign-create' function locally using an existing document from your Sanity dataset. It queries and exports a document to a JSON file for testing.

```bash
# From the studio/ folder, find and export an existing document
cd studio
npx sanity documents query "*[_type == 'emails'][0]" > ../real-document.json

# Back to project root for function testing
cd ..
npx sanity functions test klaviyo-campaign-create --file real-document.json --dataset production --with-user-token
```

--------------------------------

### Build and Test Sanity Packages

Source: https://github.com/sanity-io/sanity/blob/main/CONTRIBUTING.md

Build the repository before running tests. This command runs tests for all Sanity packages; for specific issues, run tests within individual modules.

```sh
pnpm build
pnpm test
```

--------------------------------

### Initialize and Add Social Media Crosspost Blueprint

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/social-media-crosspost/README.md

Commands to initialize the Sanity blueprints system and add the social-media-crosspost function to the project.

```bash
npx sanity blueprints init
npx sanity blueprints add function --example social-media-crosspost
```

--------------------------------

### Test Sanity Functions with CLI

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-send/README.md

Commands to execute Sanity functions using local JSON files as input. These snippets demonstrate how to query existing documents or create custom test files to simulate function triggers.

```bash
# Query existing document and test
cd studio
npx sanity documents query "*[_type == 'marketingCampaign'][0]" > ../real-campaign.json
cd ..
npx sanity functions test klaviyo-campaign-send --file real-campaign.json --dataset production --with-user-token
```

```bash
# Create test document and test
cat > test-marketing-campaign.json << EOF
{
  "_type": "marketingCampaign",
  "title": "Test Campaign Send",
  "status": "ready",
  "klaviyoCampaignId": "your-klaviyo-campaign-id",
  "email": {"_ref": "existing-email-id", "_type": "reference"},
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
  "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"
}
EOF
npx sanity documents create test-marketing-campaign.json --replace
npx sanity functions test klaviyo-campaign-send --file test-marketing-campaign.json --dataset production --with-user-token
```

--------------------------------

### Test Sanity Functions with Real Document Data

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/klaviyo-campaign-create/README.md

Fetches an existing document from the Sanity dataset and uses it as input for function testing to ensure real-world compatibility.

```bash
cd studio
npx sanity documents query "*[_type == 'emails' && status != 'sent'][0]" > ../test-real-document.json
cd ..
npx sanity functions test klaviyo-campaign-create --file test-real-document.json --dataset production --with-user-token
```

--------------------------------

### Key Imports for Sanity.io Configuration and Development

Source: https://github.com/sanity-io/sanity/blob/main/docs/CORE_CONCEPTS.md

Lists essential imports for working with Sanity.io, including configuration utilities (`defineConfig`, `definePlugin`), document utilities (`getDraftId`), hooks (`useClient`), form manipulation functions (`set`, `unset`), and core types (`SanityDocument`).

```typescript
import {
  // Configuration
  defineConfig,
  definePlugin,
  defineType,
  defineField,

  // Document utilities
  getDraftId,
  getPublishedId,
  isDraftId,

  // Hooks
  useClient,
  useSchema,
  usePerspective,
  useActiveReleases,

  // Form
  set,
  unset,
  insert,

  // Types
  type SanityDocument,
  type SchemaType,
  type Tool,
  type Plugin,
} from 'sanity'
```

--------------------------------

### Manage E2E Development and Build Tasks

Source: https://github.com/sanity-io/sanity/blob/main/e2e/README.md

Utility commands for managing the E2E studio environment, including development mode, building, previewing, and generating test code via Playwright.

```shell
pnpm e2e:dev
pnpm e2e:build
pnpm e2e:codegen
pnpm e2e:start
pnpm e2e:preview
```

--------------------------------

### Customize Tag Prefixes and Processing

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/product-mapping/README.md

Demonstrates how to modify the filter logic to support custom tag prefixes for product maps and color variants.

```typescript
// Change the parent tag prefix
const parentTags = tags.filter((tag) => tag.startsWith('custom-parent-'))
const productMapName = tag.replace('custom-parent-', '')

// Change the color tag prefix
const colorTags = tags.filter((tag) => tag.startsWith('custom-color-'))
const colorName = tag.replace('custom-color-', '')
```

--------------------------------

### Query Image Metadata with GROQ

Source: https://github.com/sanity-io/sanity/blob/main/examples/functions/media-library-auto-alt-text/README.md

Demonstrates how to dereference the 'currentVersion' field in a GROQ query to access image metadata such as keywords and EXIF data stored on the image asset document.

```GROQ
*[_id == $assetContainerId][0]{
  ...,
  "metadata": currentVersion->{
    metadata
  }
}
```