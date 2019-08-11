var calculatorService = {
  add: function(a, b) {
    return a + b;
  }
};

exports.oneAndTwoShouldBeThree = function(test) {
  var result = calculatorService.add(1, 2);
  test.equal(result, 3, "1 + 2 should be 3");
  test.done();
};

exports.oneAndTwoShouldNotBeFive = function(test) {
  var result = calculatorService.add(1, 2);
  test.notEqual(result, 5, "1 + 2 should not be 5");
  test.done();
};

exports.thisTestShouldFailBecauseExceptionIsThrown = function(test) {
  throw "omgwtfbbq";
  test.done();
};