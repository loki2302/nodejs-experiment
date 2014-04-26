function ParseResult() {
};

ParseResult.ok = function(from, to) {
	var result = new ParseResult();
	result.ok = true;
	result.from = from;
	result.to = to;
	return result;
};

ParseResult.error = function() {
	var result = new ParseResult();
	result.ok = false;
	return result;
};

module.exports = ParseResult;