FROM node:latest

WORKDIR /app

CMD yarn && yarn start:dev

EXPOSE 3000