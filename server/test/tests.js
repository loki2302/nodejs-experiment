var assert = require("assert");
var request = require("request");

var models = require("../models.js");
var DAO = require("../dao.js").DAO;
var makeApp = require("../app.js");
var Q = require("q");

function url(path) {
	return "http://localhost:3000/api" + path;
}

describe("app", function() {
	var server;
	beforeEach(function(done) {
		models.reset().then(function() {
			var dao = new DAO(models);
			var app = makeApp(dao, models, {
				// no synth delays for tests
			});
			server = app.listen(3000, function() {
				done();
			});
		}, function(error) {
			throw new Error("Failed to initialize models");
		});
	});

	afterEach(function(done) {
		server.close(function() {
			done();
		});		
	});

	it("should have no notes by default", function(done) {
		var params = { 
			url: url("/notes/"), 
			json: true 
		};
		request.get(params, function(error, response, body) {
			assert.equal(response.statusCode, 200);			
			assert.equal(body.length, 0);
			done();
		});
	});

	it("should have no categories by default", function(done) {
		var params = { 
			url: url("/categories/"), 
			json: true 
		};
		request.get(params, function(error, response, body) {
			assert.equal(response.statusCode, 200);			
			assert.equal(body.length, 0);
			done();
		});
	});

	it("should let me create a note", function(done) {
		var params = {
			url: url("/notes/"),
			json: {
				content: "hello"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 201);
			assert.equal(body.id, 1);
			assert.equal(body.content, "hello");
			done();
		});
	});

	it("should not let me create a note if fields are not valid", function(done) {
		var params = {
			url: url("/notes/"),
			json: {
				content: ""
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 400);
			assert.ok("content" in body);
			done();
		});
	});

	it("should let me create a note with single category", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 201);

			var jsCategoryId = body.id;
			var params = {
				url: url("/notes/"),
				json: {
					content: "hello there",
					categories: [
						{ id: jsCategoryId }
					]
				}
			};
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 201);
				assert.equal(body.id, 1);
				assert.equal(body.content, "hello there");
				assert.ok(body.categories);
				assert.equal(body.categories.length, 1);
				assert.equal(body.categories[0].id, jsCategoryId);
				assert.equal(body.categories[0].name, "js");
				done();
			});
		});
	});

	it("should let me create a note with multiple categories", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 201);

			var jsCategoryId = body.id;
			var params = {
				url: url("/categories/"),
				json: {
					name: "java"
				}
			};
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 201);

				var javaCategoryId = body.id;
				var params = {
					url: url("/notes/"),
					json: {
						content: "hello there",
						categories: [
							{ id: jsCategoryId },
							{ id: javaCategoryId }
						]
					}
				};
				request.post(params, function(error, response, body) {
					assert.equal(response.statusCode, 201);
					assert.equal(body.id, 1);
					assert.equal(body.content, "hello there");
					assert.ok(body.categories);
					assert.equal(body.categories.length, 2);
					assert.equal(body.categories[0].id, jsCategoryId);
					assert.equal(body.categories[0].name, "js");
					assert.equal(body.categories[1].id, javaCategoryId);
					assert.equal(body.categories[1].name, "java");
					done();
				});
			});			
		});
	});

	it("should not let me create a note if at least one category doesn't exist", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 201);

			var jsCategoryId = body.id;
			var params = {
				url: url("/notes/"),
				json: {
					content: "hello there",
					categories: [
						{ id: jsCategoryId },
						{ id: 123 },
						{ id: 222 }
					]
				}
			};
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 400);
				assert.ok("message" in body);

				var params = { 
					url: url("/notes/"), 
					json: true 
				};
				request.get(params, function(error, response, body) {
					assert.equal(response.statusCode, 200);			
					assert.equal(body.length, 0);
					done();
				});
			});
		});
	});

	it("should let me delete a note", function(done) {
		var params = {
			url: url("/notes/"),
			json: {
				content: "hello"
			}
		};
		request.post(params, function(error, response, body) {			
			var params = {
				url: url("/notes/" + body.id),
				json: true
			};
			request.del(params, function(error, response, body) {
				assert.equal(response.statusCode, 200);
				assert.ok("message" in body);
				done();
			});
		});
	});

	it("should not let me delete a note if note does not exist", function(done) {
		var params = {
			url: url("/notes/" + 123),
			json: true
		};
		request.del(params, function(error, response, body) {
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();
		});
	});	

	it("should let me update a note", function(done) {
		var params = {
			url: url("/notes/"),
			json: {
				content: "hello"
			}
		};
		request.post(params, function(error, response, body) {			
			var params = {
				url: url("/notes/" + body.id),
				json: {
					content: "hi there"
				}
			};
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 200);
				assert.equal(body.id, 1);
				assert.equal(body.content, "hi there");
				done();
			});
		});
	});

	it("should not let me update a note if note does not exist", function(done) {
		var params = {
			url: url("/notes/" + 123),
			json: {
				content: "hi there"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();
		});
	});

	it("should not let me update a note if fields are not valid", function(done) {
		var params = {
			url: url("/notes/"),
			json: {
				content: "hello"
			}
		};
		request.post(params, function(error, response, body) {			
			var params = {
				url: url("/notes/" + body.id),
				json: {
					content: ""
				}
			};
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 400);
				assert.ok("content" in body);
				done();
			});
		});
	});

	it("should let me create a category", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 201);
			assert.equal(body.id, 1);
			assert.equal(body.name, "js");
			done();
		});
	});

	it("should not let me create a category if fields are not valid", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: ""
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 400);
			assert.ok("name" in body);
			done();
		});
	});

	it("should not let me create a category if it already exists", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 409);
				assert.ok("message" in body);
				done();
			});
		});
	});

	it("should let me delete a category", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {			
			var params = {
				url: url("/categories/" + body.id),
				json: true
			};
			request.del(params, function(error, response, body) {
				assert.equal(response.statusCode, 200);
				assert.ok("message" in body);
				done();
			});
		});
	});

	it("should not let me delete a category if category does not exist", function(done) {
		var params = {
			url: url("/categories/" + 123),
			json: true
		};
		request.del(params, function(error, response, body) {
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();
		});
	});

	it("should let me update a category", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {			
			var params = {
				url: url("/categories/" + body.id),
				json: {
					name: "java"
				}
			};
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 200);
				assert.equal(body.id, 1);
				assert.equal(body.name, "java");
				done();
			});
		});
	});

	it("should not let me update category if category does not exist", function(done) {
		var params = {
			url: url("/categories/" + 123),
			json: {
				name: "java"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();
		});
	});

	it("should not let me update a category if fields are not valid", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {			
			var params = {
				url: url("/categories/" + body.id),
				json: {
					name: ""
				}
			};
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 400);
				assert.ok("name" in body);
				done();
			});
		});
	});

	function createCategory(name) {
		return Q.Promise(function(resolve, reject) {
			var params = {
				url: url("/categories/"),
				json: {
					name: name
				}
			};
			request.post(params, function(error, response, body) {
				if(error) {
					reject(error);
					return;
				}

				resolve({
					response: response,
					body: body
				});
			});
		});
	};

	function createCategories(categories) {
		var promises = categories.map(function(category) {
			return createCategory(category.name).then(function(result) {
				return {
					tag: category.tag,
					id: result.body.id
				};
			});
		});

		return Q.all(promises).then(function(results) {
			return results.reduce(function(map, result) {
				map[result.tag] = result.id;
				return map;
			}, {});
		});
	};

	it("should not let me update a category name if name already used", function(done) {
		createCategories([
			{ tag: "js", name: "js" },
			{ tag: "java", name: "java" }
		]).then(function(categoryIds) {
			var params = {
				url: url("/categories/" + categoryIds.js),
				json: {
					name: "java"
				}
			};
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 409);
				assert.ok("message" in body);
				done();
			});
		}, function(error) {
			assert.ok(false);
		});
	});

	it("should let me filter categories by first letters", function(done) {
		createCategories([
			{ tag: "aaa", name: "aaa" },
			{ tag: "aab", name: "aab" },
			{ tag: "aba", name: "aba" },
			{ tag: "abb", name: "abb" },
			{ tag: "baa", name: "baa" },
			{ tag: "bbb", name: "bbb" }
		]).then(function(categoryIds) {
			var params = {
				url: url("/categories/"),
				qs: { nameStartsWith: "a" },
				json: true
			};
			request.get(params, function(error, response, body) {
				assert.equal(body.length, 4);

				var params = {
					url: url("/categories/"),
					qs: { nameStartsWith: "aa" },
					json: true
				};
				request.get(params, function(error, response, body) {
					assert.equal(body.length, 2);
					done();
				});
			});
		});
	});
});
