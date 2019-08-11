var assert = require('assert');
var Showdown = require('showdown');
var PEG = require('pegjs');
var cheerio = require('cheerio');

describe('showdown', function() {
	it('should let me render Markdown', function() {
		var converter = new Showdown.converter();
		var html = converter.makeHtml('\
#Hello\n\
\
Hi there');

		var $ = cheerio.load(html);
		assert.equal($('h1').text(), 'Hello');
		assert.equal($('h1').attr('id'), 'hello');
		assert.equal($('p').text(), 'Hi there');
	});

	describe('should let me extend it', function() {
		it('with my dummy extension', function() {
			var helloExtension = function(converter) {
				return [{
					type: 'lang',
					regex: '(\\S+)\\((\\S+),(\\S+)\\)',
					replace: function(match, op, a, b) {					
						var numA = parseInt(a, 10);
						var numB = parseInt(b, 10);
						if(op === 'add') {
							var result = numA + numB;
							return '<span>' + result + '</span>';
						}

						return '<span>wtf</span>';
					}
				}];
			};

			var converter = new Showdown.converter({
				extensions: [helloExtension]
			});

			var html = converter.makeHtml('\
#Hello\n\
add(2,3)\
');
			var $ = cheerio.load(html);
			assert.equal($('p span').text(), '5');
		});

		it('with my more advanced extension', function() {
			var CalculatorExtension = function(PEG) {
				var parser = PEG.buildParser("\
					start = left:num '+' right:num { return left + right; } \
					num = v:[0-9]+ { return parseInt(v.join(''), 10); } \
					");

				return function(converter) {
					return [{
						type: 'lang',
						regex: '`calculate (\\S+)`',
						replace: function(match, program) {
							var result = parser.parse(program);
							return '<span>' + result + '</span>';
						}
					}];
				};
			};

			var calculator = CalculatorExtension(PEG);
			var converter = new Showdown.converter({
				extensions: [calculator]
			});

			var html = converter.makeHtml('\
#Hello\n\
First, 2 and 3 is `calculate 2+3`.\n\
\n\
Then, 100 and 13 is `calculate 100+13`. But `this remains` as usual.\
');

			var $ = cheerio.load(html);
			assert.equal($('p').eq(0).text(), 'First, 2 and 3 is 5.');
			assert.equal($('p span').eq(0).text(), '5');
			assert.equal($('p').eq(1).text(), 'Then, 100 and 13 is 113. But this remains as usual.');
			assert.equal($('p span').eq(1).text(), '113');
			assert.equal($('p code').text(), 'this remains');
		});
	});
});