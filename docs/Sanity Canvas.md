### Beam Internal Blog Setup

Source: https://vercel.com/guides/deploying-sanity-studio-with-vercel

Provides setup instructions for the Beam Internal Blog, including dependency installation, database setup with PlanetScale and Prisma, authentication configuration with NextAuth.js, and optional image uploads using Cloudinary.

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npx prisma db push
```

```bash
npm run dev
```

--------------------------------

### Sanity Setup Interactive Prompt Example

Source: https://github.com/sanity-io/demo-graphql-presentation-nextjs

An example of the interactive prompts encountered during the Sanity setup process, showing package installation, account verification, project selection, and environment variable detection for frameworks like Next.js.

```shell
Need to install the following packages:
sanity@3.30.1
Ok to proceed? (y) y
You're setting up a new project!
We'll make sure you have an account with Sanity.io.
Press ctrl + C at any time to quit.

Prefer web interfaces to terminals?
You can also set up best practice Sanity projects with
your favorite frontends on https://www.sanity.io/templates

Looks like you already have a Sanity-account. Sweet!

✔ Fetching existing projects
? Select project to use Templates [r0z1eifg]
? Select dataset to use graphql
? Would you like to add configuration files for a Sanity project in this Next.js folder? No

Detected framework Next.js, using prefix 'NEXT_PUBLIC_'
Found existing NEXT_PUBLIC_SANITY_PROJECT_ID, replacing value.
Found existing NEXT_PUBLIC_SANITY_DATASET, replacing value.
```

--------------------------------

### React Compiler Installation Guide

Source: https://react.dev/learn/react-compiler

Provides instructions and guidance on how to get started with installing React Compiler. It also covers configuration steps for build tools.

```markdown
Get started with [installing React Compiler](/learn/react-compiler/installation) and learn how to configure it with your build tools.
```

--------------------------------

### SvelteKit Getting Started

Source: https://kit.svelte.dev/docs/creating-a-project

Guides users through the initial steps of setting up a SvelteKit project, covering project creation, types, and structure.

```javascript
{
  title: "Getting started",
  children: [
    { title: "Introduction", path: "/tutorial/kit/introduction" },
    { title: "Creating a project", path: "/tutorial/kit/creating-a-project" },
    { title: "Project types", path: "/tutorial/kit/project-types" },
    { title: "Project structure", path: "/tutorial/kit/project-structure" },
    { title: "Web standards", path: "/tutorial/kit/web-standards" }
  ]
}
```

--------------------------------

### Local Project Setup Commands

Source: https://vercel.com/guides/deploying-sanity-studio-with-vercel

Commands for setting up the project locally, including linking to Vercel, pulling environment variables, and installing dependencies.

```shell
npx vercel link
npx vercel env pull
```

--------------------------------

### Get Started with Sanity

Source: https://www.sanity.io/studio

This section provides a call to action for users to begin their journey with Sanity. It includes a primary button to 'Get Started' and a secondary command to initiate a new Sanity project via npm.

```APIDOC
Sanity Project Initialization:

- **Get Started**
  - Description: Navigate to the Sanity getting started page to begin your project.
  - Action: Navigate to '/get-started'

- **Initialize Sanity Project**
  - Description: Use the npm command to create a new Sanity project.
  - Command: npm create sanity@latest
  - Usage Example:
    ```bash
    npm create sanity@latest
    ```
  - Related: This command sets up the foundational structure for a Sanity project, often used as the first step after signing up.
```

--------------------------------

### Running Next.js Locally

Source: https://vercel.com/guides/deploying-sanity-studio-with-vercel

Commands to install dependencies and start the Next.js development server. This enables hot reloading for frontend and studio configuration changes.

```bash
npm install && npm run dev
```

--------------------------------

### Project Overview and Setup

Source: https://vercel.com/guides/deploying-sanity-studio-with-vercel

This section outlines the project structure, configuration steps, and how to run the Next.js application locally. It details environment setup, local development, and deployment.

```APIDOC
Project Setup:

## Project Overview

| Blog Link | Studio Link |
| ------------------ | ------------- |
| [https://nextjs-blog.sanity.build](https://nextjs-blog.sanity.build) | [https://nextjs-blog.sanity.build/studio](https://nextjs-blog.sanity.build/studio) |

## Configuration

### Step 1. Set up the environment

- Ensure you have Node.js installed.
- Set up your Sanity project and obtain API credentials.
- Configure environment variables (e.g., `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`).

### Step 2. Set up the project locally

- Clone the repository: `git clone https://github.com/sanity-io/nextjs-blog-cms-sanity-v3.git`
- Navigate to the project directory: `cd nextjs-blog-cms-sanity-v3`
- Install dependencies: `npm install` or `yarn install`

### Step 3. Run Next.js locally in development mode

- Start the development server: `npm run dev` or `yarn dev`
- Access the blog at `http://localhost:3000`.

### Step 4. Deploy to production

- Use platforms like Vercel for easy deployment.
- Configure build settings and environment variables on the deployment platform.

## Questions and Answers

### It doesn't work! Where can I get help?

- Consult the Sanity documentation and community forums.
- Check the GitHub repository issues for similar problems.

### How can I remove the "Next steps" block from my blog?

- Modify the relevant component in the Next.js frontend code to remove or comment out the block.

### How can I set up Incremental Static Revalidation?

- Configure webhooks in your Sanity project to trigger revalidation on content updates.
- Implement the revalidation logic within your Next.js API routes.
```

--------------------------------

### Development Commands

Source: https://github.com/sanity-io/3rd-party-auth-example

Commands to install dependencies, run tests, and start the development server for the application.

```bash
npm i
npm run test
npm run dev
```

--------------------------------

### Run Next.js Development Server

Source: https://vercel.com/guides/deploying-sanity-studio-with-vercel

Commands to install project dependencies and start the Next.js development server, enabling hot reloading for frontend and studio changes.

```shell
npm install && npm run dev
```

--------------------------------

### Install and Run Development Server

Source: https://github.com/sanity-io/3rd-party-auth-example

Commands to install project dependencies, run tests, and start the development server. The application uses Redis for session storage, with a fallback to a memory store for TDD.

```shell
npm i
npm run test
npm run dev // Start development server
```

--------------------------------

### Next.js Development Setup

Source: https://github.com/sanity-io/next.js/tree/canary/examples/cms-sanity

Command to install project dependencies and start the Next.js development server. This step is essential after configuring environment variables.

```shell
npm install && npm run dev
```

--------------------------------

### nvm Install and Use Example

Source: https://github.com/nvm-sh/nvm

Demonstrates the process of installing a specific Node.js version using nvm and then switching to it. Shows typical output during installation and verification.

```shell
PATH=/path/to/project/.nvmrc with version <5.9>
Downloading and installing node v5.9.1...
Downloading https://nodejs.org/dist/v5.9.1/node-v5.9.1-linux-x64.tar.xz...
# ################################################################################### 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v5.9.1 (npm v3.7.3)
```

--------------------------------

### Run Next.js Locally

Source: https://vercel.com/guides/deploying-sanity-studio-with-vercel

Installs project dependencies and starts the Next.js development server. This command enables hot reloading for frontend and studio configuration changes, making development efficient. The blog will be accessible at http://localhost:3000 and the studio at http://localhost:3000/studio.

```shell
npm install && npm run dev
```

--------------------------------

### Install React Router Project using Template

Source: https://reactrouter.com/start/framework/installation

This snippet shows how to create a new React Router project using the `create-react-router` command-line tool with a default template. It then guides through navigating into the project directory, installing necessary dependencies, and starting the development server.

```shell
npx create-react-router@latest my-react-router-app
cd my-react-router-app
npm i
npm run dev
```

--------------------------------

### Development Setup Steps

Source: https://nuxt.com/modules/sanity

Steps to set up the development environment for the Sanity.io LLMs project. This includes cloning the repository, installing dependencies, preparing the module, and starting the development server.

```bash
Clone this repository
Install dependencies using pnpm install
Stub module with pnpm dev:prepare
Start development server using pnpm dev
```

--------------------------------

### Next.js App Router: Images Guide

Source: https://nextjs.org/docs/app/getting-started

Documentation on handling images within the Next.js App Router. Covers optimization, loading, and best practices for image integration.

```javascript
{
  "className": "bg-gray-0 shadow-border group block space-y-2 rounded-md p-6 pt-5 transition-shadow duration-300 hover:shadow-lg",
  "href": "/docs/app/getting-started/images",
  "children": [
    {
      "className": "group-hover:text-gray-1000 truncate text-lg font-medium leading-snug",
      "children": "Images"
    },
    {
      "className": "line-clamp-3 text-sm font-normal text-gray-900",
      "children": "Learn about handling images in your application."
    }
  ]
}
```

--------------------------------

### Testing Setup with Jest and React Testing Library

Source: https://nextjs.org/docs/app/getting-started

Configure your Next.js project for testing using popular tools like Jest and React Testing Library for unit and integration tests.

```javascript
// Example jest.config.js for Next.js:
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jest-environment-jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//   },
// };
// 
// // Example test file:
// import { render, screen } from '@testing-library/react';
// import MyComponent from '../components/MyComponent';
// 
// test('renders MyComponent', () => {
//   render(<MyComponent />);
//   expect(screen.getByText('Hello')).toBeInTheDocument();
// });
```

--------------------------------

### Sanity CLI Setup Sample Output

Source: https://github.com/sanity-io/demo-graphql-presentation-nextjs/tree/pages-router

A sample of the interactive prompts and output you can expect when running the Sanity CLI setup commands, including package installation confirmation and project initialization messages.

```shell
Need to install the following packages:
sanity@3.30.1
Ok to proceed? (y) y
You're setting up a new project!
We'll make sure you have an account with Sanity.io.
Press ctrl + C at any time to quit.

Prefer web interfaces to terminals?
You can also
```

--------------------------------

### Run Sanity Project Setup

Source: https://github.com/sanity-io/demo-graphql-presentation-nextjs/tree/pages-router

Execute the setup command using npm, yarn, or pnpm to initialize your Sanity project. This process guides you through setting up a Sanity project, dataset, and their corresponding environment variables.

```shell
npm run setup
```

```shell
yarn setup
```

```shell
pnpm setup
```

--------------------------------

### Install and Run Next.js Blog

Source: https://github.com/sanity-io/demo-graphql-presentation-nextjs/tree/pages-router

Commands to install project dependencies and start the Next.js development server using different package managers (npm, yarn, pnpm).

```shell
npm install && npm run dev
```

```shell
yarn install && yarn dev
```

```shell
pnpm install && pnpm dev
```

--------------------------------

### Install and Run Development Server

Source: https://github.com/portabletext/react-pdf-portabletext

Installs project dependencies using pnpm and starts the development server. This command is used to launch a simple browser-based demo application, facilitating the development and visual confirmation of changes and serializers for new test components.

```bash
pnpm install && pnpm run dev
```

--------------------------------

### runtime-configuration

Source: https://nextjs.org/docs/app/getting-started

Add client and server runtime configuration to your Next.js app.

```APIDOC
runtime-configuration:
  description: Add client and server runtime configuration to your Next.js app.
  details: Provides a way to expose environment variables to the browser and server at runtime, enabling dynamic configuration.
```

--------------------------------

### Sanity Project Setup Output and Configuration

Source: https://github.com/sanity-io/next.js/tree/canary/examples/cms-sanity

Illustrates the interactive prompts and output during the Sanity project setup, including package installation confirmation, account status, project/dataset selection, and environment variable detection for Next.js projects.

```shell
Need to install the following packages:
sanity@3.30.1
Ok to proceed? (y) y
You're setting up a new project!
We'll make sure you have an account with Sanity.io.
Press ctrl + C at any time to quit.

Prefer web interfaces to terminals?
You can also set up best practice Sanity projects with
your favorite frontends on https://www.sanity.io/templates

Looks like you already have a Sanity-account. Sweet!

✔ Fetching existing projects
? Select project to use Templates [r0z1eifg]
? Select dataset to use blog-vercel
? Would you like to add configuration files for a Sanity project in this Next.js folder? No

Detected framework Next.js, using prefix 'NEXT_PUBLIC_'
Found existing NEXT_PUBLIC_SANITY_PROJECT_ID, replacing value.
Found existing NEXT_PUBLIC_SANITY_DATASET, replacing value.
```

--------------------------------

### Next.js App Router: Fetching Data Guide

Source: https://nextjs.org/docs/app/getting-started

Details on how to fetch data and stream content that depends on fetched data within the Next.js App Router. Covers essential patterns for data retrieval.

```javascript
{
  "className": "bg-gray-0 shadow-border group block space-y-2 rounded-md p-6 pt-5 transition-shadow duration-300 hover:shadow-lg",
  "href": "/docs/app/getting-started/fetching-data",
  "children": [
    {
      "className": "group-hover:text-gray-1000 truncate text-lg font-medium leading-snug",
      "children": "Fetching Data"
    },
    {
      "className": "line-clamp-3 text-sm font-normal text-gray-900",
      "children": "Learn how to fetch data and stream content that depends on data."
    }
  ]
}
```

--------------------------------

### Next.js Getting Started: Installation

Source: https://nextjs.org/docs/app/building-your-application/routing/route-groups

How to create a new Next.js application with `create-next-app`. This guide covers setting up TypeScript, ESLint, and configuring your `next.config.js` file.

```APIDOC
Next.js Project Initialization:
  Steps to create a new Next.js application.
  Dependencies: Node.js, npm/yarn/pnpm
  Process:
    1. Use `create-next-app` CLI.
    2. Configure project settings (TypeScript, ESLint, Router).
    3. Set up `next.config.js` for custom configurations.

Example Command:
npx create-next-app@latest my-app

Configuration (`next.config.js`):
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
};

TypeScript Setup:
  Ensure `tsconfig.json` is present and configured correctly.
```

--------------------------------

### Install and Run Sanity.io Project

Source: https://github.com/sanity-io/demo-graphql-presentation-nextjs

These commands are used to install project dependencies and start the development server for your Sanity.io blog. You can choose the command that corresponds to your preferred package manager (npm, yarn, or pnpm). After execution, the blog is typically accessible at http://localhost:3000.

```shell
npm install && npm run dev
```

```shell
yarn install && yarn dev
```

```shell
pnpm install && pnpm dev
```

--------------------------------

### Next.js next.config.js Configuration Options

Source: https://nextjs.org/docs/app/getting-started

Comprehensive guide to configuring your Next.js application using the next.config.js file. This section details various options for routing, asset handling, build processes, environment variables, and other core functionalities.

```APIDOC
next.config.js Configuration Options:

appDir:
  - Description: Enable the App Router to use layouts, streaming, and more.

assetPrefix:
  - Description: Configure your CDN by using the assetPrefix config option.

basePath:
  - Description: Use `basePath` to deploy a Next.js application under a sub-path of a domain.

compress:
  - Description: Next.js provides gzip compression to compress rendered content and static files. It only works with the server target.

devIndicators:
  - Description: Optimized pages include an indicator to let you know if it's being statically optimized. You can opt-out of this behavior.

distDir:
  - Description: Set a custom build directory to use instead of the default .next directory.

env:
  - Description: Add and access environment variables in your Next.js application at build time.

eslint:
  - Description: Next.js reports ESLint errors and warnings during builds by default. Learn how to opt-out of this behavior.

exportPathMap:
  - Description: Customize the pages that will be exported as HTML files when using `next export`.

generateBuildId:
  - Description: Configure the build id, which is used to identify the current build in which your application is being served.

generateEtags:
  - Description: Next.js will generate etags for every page by default. Learn more about how to disable etag generation.

headers:
  - Description: Add custom HTTP headers to your Next.js app.

httpAgentOptions:
  - Description: Next.js will automatically use HTTP Keep-Alive by default. Learn more about how to disable HTTP Keep-Alive.

images:
  - Description: Custom configuration for the next/image component, including domains, image sizes, and device sizes.
```

--------------------------------

### Next.js CLI Commands

Source: https://nextjs.org/docs/app/getting-started

Documentation for essential Next.js command-line interface commands used for project creation and management.

```APIDOC
CLI Commands:

create-next-app:
  - Description: Scaffolds a new Next.js application with a starter template.
  - Usage: npx create-next-app@latest <project-name>
  - Options:
    - --typescript: Initialize with TypeScript.
    - --eslint: Initialize with ESLint.
    - --app: Initialize with the App Router.
    - --no-app: Initialize with the Pages Router.

next:
  - Description: Runs Next.js development server, builds, or exports the application.
  - Usage:
    - next dev: Starts the development server.
    - next build: Builds the application for production.
    - next start: Starts the production server.
    - next export: Exports the application to static HTML.
```

--------------------------------

### output

Source: https://nextjs.org/docs/app/getting-started

Next.js automatically traces which files are needed by each page to allow for easy deployment of your application. Learn how it works here.

```APIDOC
output:
  description: Next.js automatically traces which files are needed by each page to allow for easy deployment.
  details: Configures how Next.js determines and outputs the necessary files for deployment, impacting build output and deployment size.
```

--------------------------------

### Sanity Project Setup Command

Source: https://github.com/sanity-io/next.js/tree/canary/examples/cms-sanity

Executes the Sanity CLI setup process for a new project. It prompts for package installation, account verification, project selection, and dataset configuration.

```shell
pnpm run setup
```

--------------------------------

### Sanity Client Setup and Usage with Bun

Source: https://reference.sanity.io/_sanity/client/

Provides instructions for setting up a project with Bun, installing the Sanity client, and using it to fetch data. Includes commands for initialization and running the script.

```shell
bun init
bun add @sanity/client
open index.ts

```

```typescript
import {
  createClient
} from '@sanity/client';

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'your-dataset-name',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2025-02-06', // use current date (YYYY-MM-DD) to target the latest API version.
});

const data = await client.fetch<number>(`count(*)`);
console.write(`Number of documents: ${data}`);

```

```shell
bun run index.ts
# Expected output: Number of documents ${number}

```

--------------------------------

### Local Project Setup Commands

Source: https://vercel.com/guides/deploying-sanity-studio-with-vercel

Essential bash commands for setting up the Next.js project locally, including linking to Vercel and pulling environment variables for Sanity integration.

```bash
npx vercel link
  Links your local project to a Vercel project.

npx vercel env pull
  Downloads environment variables needed to connect Next.js and the Studio to your Sanity project.
```

--------------------------------

### Install Dependencies and Run Tests with npm

Source: https://github.com/sanity-io/groq-js

This snippet demonstrates the standard procedure for setting up a project by installing its dependencies using 'npm install' and then executing the test suite with 'npm test'. It's a common pattern for Node.js projects.

```shell
# Install dependencies
npm i

# Run tests
npm test
```

--------------------------------

### Install Project Dependencies

Source: https://github.com/sanity-io/visual-editor-react-native

Installs all necessary project dependencies using pnpm. Ensure pnpm is installed and configured on your system before running this command.

```shell
pnpm install
```

--------------------------------

### Next.js App Router: Error Handling Guide

Source: https://nextjs.org/docs/app/getting-started

Details on how to display expected errors and handle uncaught exceptions within the Next.js App Router. Crucial for robust application development.

```javascript
{
  "className": "bg-gray-0 shadow-border group block space-y-2 rounded-md p-6 pt-5 transition-shadow duration-300 hover:shadow-lg",
  "href": "/docs/app/getting-started/error-handling",
  "children": [
    {
      "className": "group-hover:text-gray-1000 truncate text-lg font-medium leading-snug",
      "children": "Error Handling"
    },
    {
      "className": "line-clamp-3 text-sm font-normal text-gray-900",
      "children": "Learn how to display expected errors and handle uncaught exceptions."
    }
  ]
}
```

--------------------------------

### Sanity Client Setup and Usage with Bun

Source: https://reference.sanity.dev/_sanity/client/

Provides instructions for setting up a project with Bun, installing the Sanity client, and using it to fetch data. Includes commands for initialization and running the script.

```shell
bun init
bun add @sanity/client
open index.ts

```

```typescript
import {
  createClient
} from '@sanity/client';

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'your-dataset-name',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2025-02-06', // use current date (YYYY-MM-DD) to target the latest API version.
});

const data = await client.fetch<number>(`count(*)`);
console.write(`Number of documents: ${data}`);

```

```shell
bun run index.ts
# Expected output: Number of documents ${number}

```

--------------------------------

### Next.js API Reference: Configuration Options

Source: https://nextjs.org/docs/app/getting-started

Comprehensive list of options available in `next.config.js` for customizing Next.js build, runtime, and development behavior.

```APIDOC
next.config.js Options:
  Description: Configuration file for Next.js.

Common Options:
  - basePath:
    - Type: string
    - Description: Prepends a custom base path to all routes.
    - Example: `basePath: '/docs'`
  - assetPrefix:
    - Type: string
    - Description: Prefixes all assets with a custom domain or path.
    - Example: `assetPrefix: 'https://cdn.example.com'`
  - output:
    - Type: 'standalone' | 'export'
    - Description: Configures the output format for deployment.
    - 'standalone': Creates a self-contained output for Docker.
    - 'export': Exports the application as static HTML.
  - images:
    - Type: object
    - Description: Configuration for the Image component.
    - Properties:
      - domains: Allowed image domains.
      - loader: Custom image loader.
      - deviceSizes: Device sizes for responsive images.
      - imageSizes: Image sizes.
      - path: Path for image optimization.
      - unoptimized: Disable image optimization.
  - env:
    - Type: object
    - Description: Exposes environment variables to the Next.js application.
    - Example: `env: { MY_VAR: 'value' }`
  - reactStrictMode:
    - Type: boolean
    - Default: false
    - Description: Enables React Strict Mode.
  - pageExtensions:
    - Type: string[]
    - Default: ['tsx', 'ts', 'jsx', 'js']
    - Description: File extensions for pages.
  - headers:
    - Type: function
    - Description: Function to add custom headers to responses.
    - Example:
      async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'X-Custom-Header',
                value: 'my-value',
              },
            ],
          },
        ];
      }
  - redirects:
    - Type: function
    - Description: Function to add custom redirects.
    - Example:
      async redirects() {
        return [
          {
            source: '/old-page', 
            destination: '/new-page',
            permanent: true,
          },
        ];
      }
  - allowedDevOrigins:
    - Type: Array<string | URL>
    - Description: Origins allowed for development server.
  - bundlePagesRouterDependencies:
    - Type: boolean
    - Description: Bundles dependencies for pages router.
  - compress:
    - Type: boolean
    - Description: Enables gzip compression.
  - crossOrigin:
    - Type: 'anonymous' | 'use-credentials'
    - Description: Sets the cross-origin attribute for scripts.
  - devIndicators:
    - Type: object
    - Description: Configuration for development indicators.
    - Properties:
      - buildActivity: Show build activity.
      - capability: Show capabilities.
      - connection: Show connection status.
      - refreshUi: Show refresh UI.
  - distDir:
    - Type: string
    - Description: Directory for build output.
  - eslint:
    - Type: object
    - Description: ESLint configuration.
  - exportPathMap:
    - Type: function
    - Description: Custom export path mapping for static exports.
  - generateBuildId:
    - Type: function
    - Description: Custom function to generate build ID.
  - generateEtags:
    - Type: object
    - Description: Configuration for ETags.
  - httpAgentOptions:
    - Type: object
    - Description: Options for the HTTP agent.
  - onDemandEntries:
    - Type: object
    - Description: Configuration for on-demand compilation.
  - optimizePackageImports:
    - Type: Array<string>
    - Description: Packages to optimize imports from.
  - productionBrowserSourceMaps:
    - Type: boolean
    - Description: Enable source maps in production.
  - poweredByHeader:
    - Type: boolean
    - Description: Show the 'X-Powered-By' header.
```

--------------------------------

### Next.js App Router: Updating Data Guide

Source: https://nextjs.org/docs/app/getting-started

Explains how to mutate data using Server Functions within the Next.js App Router. Covers patterns for data modification and state management.

```javascript
{
  "className": "bg-gray-0 shadow-border group block space-y-2 rounded-md p-6 pt-5 transition-shadow duration-300 hover:shadow-lg",
  "href": "/docs/app/getting-started/updating-data",
  "children": [
    {
      "className": "group-hover:text-gray-1000 truncate text-lg font-medium leading-snug",
      "children": "Updating Data"
    },
    {
      "className": "line-clamp-3 text-sm font-normal text-gray-900",
      "children": "Learn how to mutate data using Server Functions."
    }
  ]
}
```

--------------------------------

### Install Project Dependencies

Source: https://github.com/sanity-io/visual-editor-react-native

Installs all necessary project dependencies using the pnpm package manager, as recommended for this project.

```bash
pnpm install
```

--------------------------------

### Next.js App Router: CSS Guide

Source: https://nextjs.org/docs/app/getting-started

Explores various methods for adding CSS to Next.js applications, including CSS Modules, Global CSS, Tailwind CSS, and more. Provides guidance on styling strategies.

```javascript
{
  "className": "bg-gray-0 shadow-border group block space-y-2 rounded-md p-6 pt-5 transition-shadow duration-300 hover:shadow-lg",
  "href": "/docs/app/getting-started/css",
  "children": [
    {
      "className": "group-hover:text-gray-1000 truncate text-lg font-medium leading-snug",
      "children": "CSS"
    },
    {
      "className": "line-clamp-3 text-sm font-normal text-gray-900",
      "children": "Learn about the different ways to add CSS to your application, including CSS Modules, Global CSS, Tailwind CSS, and more."
    }
  ]
}
```

--------------------------------

### Development Setup Commands

Source: https://nuxt.com/modules/sanity

A sequence of shell commands required to set up the development environment. This includes cloning the repository, installing dependencies using pnpm, preparing the module, and starting the development server.

```shell
pnpm install
```

```shell
pnpm dev:prepare
```

```shell
pnpm dev
```

--------------------------------

### Local Development Setup Commands

Source: https://vercel.com/guides/deploying-sanity-studio-with-vercel

Commands to link your local project with Vercel and pull environment variables for connecting to your Sanity project.

```bash
npx vercel link
npx vercel env pull
```

--------------------------------

### Initialize Astro Project

Source: https://www.sanity.io/guides/sanity-astro-blog

Command to create a new Astro project. It prompts the user for project setup details and installs the necessary dependencies. It's recommended to select a basic, minimal starter for this guide.

```sh
npm create astro@latest
```

--------------------------------

### Install NVM in Docker for CI/CD Jobs

Source: https://github.com/nvm-sh/nvm

This Dockerfile example shows a more robust setup for installing NVM and Node.js, suitable for CI/CD pipelines. It starts from an Ubuntu base image, installs curl, downloads and installs NVM using the BASH_ENV variable, and sets a default Node.js version.

```dockerfile
FROM ubuntu:latest
ARG NODE_VERSION=20

# install curl
RUN apt update && apt install curl -y

# install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Set BASH_ENV to source nvm scripts in non-interactive shells
ENV BASH_ENV /root/.bash_env
RUN touch "${BASH_ENV}"
RUN echo '. "${BASH_ENV}"' >> ~/.bashrc

# Install Node.js version
RUN echo "${NODE_VERSION}" > .nvmrc
RUN nvm install ${NODE_VERSION}
RUN nvm use ${NODE_VERSION}
RUN nvm alias default ${NODE_VERSION}
```

--------------------------------

### Run Sanity Project Setup

Source: https://github.com/sanity-io/demo-graphql-presentation-nextjs/tree/pages-router

Executes the setup script for the Sanity project within the Next.js application. This command typically installs Sanity dependencies and prompts for project configuration details.

```bash
npm run setup
```

```bash
yarn setup
```

```bash
pnpm setup
```

--------------------------------

### Project Setup and Data Generation Commands

Source: https://github.com/sanity-io/demo-course-platform

Commands for cloning the repository, installing dependencies, initializing Sanity, importing data, and generating seed data. These steps are crucial for setting up the project environment and populating it with initial content.

```APIDOC
Project Setup and Data Generation:

1. Clone the repository:
   git clone https://github.com/sanity-io/course-platform.git

2. Install dependencies:
   - In the root folder: pnpm install
   - In the /studio folder: pnpm install
   - In the /web folder: pnpm install
   (Note: The example uses pnpm, but npm or yarn can also be used if preferred.)

3. Initialize Sanity Project (if creating a new Sanity project):
   npx sanity@latest init --env
   (Replace the existing sanity.config.tsx file with the one provided in the repository.)

4. Import Seed Data:
   npx sanity dataset import seed-data.ndjson
   (This command imports the initial dataset into your Sanity project.)

5. Generate New Seed Data:
   npm run generate-seed
   (This command runs the script to generate new seed data, typically located in studio/scripts/generateSeedData.ts.)
```

--------------------------------

### Initialize gcloud CLI

Source: https://cloud.google.com/sdk/docs/install

Initializes the Google Cloud CLI after installation, guiding the user through authentication and project configuration.

```shell
gcloud init
```

--------------------------------

### File Conventions: page.js

Source: https://nextjs.org/docs/app/getting-started

API reference for the `page.js` file. Defines the unique UI for each route segment.

```javascript
// app/page.js
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

--------------------------------

### Next.js App Router: Caching and Revalidating Data Guide

Source: https://nextjs.org/docs/app/getting-started

Covers strategies for caching and revalidating data in Next.js applications. Essential for performance optimization and data freshness.

```javascript
{
  "className": "bg-gray-0 shadow-border group block space-y-2 rounded-md p-6 pt-5 transition-shadow duration-300 hover:shadow-lg",
  "href": "/docs/app/getting-started/caching-and-revalidating",
  "children": [
    {
      "className": "group-hover:text-gray-1000 truncate text-lg font-medium leading-snug",
      "children": "Caching and Revalidating"
    },
    {
      "className": "line-clamp-3 text-sm font-normal text-gray-900",
      "children": "Learn how to cache and revalidate data in your application."
    }
  ]
}
```

--------------------------------

### Install and Run Project with Package Managers

Source: https://github.com/sanity-io/next.js/tree/canary/examples/cms-sanity

Provides commands to install project dependencies and start the development server using popular package managers: npm, yarn, and pnpm. These commands are crucial for initializing and running the project locally.

```shell
npm install && npm run dev
```

```shell
yarn install && yarn dev
```

```shell
pnpm install && pnpm dev
```

--------------------------------

### package.json: Optional Dependency Declaration

Source: https://www.arahansen.com/the-ultimate-guide-to-yarn-lock-lockfiles/

Example of declaring an optional dependency in a `package.json` file. Optional dependencies are installed by Yarn but do not cause installation to fail if they cannot be installed, providing flexibility for non-critical packages.

```json
"optionalDependencies": {
    "graceful-fs": "^4.1.6"
}
```

--------------------------------

### reactStrictMode

Source: https://nextjs.org/docs/app/getting-started

The complete Next.js runtime is now Strict Mode-compliant, learn how to opt-in.

```APIDOC
reactStrictMode:
  description: The complete Next.js runtime is now Strict Mode-compliant.
  details: Enables React's Strict Mode features within Next.js applications, helping to identify potential problems early in development.
```

--------------------------------

### File Conventions: instrumentation.js

Source: https://nextjs.org/docs/app/getting-started

API reference for the `instrumentation.js` file. Used to hook into Node.js runtime and register instrumentation.

```javascript
// app/instrumentation.js
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node');
  }
}
```

--------------------------------

### Copy Sanity Environment File

Source: https://github.com/sanity-io/demo-graphql-presentation-nextjs/tree/pages-router

Copy the example environment file to your local environment to begin setup. This file typically contains necessary Sanity project and dataset configurations.

```shell
cp -i .env.local.example .env.local
```

--------------------------------

### next.config.js Configuration Options

Source: https://nextjs.org/docs/app/getting-started

Comprehensive documentation for next.config.js options, covering assetPrefix, basePath, compress, crossOrigin, devIndicators, distDir, env, eslint, exportPathMap, generateBuildId, generateEtags, headers, and httpAgentOptions.

```APIDOC
next.config.js Options:

assetPrefix:
  Description: Learn how to use the assetPrefix config option to configure your CDN.
  Usage: Configure CDN paths for assets.

basePath:
  Description: Use `basePath` to deploy a Next.js application under a sub-path of a domain.
  Usage: Deploy applications under a specific URL path.

compress:
  Description: Next.js provides gzip compression to compress rendered content and static files. It only works with the server target.
  Usage: Enable or disable gzip compression for server-targeted builds.

crossOrigin:
  Description: Use the `crossOrigin` option to add a crossOrigin tag on the `script` tags generated by `next/script` and `next/head`.
  Usage: Control cross-origin attributes for script and head tags.

devIndicators:
  Description: Optimized pages include an indicator to let you know if it's being statically optimized. You can opt-out of it here.
  Usage: Configure or disable development indicators for optimized pages.

distDir:
  Description: Set a custom build directory to use instead of the default .next directory.
  Usage: Specify a custom output directory for the build.

env:
  Description: Learn to add and access environment variables in your Next.js application at build time.
  Usage: Define environment variables accessible during the build process.

eslint:
  Description: Next.js reports ESLint errors and warnings during builds by default. Learn how to opt-out of this behavior here.
  Usage: Configure ESLint integration during the build process.

exportPathMap:
  Description: Customize the pages that will be exported as HTML files when using `next export`.
  Usage: Define custom routing for static HTML exports.

generateBuildId:
  Description: Configure the build id, which is used to identify the current build in which your application is being served.
  Usage: Customize the unique identifier for each build.

generateEtags:
  Description: Next.js will generate etags for every page by default. Learn more about how to disable etag generation here.
  Usage: Enable or disable ETag generation for pages.

headers:
  Description: Add custom HTTP headers to your Next.js app.
  Usage: Define custom headers for responses.

httpAgentOptions:
  Description: Next.js will automatically...
```

--------------------------------

### Instrumentation for Server Startup Code

Source: https://nextjs.org/docs/app/getting-started

Understand how to use instrumentation to execute code at server startup in your Next.js application, useful for initialization tasks.

```javascript
// Create a file like 'src/instrumentation.js' or 'app/instrumentation.js'
// export async function register() {
//   if (process.env.NEXT_RUNTIME === 'nodejs') {
//     await import('../lib/my-initializer');
//   }
// }
```

--------------------------------

### Bootstrap Next.js App with Sanity GraphQL Example

Source: https://github.com/sanity-io/demo-graphql-presentation-nextjs

This command uses `create-next-app` to bootstrap a new Next.js project from a specific GitHub repository example. It clones the repository and sets up the project structure, allowing you to quickly start developing with Sanity.io and GraphQL.

```shell
npx create-next-app --example https://github.com/sanity-io/demo-graphql-presentation-nextjs sanity-graphql-presentation
```

--------------------------------

### instrumentationHook

Source: https://nextjs.org/docs/app/getting-started

Use the instrumentationHook option to set up instrumentation in your Next.js App for monitoring and tracing.

```APIDOC
instrumentationHook:
  description: Use the instrumentationHook option to set up instrumentation in your Next.js App.
  details: Enables integration with observability tools by providing a hook for custom instrumentation logic.
```

--------------------------------

### File Conventions: template.js

Source: https://nextjs.org/docs/app/getting-started

API Reference for the `template.js` file. Similar to layouts but preserves state and effects across navigations.

```javascript
// app/dashboard/@team/template.js
'use client';

import { useState } from 'react';

export default function TeamTemplate({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      {children}
      <p>Team count: {count}</p>
    </div>
  );
}
```

--------------------------------

### Sanity Studio Configuration Example

Source: https://www.sanity.io/guides/sanity-astro-blog

This snippet demonstrates a typical configuration for Sanity Studio, including versioning and project setup. It's a foundational piece for managing content and previews.

```json
{
  "studioVersion": 3,
  "title": "Build your blog with Astro and Sanity",
  "description": "Setup \"Live by Default\" fetches and interactive live preview with Presentation in Sanity Studio",
  "authors": [
    {
      "name": "Simeon Griggs"
    },
    {
      "name": "Knut Melvær"
    }
  ],
  "publishedAt": "2023-02-09T14:03:16.850Z",
  "slug": {
    "current": "sanity-astro-blog"
  },
  "solutions": [
    {
      "title": "Publishing"
    },
    {
      "title": "Marketing site"
    }
  ]
}
```

--------------------------------

### onDemandEntries

Source: https://nextjs.org/docs/app/getting-started

Configure how Next.js will dispose and keep in memory pages created in development, optimizing build times.

```APIDOC
onDemandEntries:
  description: Configure how Next.js will dispose and keep in memory pages created in development.
  details: Controls the behavior of on-demand compilation and caching of pages during development, affecting performance and memory usage.
```