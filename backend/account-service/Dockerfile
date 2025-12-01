FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json nx.json tsconfig.base.json ./

RUN npm install

COPY . .

RUN npx nx build account-service

# Stage de produção
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000

COPY --from=builder /app/dist/backend/account-service ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]