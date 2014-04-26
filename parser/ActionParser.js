var ActionParser = function(innerParser, action) {
	this.innerParser = innerParser;
	this.action = action;
};

ActionParser.prototype.parse = function(context) {
	var parseResult = this.innerParser.parse(context);
	if(parseResult.ok) {
		var readString = context.s.substring(parseResult.from, parseResult.to);
		this.action(readString);
	}

	return parseResult;
};

module.exports = ActionParser;