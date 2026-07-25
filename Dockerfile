# syntax=docker/dockerfile:1
# Chic A Boo storefront — Next.js standalone container.

FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- dependencies ----
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci
# sharp for production image optimization on self-hosted Next
RUN npm install --no-save sharp

# ---- build ----
FROM base AS builder
# NEXT_PUBLIC_* values are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV DOCKER_BUILD=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:next \
    && cp -r public .next/standalone/ \
    && cp -r .next/static .next/standalone/.next/

# ---- runtime ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
