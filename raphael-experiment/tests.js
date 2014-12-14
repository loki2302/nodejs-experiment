var assert = require('assert');
var raphael = require('node-raphael');
var cheerio = require('cheerio');

describe('raphael', function() {
	it('should let me draw a circle', function() {
		var svg = raphael.generate(100, 100, function(paper) {
			var c = paper.circle(50, 50, 10);
			c.attr('fill', '#f00');
			c.attr('stroke', '#0f0');
		});

		console.log(svg);

		var $ = cheerio.load(svg);
		var circleElement = $('svg circle'); 
		assert.equal(circleElement.attr('cx'), '50');
		assert.equal(circleElement.attr('cy'), '50');
		assert.equal(circleElement.attr('r'), '10');
		assert.equal(circleElement.attr('fill'), '#ff0000');
		assert.equal(circleElement.attr('stroke'), '#00ff00');
	});
});
