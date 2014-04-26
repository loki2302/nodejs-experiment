var ParseResult = require('./ParseResult');
var ParserContext = require('./ParserContext');

function SequenceParser(parsers) {
	this.parsers = parsers;
};

SequenceParser.prototype.parse = function(context) {
	var pos = context.from;
	for(var i = 0; i < this.parsers.length; ++i) {
		var parser = this.parsers[i];

		var innerContext = new ParserContext(context.s, pos);
		var result = parser.parse(innerContext);
		if(!result.ok) {
			return ParseResult.error();
		}

		pos = result.to;
	}

	return ParseResult.ok(context.from, pos);
};

module.exports = SequenceParser;
