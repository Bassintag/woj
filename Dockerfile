FROM node:22 AS base


FROM base AS builder

WORKDIR /usr/src/app

COPY ./package.json /yarn.lock ./
COPY ./packages/api/package.json ./packages/api/
COPY ./packages/app/package.json ./packages/app/
COPY ./packages/scripts/package.json ./packages/scripts/

RUN \
    yarn --frozen-lockfile && \
    rm -rf ./packages/

COPY ./prisma ./prisma

RUN yarn prisma generate

COPY ./packages/api ./packages/api
COPY ./packages/app ./packages/app
COPY ./packages/scripts ./packages/scripts

ENV PUBLIC_API_PATH_PREFIX=api/
ENV PUBLIC_IMAGES_PATH_PREFIX=images/

RUN \
    yarn workspace @woj/api build && \
    yarn workspace @woj/app build && \
    yarn workspace @woj/scripts build


FROM base AS runner

WORKDIR /usr/src/app

RUN \
    apt-get update && \
    apt-get install -y nginx && \
    npm i -g prisma@5.18.0

COPY ./package.json ./yarn.lock ./prisma ./
COPY ./packages/api/package.json ./packages/api/
COPY ./packages/scripts/package.json ./packages/scripts/

RUN \
    yarn --prod --frozen-lockfile && \
    rm -rf packages yarn.lock

COPY ./.docker/start.sh ./start.sh
COPY ./.docker/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist
COPY --from=builder /usr/src/app/packages/scripts/dist ./packages/scripts/dist
COPY --from=builder /usr/src/app/packages/app/dist /var/www/html

ENV DATABASE_URL=file:/data/app.db
ENV IMAGES_DIRECTORY=/data/images

ENTRYPOINT ["sh", "/usr/src/app/start.sh"]
