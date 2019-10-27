# nestjs-experiment

* `yarn start` - start (and don't watch)
* `yarn start:dev` - start and watch
* `yarn prebuild && yarn build && yarn start:prod` - compile TS to JS and then launch JS
* `yarn test` - run unit tests (`src/*.spec.ts`)
* `yarn test:cov` - run unit tests with coverage report
* `yarn test:e2e` - run e2e tests (`test/*.e2e-spec.ts`)
* `docker-compose up`

What it has:

1. OAuth2 applied to `/todos` with token endpoint at `/oauth/token`
2. http://localhost:3000/swagger (use `client1` / `client1Secret` / `user1` / `password` to authenticate)
3. http://localhost:3000/throw
4. http://localhost:3000/any/crazy/123/url?xxx=111
