# nestjs-experiment

* `yarn start` - start (and don't watch)
* `yarn start:dev` - start and watch. The default configuration is sqlite + text logging.
* `yarn prebuild && yarn build && yarn start:prod` - compile TS to JS and then launch JS
* `yarn test` - run unit tests (`src/*.spec.ts`)
* `yarn test:cov` - run unit tests with coverage report
* `yarn test:e2e` - run e2e tests (`test/*.e2e-spec.ts`)
* `docker-compose up` for mysql + JSON logging demo. 

What it has:

1. OAuth2 applied to `/todos`. Supports `refresh_token` and `password` grants. Has just one client `client1` / `client1Secret` and just one user `user1` / `password1`.
2. http://localhost:3000/swagger (make sure to authenticate before using the API)
3. http://localhost:3000/any/crazy/123/url?xxx=111 - "HTML5 URLs support"
4. A choice of sqlite or mysql - configurable via environment variables.
5. A choice of text or JSON logging - configurable via environment variables. Logs also include request context.
