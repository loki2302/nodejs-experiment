// TODO: add validation tests for both GET and POST

var request = require("request");
var app = require("./app.js").app;

exports.canAddNumbersWithGetRequest = function(test) {
  var server = app.listen(3000, function() {
  	var getParams = { 
  		url: "http://localhost:3000/api/addNumbers/?a=2&b=3", 
  		json: true
  	};
  	request.get(getParams, function(error, response, body) {
  		test.equal(5, body.result, "result should be 5");

  		server.close(function() {
	  	  test.done();
			});
  	});  	
  });
};

exports.canAddNumbersWithPostRequest = function(test) {
  var server = app.listen(3000, function() {
  	var postParams = {
  		url: "http://localhost:3000/api/addNumbers/", 
  		json: { 
  			a:2, 
  			b:3 
  		}
  	};
  	request.post(postParams, function(error, response, body) {

  		test.equal(5, body.result, "result should be 5");

  		server.close(function() {
	  	  test.done();
			});
  	});  	
  });
};
