var co = require('co');

module.exports = function convertES6GeneratorFuncToFuncWithCallback(testGeneratorFunc) {
  return function(done) {
    co(testGeneratorFunc).then(function() {
      done();
    }, done);
  };
};
