var makeAppRunner = require('./appRunnerFactory.js');

makeAppRunner({port:2000}).then(function(appRunner) {
  return appRunner.start().then(function() {
    console.log('Successfully started app runner');
  }, function(error) {
    console.log('Failed to start app runner', error);
  });
}, function(error) {
  console.log('Failed to construct app runner', error);
});
