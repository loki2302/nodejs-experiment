var expect = require('chai').expect;
var ss = require('simple-statistics');

describe('simple-statistics', function() {
  it('should calculate mean', function() {
    expect(ss.mean([1, 2, 1])).to.be.closeTo(1.333, 0.001);
  });

  it('should calculate median', function() {
    expect(ss.median([1, 2, 3, 4, 5])).to.equal(3);
  });

  it('should calculate linear regression', function() {
    var originalM = 2;
    var originalB = -3;
    var originalF = function(x) {
      return originalM * x + originalB;
    };

    var linearRegression = ss.linear_regression().data([
      [0, originalF(0)],
      [1.5, originalF(1.5)],
      [2.3, originalF(2.3)]
    ]);

    expect(linearRegression.m()).to.equal(originalM);
    expect(linearRegression.b()).to.equal(originalB);

    var f = linearRegression.line();
    expect(f(0.5)).to.equal(originalF(0.5));
  });
});
