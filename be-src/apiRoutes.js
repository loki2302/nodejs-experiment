var Sequelize = require('sequelize');
var Router = require('koa-router');

module.exports = function MakeApiMiddleware(models) {
  var sequelize = models.sequelize;
  var Team = sequelize.models.Team;
  var Person = sequelize.models.Person;
  var Membership = sequelize.models.Membership;

  var apiRouter = new Router();

  apiRouter.get('/hello', function* () {
    this.status = 200;
    this.body = {
      message: 'hello there'
    };
  });

  return apiRouter.middleware();
};
