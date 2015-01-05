var koaBodyParser = require('koa-body-parser');
var koaCompose = require('koa-compose');
var koaSleep = require('koa-sleep');
var transactional = require('./transactional');
var responseMethods = require('./response-methods');
var apiRoutes = require('./api-routes');

module.exports = function(config, sequelize) {
	var chain = [];
	chain.push(koaBodyParser());
	chain.push(responseMethods());
	chain.push(transactional(sequelize));

	if(config && config.delay) {
		chain.push(koaSleep(config.delay));
	}

	chain.push(apiRoutes(sequelize.models));

	return koaCompose(chain);
};
