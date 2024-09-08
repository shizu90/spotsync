FROM node:alpine

RUN apk upgrade --no-cache && \
    apk add curl && \
    apk add nano && \
    apk add openssl && \
    apk add git

WORKDIR /app

COPY --chown=node:node package.json yarn.lock /app/

RUN yarn cache clean && \ 
    yarn install --frozen-lockfile

COPY . /app

RUN chown -R node:node /app

USER node

CMD ["tail", "-f", "/dev/null"]