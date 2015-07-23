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

  describe('when I have tags', function() {
    var index;
    beforeEach(function() {
      index = lunr(function() {
        this.ref('id');
        this.field('tags');
      });

      index.add({ id: '1', tags: ['milk', 'drink', 'white'] });
      index.add({ id: '2', tags: ['beer', 'drink'] });
    });

    it('should let me find milk', function() {
      var results = index.search('milk');
      expect(results.length).to.equal(1);
      expect(results[0].ref).to.equal('1');
    });

    it('should let me find beer', function() {
      var results = index.search('beer');
      expect(results.length).to.equal(1);
      expect(results[0].ref).to.equal('2');
    });

    it('should let me find drinks', function() {
      var results = index.search('drinks');
      expect(results.length).to.equal(2);
    });

    it('should not let me find vodka', function() {
      var results = index.search('vodka');
      expect(results.length).to.equal(0);
    });
  });
});
