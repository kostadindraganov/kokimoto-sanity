# Deploying to Coolify

This guide covers deploying the Kokimoto Next.js + Sanity Studio application to [Coolify](https://coolify.io) using the included Dockerfile.

## Prerequisites

- A Coolify instance (self-hosted or cloud)
- The GitHub repository connected to Coolify
- Your Sanity project credentials

## Setup in Coolify

### 1. Create a New Resource

1. Go to your Coolify dashboard
2. Click **+ New Resource** → **Application**
3. Select **GitHub** as the source
4. Choose the repository and branch (e.g., `main`)
5. Select **Dockerfile** as the build pack
6. Coolify will auto-detect the `Dockerfile` at the repo root

### 2. Configure Build Variables

These `NEXT_PUBLIC_*` variables are **baked into the JavaScript bundle at build time**. They must be set as **Build Variables** in Coolify (not runtime-only).

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Sanity dataset (e.g., `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | ❌ | API version (defaults to latest) |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | ❌ | Full Studio URL (e.g., `https://yourdomain.com/studio`) |

### 3. Configure Environment Variables (Runtime)

These are server-only secrets injected at container startup. Set them as **Environment Variables** in Coolify.

| Variable | Required | Description |
|---|---|---|
| `SANITY_API_READ_TOKEN` | ✅ | Sanity read token for data fetching |
| `SANITY_API_WRITE_TOKEN` | ✅ | Sanity write/editor token for contact form |
| `RESEND_API_KEY` | ✅ | Resend email service API key |
| `CONTACT_EMAIL_TO` | ✅ | Email address for contact form submissions |

### 4. Port & Health Check

- **Port**: `3000` (auto-detected from `EXPOSE` in Dockerfile)
- **Health Check Path**: `/` (or any page that returns 200)

### 5. Deploy

Click **Deploy** — Coolify will:
1. Clone the repo
2. Build the Docker image using the multi-stage Dockerfile
3. Start the container with your environment variables
4. Route traffic to port 3000

## Architecture

The application runs as a **single container**:

- **Next.js frontend** serves all pages on port 3000
- **Sanity Studio** is embedded at `/studio` (via `next-sanity`)
- The `output: 'standalone'` config produces a minimal ~150MB image

```
Container (port 3000)
├── / ................... Next.js frontend
├── /studio ............. Sanity Studio (default workspace)
├── /inbox .............. Sanity Studio (inbox workspace)
└── /api/* .............. API routes (draft mode, etc.)
```

## Troubleshooting

### Studio not loading at `/studio`

The Studio is embedded via `next-sanity` and built into the Next.js app. Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` is set as a **Build Variable** (not just runtime).

### Images not loading

Sanity CDN images (`cdn.sanity.io`) are already configured in `next.config.ts` under `images.remotePatterns`. No additional config needed.

### Build fails with memory errors

Add a build argument to increase Node.js memory:
```
NODE_OPTIONS=--max-old-space-size=4096
```
Set this as a Build Variable in Coolify.

### Environment variables not working

- `NEXT_PUBLIC_*` → Must be **Build Variables** (baked at build time)
- All other vars → Set as **Environment Variables** (injected at runtime)

If you change a `NEXT_PUBLIC_*` value, you must **rebuild** the image.
