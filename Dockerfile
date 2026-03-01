# CueSports Africa - Next.js Frontend Dockerfile

# ============================================
# Base Stage
# ============================================
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

# ============================================
# Dependencies Stage
# ============================================
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci

# ============================================
# Development Stage
# ============================================
FROM base AS development

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
# Disable Turbopack (causes issues with Docker volumes on Windows)
ENV NEXT_TURBOPACK=0
# Use polling for file watching in Docker on Windows
ENV WATCHPACK_POLLING=true

EXPOSE 3000

# Use standard Next.js dev server
CMD ["npm", "run", "dev"]

# ============================================
# Builder Stage
# ============================================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PUSHER_APP_KEY
ARG NEXT_PUBLIC_PUSHER_CLUSTER

RUN npm run build

# ============================================
# Production Stage
# ============================================
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
