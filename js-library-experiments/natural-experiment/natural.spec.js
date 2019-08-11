var expect = require('chai').expect;
var natural = require('natural');

describe('natural', function() {
  it('should let me classify documents', function() {

    var classifier = new natural.BayesClassifier();
    classifier.addDocument('I like cats', 'good');
    classifier.addDocument('Cats are cute and adorable!', 'good');
    classifier.addDocument('I really hate Microsoft', 'bad');
    classifier.addDocument('I don\'t like it', 'bad');
    classifier.train();

    expect(classifier.classify('Kittens are cute!!!')).to.equal('good');
  });
});
