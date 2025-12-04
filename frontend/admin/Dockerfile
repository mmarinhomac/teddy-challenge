FROM node:22-bullseye AS builder
WORKDIR /app

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=${PNPM_HOME}:$PATH

RUN corepack enable

COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json ./

RUN pnpm install

COPY frontend frontend

RUN pnpm nx build admin --prod

FROM nginx:1.27-alpine AS runner

COPY frontend/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/frontend/admin /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
