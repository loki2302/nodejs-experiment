var koaBodyParser = require('koa-body-parser');
var koaCompose = require('koa-compose');
var koaSleep = require('koa-sleep');
var apiRoutes = require('./apiRoutes');

module.exports = function() {
  var chain = [];
  chain.push(koaBodyParser());
  chain.push(apiRoutes());

  return koaCompose(chain);
};
