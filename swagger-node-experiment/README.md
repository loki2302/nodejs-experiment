# swagger-node-experiment

Have `swagger-node` installed globally: `npm install -g swagger-node`

* Edit the API definition: `swagger project edit`
* `npm start` to run
* `npm test` to run tests

#### What this is

`swagger-node` is "toolkit" that allows you to describe the API in Swagger format and attributes like `x-swagger-router-controller` and `operationId` to describe how resources/operations map to the code. Then, when you run the app, they apply their middleware to route requests to the handlers based on what you have in your API description.
