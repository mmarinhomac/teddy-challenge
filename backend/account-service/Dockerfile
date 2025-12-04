FROM node:22-alpine AS builder
WORKDIR /app

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=${PNPM_HOME}:$PATH

RUN corepack enable

COPY package.json nx.json tsconfig.base.json ./

RUN pnpm install

COPY backend backend

RUN pnpm nx build account-service --prod

FROM node:22-alpine AS runner

COPY --from=builder /app/dist/backend/account-service ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
