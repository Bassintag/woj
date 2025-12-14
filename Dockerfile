FROM node:20 AS base

ENV NODE_ENV=production

FROM base AS builder

WORKDIR /usr/src/app

COPY ./package.json /yarn.lock ./
COPY ./packages/api/package.json ./packages/api/
COPY ./packages/app/package.json ./packages/app/
COPY ./packages/common/package.json ./packages/common/

RUN \
    yarn --frozen-lockfile && \
    rm -rf ./packages/

COPY ./prisma.config.ts ./
COPY ./prisma ./prisma

RUN yarn prisma generate

COPY ./packages/api ./packages/api
COPY ./packages/app ./packages/app
COPY ./packages/common ./packages/common

ENV PUBLIC_API_PATH_PREFIX=api/
ENV PUBLIC_IMAGES_PATH_PREFIX=images/

RUN \
    yarn workspace @woj/api build && \
    yarn workspace @woj/app build


FROM base AS runner

WORKDIR /usr/src/app

RUN \
    apt-get update && \
    apt-get install -y nginx && \
    npm i -g prisma@5.18.0

COPY ./package.json ./yarn.lock ./
COPY ./packages/api/package.json ./packages/api/

RUN \
    yarn --prod --frozen-lockfile && \
    rm -rf packages yarn.lock

COPY ./.docker/start.sh ./start.sh
COPY ./.docker/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist
COPY --from=builder /usr/src/app/packages/app/dist /var/www/html

ENV DATABASE_URL=file:/data/app.db
ENV IMAGES_DIRECTORY=/data/images

ENTRYPOINT ["sh", "/usr/src/app/start.sh"]
