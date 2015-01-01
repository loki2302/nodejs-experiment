var koaBodyParser = require('koa-body-parser');
var koaCompose = require('koa-compose');
var koaSleep = require('koa-sleep');
var transactional = require('./transactional');
var responseMethods = require('./responseMethods');
var apiRoutes = require('./apiRoutes');

module.exports = function(config, sequelize, Note, Category) {
	var chain = [];
	chain.push(koaBodyParser());
	chain.push(responseMethods());
	chain.push(transactional(sequelize));

	if(config && config.delay) {
		chain.push(koaSleep(config.delay));
	}

	chain.push(apiRoutes(Note, Category));

	return koaCompose(chain);
};
