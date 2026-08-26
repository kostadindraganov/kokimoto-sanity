# =============================================================================
# Kokimoto — Multi-stage Dockerfile for Coolify
# Builds the Next.js frontend (with embedded Sanity Studio) as a standalone app
# =============================================================================

# ---------------------------------------------------------------------------
# Base image — Node.js 22 LTS (slim variant for smaller size)
# ---------------------------------------------------------------------------
ARG NODE_VERSION=22-slim
FROM node:${NODE_VERSION} AS base
WORKDIR /app

# ---------------------------------------------------------------------------
# Stage 1: Install dependencies
# ---------------------------------------------------------------------------
FROM base AS deps

# Copy workspace root files needed for install
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY studio/package.json ./studio/

# Install all dependencies (including devDependencies for build)
RUN npm ci --no-audit --no-fund

# ---------------------------------------------------------------------------
# Stage 2: Build the application
# ---------------------------------------------------------------------------
FROM base AS builder

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/studio/node_modules ./studio/node_modules

# Copy full source code
COPY . .

# NEXT_PUBLIC_* vars must be available at build time.
# In Coolify, set these as "Build Variables".
# They are baked into the JS bundle during `next build`.
#
# Server-only vars (SANITY_API_READ_TOKEN, etc.) are injected at runtime
# via Coolify's "Environment Variables" — no need to set them here.

# Build the Next.js frontend (includes embedded Sanity Studio)
RUN npm run build --workspace=frontend

# ---------------------------------------------------------------------------
# Stage 3: Production runner (minimal image)
# ---------------------------------------------------------------------------
FROM base AS runner

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder
# The standalone folder contains server.js + traced node_modules
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static

USER nextjs

# Next.js collects anonymous telemetry — disable in production container
ENV NEXT_TELEMETRY_DISABLED=1

# Port configuration — Coolify maps this automatically
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

# Graceful shutdown support
STOPSIGNAL SIGTERM

# Start the standalone Next.js server
CMD ["node", "frontend/server.js"]
