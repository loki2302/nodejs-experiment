var makeApp = require('./app');
var makeModels = require('./models');

var models = makeModels();
models.initialize(function(error) {
  if(error) {
    throw new Error('Failed to initialize models');
  }

  var app = makeApp(models, {
    delay: 1000
  });

  var server = app.listen((process.env.PORT || 3000), function() {
    console.log('Listening at %j', server.address());
  });
});
