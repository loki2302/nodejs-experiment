var assert = require('assert');

describe('harmony', function() {
	describe('generator', function() {
		it('should work', function() {
			function* hiThereGenerator() {
				yield 'hi';
				yield 'there';
			}

			var it = hiThereGenerator();
			var v = it.next();
			assert.equal(v.value, 'hi');
			assert.equal(v.done, false);

			v = it.next();
			assert.equal(v.value, 'there');
			assert.equal(v.done, false);

			v = it.next();
			assert.equal(v.value, undefined);
			assert.equal(v.done, true);
		});
	});	
});