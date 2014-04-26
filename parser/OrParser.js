var ParseResult = require('./ParseResult');
var ParserContext = require('./ParserContext');

function OrParser(innerParsers) {
	this.innerParsers = innerParsers;
};

OrParser.prototype.parse = function(context) {
	for(var i = 0; i < this.innerParsers.length; ++i) {
		var parser = this.innerParsers[i];
		var result = parser.parse(context);
		if(result.ok) {
			return result;
		}
	}

	return ParseResult.error();
};

module.exports = OrParser;