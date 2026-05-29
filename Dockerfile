# syntax=docker/dockerfile:1.7
#
# ============================================================================
#  CueSports Africa frontend — production Dockerfile for Railway
#
#  Strategy: multi-stage build → Next.js standalone runtime
#    - small final image (~150 MB), runs as non-root, tini for PID-1
#    - BuildKit cache mount on npm — repeat deploys hit warm cache
#    - NEXT_PUBLIC_* flow in as build ARGs (Railway auto-passes service
#      env vars to ARGs of the same name)
# ============================================================================


# ----------------------------------------------------------------------------
#  Stage 1 — install dependencies (including dev deps; needed for `next build`)
# ----------------------------------------------------------------------------
FROM node:24-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev --no-audit --no-fund


# ----------------------------------------------------------------------------
#  Stage 2 — build the Next.js app
# ----------------------------------------------------------------------------
FROM node:24-slim AS builder
WORKDIR /app

# Build-time public env. These are inlined into the client bundle — set them
# in Railway as service variables and they'll be auto-forwarded to these ARGs.
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_PUSHER_APP_KEY
ARG NEXT_PUBLIC_PUSHER_APP_CLUSTER

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
    NEXT_PUBLIC_PUSHER_APP_KEY=$NEXT_PUBLIC_PUSHER_APP_KEY \
    NEXT_PUBLIC_PUSHER_APP_CLUSTER=$NEXT_PUBLIC_PUSHER_APP_CLUSTER \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# ----------------------------------------------------------------------------
#  Stage 3 — minimal runtime image
# ----------------------------------------------------------------------------
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# tini: clean PID-1 signal handling. Critical for graceful SIGTERM on Railway
# redeploys — without it, Node receives signals as a non-init process and
# Railway will SIGKILL after the 30s grace timeout, dropping in-flight requests.
RUN apt-get update && \
    apt-get install -y --no-install-recommends tini ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Non-root runtime user.
RUN groupadd --system --gid 1001 nodejs && \
    useradd  --system --uid 1001 --gid nodejs nextjs

# Next.js standalone output: minimal server.js + only the deps it actually uses.
# .next/static and public/ are static assets the server reads from disk.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

USER nextjs
EXPOSE 3000

# Container-level liveness — homepage is prerendered, fast, no DB dependency.
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "server.js"]
