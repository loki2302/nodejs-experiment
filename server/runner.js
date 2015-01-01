var makeApp = require('./app');
var models = require('./models');

models.initialize(function(error) {
	if(error) {
		throw new Error('Failed to initialize models');
	}

	var app = makeApp(models, {
		delay: 1000
	});

	var server = app.listen(3000, function() {
		console.log('Listening at %j', server.address());
	});
});
