var appRunnerFactory = require('./appRunnerFactory');

appRunnerFactory().then(function(appRunner) {
  console.log('Constructed appRunner successfully');
  appRunner.start().then(function() {
    console.log('Started appRunner successfully');
  }, function(err) {
    console.log('Failed to start appRunner', err);
  });
}, function(err) {
  console.log('Failed to construct appRunner', err);
});
