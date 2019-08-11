FROM node:10.16.2-alpine
EXPOSE 3000
COPY . /app
WORKDIR /app
RUN yarn install --dev
RUN yarn fe:build
CMD ["yarn", "be:start"]
