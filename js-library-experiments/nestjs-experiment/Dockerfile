FROM node:10.17.0-alpine
COPY ./ /app
WORKDIR /app
RUN yarn install --dev
RUN yarn prebuild && yarn build
CMD yarn start:prod
