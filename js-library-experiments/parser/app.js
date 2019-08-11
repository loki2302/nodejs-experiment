var CharParser = require('./CharParser');
var SequenceParser = require('./SequenceParser');
var ParseResult = require('./ParseResult');
var ParserContext = require('./ParserContext');
var ActionParser = require('./ActionParser');
var RangeParser = require('./RangeParser');
var OneOrMoreParser = require('./OneOrMoreParser');
var OrParser = require('./OrParser');

var tree = [];

var expr = '1+2-3';

var num = new ActionParser(new OneOrMoreParser(new RangeParser('0', '9')), function(s) {
	var value = parseInt(s);
	var intNode = new IntNode(value);
	tree.push(intNode);
});

var op = new ActionParser(new OrParser([
	new CharParser('+'),
	new CharParser('-')
]), function(s) {
	var op = s;
	var opNode = new OpNode(op);
	tree.push(opNode);
});

var p = new SequenceParser([
	num,
	new OneOrMoreParser(
		new ActionParser(
			new SequenceParser([
				op, num
			]), function() {
				var n2 = tree.pop();
				var opNode = tree.pop();
				var n1 = tree.pop();
				opNode.left = n1;
				opNode.right = n2;
				tree.push(opNode);
			}))
	
]);

var IntNode = function(value) {
	this.value = value;
};

var OpNode = function(op) {
	this.op = op;
};

var context = new ParserContext(expr, 0);
console.log(p.parse(context));
console.log('-----------');
console.log(JSON.stringify(tree, null, 2));