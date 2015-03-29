var Router = require('koa-router');

module.exports = function() {
  var apiRouter = new Router();

  apiRouter.get('/hello', function* () {
    this.status = 200;
    this.body = {
      message: 'hello there'
    };
  });

  return apiRouter.middleware();
};
