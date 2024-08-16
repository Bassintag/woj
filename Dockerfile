FROM node:22-alpine AS base


FROM base AS builder

WORKDIR /usr/src/app

COPY ./package.json /yarn.lock ./
COPY ./packages/api/package.json ./packages/api/
COPY ./packages/app/package.json ./packages/app/

RUN \
    yarn --frozen-lockfile && \
    rm -rf ./packages/

COPY ./prisma ./prisma

RUN yarn generate

COPY ./packages/api ./packages/api
COPY ./packages/app ./packages/app

ENV PUBLIC_API_PATH_PREFIX "api/"
ENV PUBLIC_IMAGES_PATH_PREFIX "images/"

RUN \
    yarn workspace api build && \
    yarn workspace app build


FROM base AS runner

WORKDIR /usr/src/app

RUN \
    apk add --update nginx && \
    npm i -g prisma@5.18.0

COPY ./package.json ./yarn.lock ./prisma ./
COPY ./packages/api/package.json ./packages/api/

RUN \
    yarn --prod --frozen-lockfile && \
    rm -rf packages package.json yarn.lock

COPY ./.docker/start.sh ./start.sh
COPY ./.docker/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/packages/api/dist ./api
COPY --from=builder /usr/src/app/packages/app/dist /var/www/html/app

ENV IMAGES_DIRECTORY=/var/www/html/images

ENTRYPOINT ["sh", "/usr/src/app/start.sh"]
