var expect = require('chai').expect;
var lunr = require('lunr');

describe('lunr', function() {
  it('should work', function() {
    var index = lunr(function() {
      this.field('title');
      this.field('body');
      this.ref('id');
    });

    index.add({
      id: '1',
      title: 'what about milk?',
      body: 'get some milk'
    });

    index.add({
      id: '2',
      title: 'I want beer',
      body: 'milk is not beer'
    });

    var results = index.search('milk');
    expect(results.length).to.equal(2);
    expect(results[0].ref).to.equal('1');
    expect(results[1].ref).to.equal('2');
  });
});
