var expect = require('chai').expect;
var validate = require('validate.js');

describe('validate.js', function() {
  it('should work', function() {
    var constraints = {
      username: {
        presence: {
          message: 'should not be empty'
        }
      }
    };

    var result = validate({}, constraints, {
      fullMessages: false // otherwise it will prepend field name to validation error message
    });
    expect(result.username[0]).to.equal('should not be empty');
  });
});
