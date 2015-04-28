var expect = require('chai').expect;
var _ = require('lodash');

describe('lodash', function() {
  it('should work', function() {
    expect(_.map([1, 2], function(x) {
      return x * 2;
    })).to.deep.equal([2, 4]);
  });
});
