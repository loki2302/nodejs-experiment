var ParseResult = require('./ParseResult');

function CharParser(c) {
	this.c = c;
};

CharParser.prototype.parse = function(context) {
	if(context.s[context.from] === this.c) {
		return ParseResult.ok(context.from, context.from + 1);
	}

	return ParseResult.error();
};

module.exports = CharParser;
