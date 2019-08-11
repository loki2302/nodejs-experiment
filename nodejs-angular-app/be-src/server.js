var co = require('co');
var appRunnerFactory = require('./appRunnerFactory');

co(function* () {
  var appRunner = yield appRunnerFactory();
  console.log('Constructed appRunner successfully');

  yield appRunner.start();
  console.log('Started appRunner successfully');

  yield appRunner.reset();
  console.log('Removed all the existing data');

  yield appRunner.generateFakeData();
  console.log('Generated fake data')
}).then(function() {
  console.log('OK');
}, function(error) {
  console.error('Error', error);
});
