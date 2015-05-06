var expect = require('chai').expect;
var _ = require('lodash');

describe('lodash', function() {
  it('should map', function() {
    expect(_.map([1, 2], function(x) {
      return x * 2;
    })).to.deep.equal([2, 4]);
  });

  it('should reduce', function() {
    expect(_.reduce([1, 2], function(s, x) {
      s += x;
      return s;
    }, 0)).to.equal(3);
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

  it('should groupBy', function() {
    expect(_.groupBy([
      { name: 'john', says: 'hi' },
      { name: 'jane', says: 'omg' },
      { name: 'jane', says: 'wtf' },
      { name: 'john', says: 'bbq' }
    ], 'name')).to.deep.equal({
      'john': [
        { name: 'john', says: 'hi' },
        { name: 'john', says: 'bbq' }
      ],
      'jane': [
        { name: 'jane', says: 'omg' },
        { name: 'jane', says: 'wtf' }
      ]
    });
  });

  it('should remove', function() {
    var a = [1, 2, 3, 4];
    expect(_.remove(a, function(x) {
      return x % 2 === 0;
    })).to.deep.equal([2, 4]);
    expect(a).to.deep.equal([1, 3]);
  });

  it('should where', function() {
    expect(_.where([
      { language: 'JavaScript', score: 1 },
      { language: 'C#', score: 10 },
      { language: 'Java', score: 8 },
      { language: 'Groovy', score: 8 }
    ], { score: 8 })).to.deep.equal([
      { language: 'Java', score: 8 },
      { language: 'Groovy', score: 8 }
    ]);
  });

  it('should assign', function() {
    var person = {};
    _.assign(person, { name: 'loki2302' });
    _.assign(person, { id: 123, age: 40 });
    _.assign(person, { url: 'http://loki2302.me' }, { twitter: '@loki2302' });
    expect(person).to.deep.equal({
      name: 'loki2302',
      id: 123,
      age: 40,
      url: 'http://loki2302.me',
      twitter: '@loki2302'
    });
  });

  it('should pairs', function() {
    var person = {
      name: 'loki2302',
      age: 40
    };
    var pairs = _.pairs(person);
    expect(pairs).to.deep.equal([
      ['name', 'loki2302'],
      ['age', 40]
    ]);
  });

  it('should defaults', function() {
    var defaults = {
      x: 123,
      y: 'hello'
    };
    var o = { x: 222 };
    o = _.defaults(o, defaults);
    expect(o).to.deep.equal({
      x: 222,
      y: 'hello'
    });
  });
});
