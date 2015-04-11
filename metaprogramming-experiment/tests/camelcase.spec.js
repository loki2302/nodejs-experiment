var expect = require('chai').expect;
var pluralize = require('pluralize');
var camelcase = require('camelcase');

describe('generate function name', function() {
  it('should work', function() {
    var parentEntity = 'user';
    var childEntity = 'post';

    var getUserPostsString = camelcase('get_' + parentEntity + '_' + pluralize(childEntity));
    expect(getUserPostsString).to.equal('getUserPosts');
  });
});
