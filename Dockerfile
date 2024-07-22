FROM node:latest

RUN apt-get update -yqq && \
    apt-get install -y curl && \
    apt-get install -y nano

WORKDIR /app

CMD yarn && yarn start:dev

EXPOSE 3000