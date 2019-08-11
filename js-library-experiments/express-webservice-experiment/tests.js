// TODO: add validation tests for both GET and POST

var request = require("request");
var app = require("./app.js").app;

exports.setUp = function(callback) {
  this.server = app.listen(3000, function() {
    callback();
  });
};

exports.tearDown = function(callback) {
  this.server.close(function() {
    callback();
  });
};

exports.canAddNumbersWithGetRequest = function(test) {  
	var getParams = { 
		url: "http://localhost:3000/api/addNumbers/?a=2&b=3", 
		json: true
	};
	request.get(getParams, function(error, response, body) {
    test.equal(response.statusCode, 200);
		test.equal(body.result, 5, "result should be 5");
    test.done();
	});
};

exports.validationWorksForGetRequest = function(test) {
  var getParams = { 
    url: "http://localhost:3000/api/addNumbers/?a=hello&b=there", 
    json: true
  };
  request.get(getParams, function(error, response, body) {
    test.equal(response.statusCode, 400);
    test.ok('a' in body);
    test.ok('b' in body);
    test.done();
  });
};

exports.canAddNumbersWithPostRequest = function(test) {  
	var postParams = {
		url: "http://localhost:3000/api/addNumbers/", 
		json: { 
			a: 2, 
			b: 3 
		}
	};
	request.post(postParams, function(error, response, body) {
		test.equal(response.statusCode, 200);
    test.equal(body.result, 5, "result should be 5");
    test.done();
	});
};

exports.validationWorksForPostRequest = function(test) {  
  var postParams = {
    url: "http://localhost:3000/api/addNumbers/", 
    json: { 
      a: "hello", 
      b: "there" 
    }
  };
  request.post(postParams, function(error, response, body) {
    test.equal(response.statusCode, 400);
    test.ok('a' in body);
    test.ok('b' in body);
    test.done();
  });
};
