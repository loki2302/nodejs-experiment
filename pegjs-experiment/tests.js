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
			start = ss:(osp s:statement osp ';' { return s; })+ osp { return ss; } \
			statement = 'when' msp condition:text msp 'then' msp action:text { \
				return {condition: condition, action: action} \
			} \
			text = c:[a-z]+ { return c.join(''); } \
			msp = sp+ \
			osp = sp* \
			sp = [ \\t\\r\\n] \
			");

		var result = parser.parse('\
\t\r\n\
			when\thungry\rthen\neat\t\r\n ;  \
\t\t\t\t\n\n\n\
			when\n\r  sad\r\t  then\n\r\t  drink  ;\t\t\t  \
\
			');

		console.log(result);

		var rules = {};
		result.forEach(function(rule) {
			rules[rule.condition] = rule.action;
		});

		assert.equal(Object.keys(rules).length, 2);
		assert.equal(rules['hungry'], 'eat');
		assert.equal(rules['sad'], 'drink');
	});
});
