var ParseResult = require('./ParseResult');
var ParserContext = require('./ParserContext');

var OneOrMoreParser = function(innerParser) {
	this.innerParser = innerParser;
};

OneOrMoreParser.prototype.parse = function(context) {
	var pos = context.from;
	var count = 0;
	while(true) {
		var innerContext = new ParserContext(context.s, pos);
		var result = this.innerParser.parse(innerContext);
		if(!result.ok) {
			break;
		}

		pos = result.to;
		++count;
	}

	if(count < 1) {
		return ParseResult.error();
	}

	return ParseResult.ok(context.from, pos);
};

module.exports = OneOrMoreParser;