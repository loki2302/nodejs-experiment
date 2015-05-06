# nodejs-angular-app

Available live at [https://powerful-beach-8366.herokuapp.com/](https://powerful-beach-8366.herokuapp.com/).

This application has only be tested against Node v0.11.14. It is likely to work with v0.12.x, but it's not guaranteed. This application has only been tested against Ubuntu 14.10.

This application uses generator functions heavily, so `--harmony` is always required. The local `./grunt` file found at the root is supposed to be used instead of the one installed globally: it launches the global `grunt` with `--harmony` flag.

## Installing the dependencies

Use `npm install` to install all the dependencies. Use `./grunt webdriver-update` to install the WebDriver locally (this is necessary for E2E tests).

## Running the application

Use `./grunt start` to launch the application. It should be available at [http://localhost:3000/](http://localhost:3000/).

## Running the tests

Use `./grunt be-test` to run backend-only integration tests. Use `./grunt fe-test` to run frontend-only unit tests (Chrome + Firefox). Use `./grunt e2e-test` to run E2E tests (Chrome + Firefox). Use `./grunt test` to run all tests.

## Deploying to Heroku

Use `./grunt heroku-deployment` to build and deploy the application to Heroku (this requires having a `heroku` remote configured with Heroku Toolbelt).

## Known issues

When editing existing person memberships or team members, the `role` is not validated, see [sequelize#3569](https://github.com/sequelize/sequelize/issues/3569).
