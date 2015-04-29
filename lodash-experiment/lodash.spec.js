var expect = require('chai').expect;
var _ = require('lodash');

describe('lodash', function() {
  it('should map', function() {
    expect(_.map([1, 2], function(x) {
      return x * 2;
    })).to.deep.equal([2, 4]);
  });

  it('should indexBy', function() {
    expect(_.indexBy([
      { id: 'one', name: 'item one' },
      { id: 'two', name: 'item two' }
    ], 'id')).to.deep.equal({
      'one': { id: 'one', name: 'item one' },
      'two': { id: 'two', name: 'item two' }
    });
  });
});
