FROM oven/bun:1.4-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/contract/package.json packages/contract/
COPY packages/db/package.json packages/db/
COPY packages/jow/package.json packages/jow/

RUN bun install --frozen-lockfile --ignore-scripts


FROM deps AS web

COPY apps/web apps/web
COPY packages packages

RUN cd apps/web && bunx --bun vite build


FROM deps AS api

COPY apps/api apps/api
COPY packages packages

RUN bun build apps/api/src/index.ts --target=bun --outfile=/out/api.js --external libsql


FROM oven/bun:1.4-alpine AS native

WORKDIR /native

RUN bun add libsql@0.5.29 && rm -rf node_modules/@libsql/*-gnu*


FROM oven/bun:1.4-alpine

ARG TARGETARCH
ARG S6_OVERLAY_VERSION=3.2.1.0

RUN apk add --no-cache nginx shadow tzdata xz \
  && (userdel bun; groupdel bun; true) \
  && addgroup -g 1000 abc \
  && adduser -D -H -u 1000 -G abc abc

RUN case "${TARGETARCH}" in \
      amd64) S6_ARCH=x86_64 ;; \
      arm64) S6_ARCH=aarch64 ;; \
      *) echo "unsupported arch: ${TARGETARCH}" && exit 1 ;; \
    esac \
  && wget -qO- "https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz" | tar -C / -Jxp \
  && wget -qO- "https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-${S6_ARCH}.tar.xz" | tar -C / -Jxp

WORKDIR /app

COPY --from=native /native/node_modules node_modules
COPY --from=api /out/api.js api.js
COPY packages/db/migrations migrations
COPY --from=web /app/apps/web/dist /app/web
COPY docker/root/ /

ENV PUID=1000 \
    PGID=1000 \
    TZ=Etc/UTC \
    DB_FILE_PATH=file:/config/app.db \
    IMAGES_DIRECTORY=/config/images \
    MIGRATIONS_DIRECTORY=/app/migrations \
    S6_CMD_WAIT_FOR_SERVICES_MAXTIME=0

EXPOSE 80
VOLUME /config
ENTRYPOINT ["/init"]
