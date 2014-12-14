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

	it('should let me use a calculator parser', function() {
		var parser = PEG.buildParser("\
			start = left:num '+' right:num { return left + right; } \
			num = v:[0-9]+ { return parseInt(v.join(''), 10); } \
			");

		var result = parser.parse('2+3');
		assert.equal(result, 5);
	});

	it('should let me build a DSL', function() {
		var parser = PEG.buildParser("\
			start = (s:statement ';' { return s; })+ \
			statement = 'when ' condition:text ' then ' action:text { \
				return {condition: condition, action: action} \
			} \
			text = c:[a-z]+ { return c.join(''); } \
			");

		var result = parser.parse('when hungry then eat;when sad then drink;');

		var rules = {};
		result.forEach(function(rule) {
			rules[rule.condition] = rule.action;
		});

		assert.equal(Object.keys(rules).length, 2);
		assert.equal(rules['hungry'], 'eat');
		assert.equal(rules['sad'], 'drink');
	});
});
