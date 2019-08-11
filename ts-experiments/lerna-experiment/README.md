# lerna-experiment

An attempt to use [lerna](https://github.com/lerna/lerna) to organize a multi-package project.

* Have lerna installed globally: `npm install -g lerna`
* `npm run bootstrap` to build all packages and link them with each other.
* `npm test` to run all tests in all packages.
* `npm run clean` to delete all `node_modules` in all packages. Note that while all packages have their own `clean` commands, these are not executed.
* `npm run dummy` to run the `dummy` command for each package.
* `npm start` to run the app.
