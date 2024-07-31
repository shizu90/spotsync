FROM node:alpine

RUN apk upgrade --no-cache && \
    apk add curl && \
    apk add nano

WORKDIR /app

RUN addgroup -S dev
RUN adduser -S dev -s /bin/bash -h /app -D -G dev
RUN chmod 755 -R /app
RUN chown -R dev:dev /app

USER dev

CMD yarn && yarn start:dev

EXPOSE 3000