FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --no-frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter @nexatrack/api prisma:generate
RUN pnpm --filter @nexatrack/api build

FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build /app/turbo.json ./turbo.json
EXPOSE 4000
CMD ["sh", "-c", "pnpm --filter @nexatrack/api prisma:deploy && node apps/api/dist/main.js"]
