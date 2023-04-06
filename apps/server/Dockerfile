FROM node:18.12.1-slim AS base

# Required to run Prisma on ARM64 machines
# https://github.com/prisma/prisma/issues/861#issuecomment-881992292
RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY ./dist/apps/server/package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY ./dist/apps/server .


ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]
