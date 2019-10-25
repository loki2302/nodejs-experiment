# nestjs-experiment

* `yarn start` - start (and don't watch)
* `yarn start:dev` - start and watch
* `yarn prebuild && yarn build && yarn start:prod` - compile TS to JS and then launch JS
* `yarn test` - run unit tests (`src/*.spec.ts`)
* `yarn test:cov` - run unit tests with coverage report
* `yarn test:e2e` - run e2e tests (`test/*.e2e-spec.ts`)
* `docker-compose up`

What it has:

1. http://localhost:3000/swagger
2. http://localhost:3000/throw
3. http://localhost:3000/any/crazy/123/url?xxx=111
