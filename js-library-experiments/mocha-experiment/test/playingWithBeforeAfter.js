var assert = require("assert");

var Calculator = function() {
	this.result = 0;
};

Calculator.prototype.add = function(n) {
	this.result = this.result + n;
};

var CalculatorFactory = function() {};
CalculatorFactory.prototype.make = function() {
	return new Calculator();
};

describe("calculator", function() {
	var calculatorFactory;
	before(function() {
		calculatorFactory = new CalculatorFactory();
	});

	var calculator;
	beforeEach(function() {
		calculator = calculatorFactory.make();
	});

	afterEach(function() {
		calculator = null;
	});

	after(function() {
		calculatorFactory = null;
	});

	it("should return 1 when I add 1", function() {
		calculator.add(1);
		assert.equal(1, calculator.result);
	});

	it("should return 1 when I add 1 twice", function() {
		calculator.add(1);
		calculator.add(1);
		assert.equal(2, calculator.result);
	});
});
