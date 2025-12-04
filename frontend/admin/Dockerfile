FROM node:22-bullseye AS builder

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=${PNPM_HOME}:$PATH
WORKDIR /workspace

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm nx build admin

FROM nginx:1.27-alpine AS runner

COPY frontend/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/dist/frontend/admin /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
