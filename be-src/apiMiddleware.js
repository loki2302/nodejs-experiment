var koaBodyParser = require('koa-body-parser');
var koaCompose = require('koa-compose');
var koaSleep = require('koa-sleep');
var apiRoutes = require('./apiRoutes');

module.exports = function(models) {
  var chain = [];
  chain.push(koaBodyParser());
  chain.push(apiRoutes(models));

  return koaCompose(chain);
};
