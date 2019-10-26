FROM node:10.17.0-alpine
COPY ./ /app
WORKDIR /app
RUN yarn install && \
  yarn build && \
  yarn install --production && \
  yarn cache clean
CMD yarn start:prod
