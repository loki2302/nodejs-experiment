var assert = require('assert');
var PEG = require('pegjs');

describe('pegjs', function() {
	it('should let me use a dummy parser', function() {
		var parser = PEG.buildParser("\
			start = ('a' / 'b')+ \
			");

		var result = parser.parse('abab');
		assert.equal(JSON.stringify(result), JSON.stringify(['a', 'b', 'a', 'b']));
	});
});
