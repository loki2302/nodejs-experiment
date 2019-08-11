var ParseResult = require('./ParseResult');

function RangeParser(low, high) {
	this.low = low;
	this.high = high;
};

RangeParser.prototype.parse = function(context) {
	var character = context.s[context.from];
	if(character >= this.low && character <= this.high) {
		return ParseResult.ok(context.from, context.from + 1);
	}

	return ParseResult.error();
};

module.exports = RangeParser;