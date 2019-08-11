var expect = require('chai').expect;
var nlp = require('nlp_compromise');
var _ = require('lodash');

describe('nlp-compromise', function() {
  it('should let me detect tense', function() {
    expect(nlp.pos('I like cats').tense()[0][0]).to.equal('present');
  });

  it('should let me change tense', function() {
    expect(nlp.pos('I like cats').to_past().text()).to.equal('I liked cats');
  });

  it('should let me negate', function() {
    expect(nlp.pos('I like cats').negate().text()).to.equal("I don't like cats");
  });

  it('should let me extract entities', function() {
    expect(nlp.pos('I like cats').entities()).to.be.empty;
  });

  it('should let me extract N-grams', function() {
    var ngrams = _.flattenDeep(nlp.ngram('I like Pink Floyd. Pink Floyd is the best!', {
      min_count: 2
    }));

    expect(ngrams.length).to.equal(3);

    expect(_.find(ngrams, function(t) { return t.word === 'pink'; })).to.deep.equal({
      word: 'pink',
      count: 2,
      size: 1
    });

    expect(_.find(ngrams, function(t) { return t.word === 'floyd'; })).to.deep.equal({
      word: 'floyd',
      count: 2,
      size: 1
    });

    expect(_.find(ngrams, function(t) { return t.word === 'pink floyd'; })).to.deep.equal({
      word: 'pink floyd',
      count: 2,
      size: 2
    });
  });
});
