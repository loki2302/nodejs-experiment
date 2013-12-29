var libxmljs = require("libxmljs");

exports.canGetAttributeValue = function(test) {
	var xmlDoc = getDocument();	
	test.equal(xmlDoc.get("/doc/person").attr("id").value(), "123");
	test.done();
};

exports.canGetInnerText = function(test) {
	var xmlDoc = getDocument();	
	test.equal(xmlDoc.get("/doc/person/name").text(), "loki2302");
	test.done();
};

exports.canGetChildNodes = function(test) {
	var xmlDoc = getDocument();	
	var keywordNodes = xmlDoc.find("/doc/person/keywords/keyword");
	test.equal(keywordNodes.length, 2);
	test.equal(keywordNodes[0].text(), "java");
	test.equal(keywordNodes[1].text(), ".net");
	test.done();
};

function getDocument() {
	var xml = 
		'<?xml version="1.0" encoding="UTF-8"?>' + 
		'<doc>' + 
		'	<person id="123">' +
		'		<name>loki2302</name>' +
		'		<keywords>' +
		'			<keyword>java</keyword>' +
		'			<keyword>.net</keyword>' +
		'		</keywords>' +
		'	</person>' +
		'</doc>';

	return libxmljs.parseXml(xml);
};