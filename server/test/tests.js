var assert = require("assert");
var async = require("async");

var models = require("../models.js");
var DAO = require("../dao.js").DAO;
var makeApp = require("../app.js");
var NotepadClient = require("../client.js");

describe("app", function() {
	var client;
	var server;
	beforeEach(function(done) {
		models.reset().then(function() {
			client = new NotepadClient("http://localhost:3000/api");
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
		client.getAllNotes(function(error, response, body) {
			assert.ifError(error);
			assert.equal(response.statusCode, 200);			
			assert.equal(body.length, 0);
			done();
		});
	});

	it("should have no categories by default", function(done) {
		client.getAllCategories(function(error, response, body) {
			assert.ifError(error);
			assert.equal(response.statusCode, 200);			
			assert.equal(body.length, 0);
			done();
		});
	});

	it("should let me create a note", function(done) {
		client.createNote({
			content: "hello"
		}, function(error, response, body) {
			assert.ifError(error);
			assert.equal(response.statusCode, 201);
			assert.equal(body.id, 1);
			assert.equal(body.content, "hello");
			done();
		});
	});

	it("should not let me create a note if fields are not valid", function(done) {
		client.createNote({
			content: ""
		}, function(error, response, body) {
			assert.ifError(error);
			assert.equal(response.statusCode, 400);
			assert.ok("content" in body);
			done();
		});
	});

	it("should let me create a note with single category", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 201);
					callback(null, body.id);
				});
			},
			function(jsCategoryId, callback) {
				client.createNote({
					content: "hello there",
					categories: [
						{ id: jsCategoryId }
					]
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 201);
					assert.equal(body.id, 1);
					assert.equal(body.content, "hello there");
					assert.ok(body.categories);
					assert.equal(body.categories.length, 1);
					assert.equal(body.categories[0].id, jsCategoryId);
					assert.equal(body.categories[0].name, "js");
					done();
				});
			}
		]);
	});

	it("should let me create a note with multiple categories", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategories([
					{ tag: "js", category: { name: "js" } },
					{ tag: "java", category: { name: "java" } }
				], function(error, result) {
					assert.ifError(error);
					callback(null, result);					
				});
			},
			function(categoryMap, callback) {
				var jsCategoryId = categoryMap.js.body.id;
				var javaCategoryId = categoryMap.java.body.id;
				client.createNote({
					content: "hello there",
					categories: [
						{ id: jsCategoryId },
						{ id: javaCategoryId }
					]
				}, function(error, response, body) {
					assert.ifError(error);
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
			}
		]);
	});

	it("should not let me create a note if at least one category doesn't exist", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id);					
				});
			},
			function(jsCategoryId, callback) {				
				client.createNote({
					content: "hello there",
					categories: [
						{ id: jsCategoryId },
						{ id: 123 },
						{ id: 222 }
					]
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 400);
					assert.ok("message" in body);
					callback();
				});
			},
			function(callback) {
				client.getAllNotes(function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);			
					assert.equal(body.length, 0);
					done();
				});
			}
		]);
	});

	it("should let me delete a note", function(done) {
		async.waterfall([
			function(callback) {
				client.createNote({
					content: "hello"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id)
				});
			},
			function(noteId, callback) {
				client.deleteNote(noteId, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					assert.ok("message" in body);
					done();
				});
			}
		]);
	});

	it("should not let me delete a note if note does not exist", function(done) {
		client.deleteNote(123, function(error, response, body) {
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();
		});
	});	

	it("should respond with 404 if note does not exist", function(done) {
		client.getNote(123, function(error, response, body) {
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();
		});
	});

	it("should let me retrieve a note", function(done) {
		async.waterfall([
			function(callback) {
				client.createNote({
					content: "hello"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id)
				});
			},
			function(noteId, callback) {
				client.getNote(noteId, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					assert.equal(body.id, 1);
					assert.equal(body.content, "hello");
					done();					
				});
			}
		]);
	});

	it("should let me update a note", function(done) {
		async.waterfall([
			function(callback) {
				client.createNote({
					content: "hello"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id)
				});
			},
			function(noteId, callback) {
				client.updateNote({
					id: noteId,
					content: "hi there"
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					assert.equal(body.id, 1);
					assert.equal(body.content, "hi there");
					done();					
				});
			}
		]);
	});

	it("should let me add categories to the note", function(done) {
		async.waterfall([
			function(callback) {
				async.series({
					categories: function(callback) {
						client.createCategories([
							{ tag: "js", category: { name: "js" } },
							{ tag: "java", category: { name: "java" } }
						], function(error, result) {
							assert.ifError(error);
							callback(null, result);		
						});			
					},
					note: function(callback) {
						client.createNote({
							content: "hello"
						}, function(error, response, body) {							
							assert.ifError(error);
							callback(null, body)
						});
					}
				}, callback);
			},
			function(categoriesAndNote, callback) {
				var note = categoriesAndNote.note;
				var categories = categoriesAndNote.categories;
				note.categories = [
					{ id: categories.js.body.id },
					{ id: categories.java.body.id }
				];
				note.content = "hi there";
				client.updateNote(note, callback);
			},
			function(response, body, callback) {
				assert.equal(response.statusCode, 200);
				assert.equal(body.content, "hi there");
				assert.equal(body.categories.length, 2);
				done();
			}
		]);
	});

	it("should not let me update a note when at least one category doesn't exist", function(done) {
		async.waterfall([
			function(callback) {
				async.series({
					categories: function(callback) {
						client.createCategories([
							{ tag: "js", category: { name: "js" } },
							{ tag: "java", category: { name: "java" } }
						], function(error, result) {
							assert.ifError(error);
							callback(null, result);		
						});			
					},
					note: function(callback) {
						client.createNote({
							content: "hello"
						}, function(error, response, body) {							
							assert.ifError(error);
							callback(null, body)
						});
					}
				}, callback);
			},
			function(categoriesAndNote, callback) {
				var note = categoriesAndNote.note;
				var categories = categoriesAndNote.categories;
				note.categories = [
					{ id: categories.js.body.id },
					{ id: categories.java.body.id },
					{ id: 123 }
				];
				note.content = "hi there";
				client.updateNote(note, callback);
			},
			function(response, body, callback) {
				assert.equal(response.statusCode, 400);
				assert.ok("message" in body);
				done();
			}
		]);
	});

	it("should let me remove note categories", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategories([
					{ tag: "js", category: { name: "js" } },
					{ tag: "java", category: { name: "java" } }
				], function(error, result) {
					assert.ifError(error);
					callback(null, result);					
				});
			},
			function(categoryMap, callback) {
				var jsCategoryId = categoryMap.js.body.id;
				var javaCategoryId = categoryMap.java.body.id;
				client.createNote({
					content: "hello there",
					categories: [
						{ id: jsCategoryId },
						{ id: javaCategoryId }
					]
				}, function(error, response, body) {
					assert.ifError(error);

					body.categories = [];
					client.updateNote(body, callback);
				});
			},
			function(response, body, callback) {
				assert.equal(response.statusCode, 200);
				assert.equal(body.id, 1);
				assert.equal(body.content, "hello there");
				assert.ok(body.categories);
				assert.equal(body.categories.length, 0);
				done();
			}
		]);
	});

	it("should let me replace note categories", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategories([
					{ tag: "js", category: { name: "js" } },
					{ tag: "java", category: { name: "java" } },
					{ tag: "dotnet", category: { name: "dotnet" } }
				], function(error, result) {
					assert.ifError(error);
					callback(null, result);					
				});
			},
			function(categoryMap, callback) {
				var jsCategoryId = categoryMap.js.body.id;
				var javaCategoryId = categoryMap.java.body.id;
				var dotnetCategoryId = categoryMap.dotnet.body.id;
				client.createNote({
					content: "hello there",
					categories: [
						{ id: jsCategoryId },
						{ id: javaCategoryId }
					]
				}, function(error, response, body) {
					assert.ifError(error);

					body.categories = [{ id: dotnetCategoryId }];
					client.updateNote(body, callback);
				});
			},
			function(response, body, callback) {
				assert.equal(response.statusCode, 200);
				assert.equal(body.id, 1);
				assert.equal(body.content, "hello there");
				assert.ok(body.categories);
				assert.equal(body.categories.length, 1);
				done();
			}
		]);
	});

	it("should not let me update a note if note does not exist", function(done) {
		client.updateNote({
			id: 123,
			content: "hi there"
		}, function(error, response, body) {
			assert.ifError(error);
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();					
		});
	});

	it("should not let me update a note if fields are not valid", function(done) {
		async.waterfall([
			function(callback) {
				client.createNote({
					content: "hello"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id)
				});
			},
			function(noteId, callback) {
				client.updateNote({
					id: noteId,
					content: ""
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 400);
					assert.ok("content" in body);
					done();					
				});
			}
		]);
	});

	it("should let me create a category", function(done) {
		client.createCategory({
			name: "js"
		}, function(error, response, body) {
			assert.ifError(error);
			assert.equal(response.statusCode, 201);
			assert.equal(body.id, 1);
			assert.equal(body.name, "js");
			done();
		});
	});

	it("should not let me create a category if fields are not valid", function(done) {
		client.createCategory({
			name: ""
		}, function(error, response, body) {
			assert.ifError(error);
			assert.equal(response.statusCode, 400);
			assert.ok("name" in body);
			done();
		});
	});

	it("should not let me create a category if it already exists", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					callback();
				});
			},
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 409);
					assert.ok("message" in body);
					done();
				});
			}
		]);
	});

	it("should let me delete a category", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id);
				});
			},
			function(categoryId, callback) {
				client.deleteCategory(categoryId, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					assert.ok("message" in body);
					done();
				});
			}
		]);
	});

	it("should not let me delete a category if category does not exist", function(done) {
		client.deleteCategory(123, function(error, response, body) {
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();
		});
	});

	it("should let me update a category", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id);
				});
			},
			function(categoryId, callback) {
				client.updateCategory({
					id: categoryId,
					name: "java"
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					assert.equal(body.id, 1);
					assert.equal(body.name, "java");
					done();
				});
			}
		]);
	});

	it("should not let me update category if category does not exist", function(done) {
		client.updateCategory({
			id: 123,
			name: "java"
		}, function(error, response, body) {
			assert.ifError(error);
			assert.equal(response.statusCode, 404);
			assert.ok("message" in body);
			done();
		});
	});

	it("should not let me update a category if fields are not valid", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id);
				});
			},
			function(categoryId, callback) {
				client.updateCategory({
					id: categoryId,
					name: ""
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 400);
					assert.ok("name" in body);
					done();
				});
			}
		]);
	});

	it("should not let me update a category name if name already used", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategories([
					{ tag: "js", category: { name: "js" } },
					{ tag: "java", category: { name: "java" } }
				], function(error, result) {
					assert.ifError(error);
					callback(null, result);					
				});
			},
			function(categoryMap, callback) {
				var jsCategoryId = categoryMap.js.body.id;
				callback(null, jsCategoryId);
			},
			function(jsCategoryId, callback) {
				client.updateCategory({
					id: jsCategoryId,
					name: "java"
				}, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 409);
					assert.ok("message" in body);
					done();
				});
			}
		]);
	});

	it("should let me filter categories by first letters", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategories([
					{ tag: "aaa", category: { name: "aaa" } },
					{ tag: "aab", category: { name: "aab" } },
					{ tag: "aba", category: { name: "aba" } },
					{ tag: "abb", category: { name: "abb" } },
					{ tag: "baa", category: { name: "baa" } },
					{ tag: "bbb", category: { name: "bbb" } }
				], function(error, result) {
					assert.ifError(error);
					callback();					
				});
			},
			function(callback) {
				client.getCategoriesWithNameStartingWith("a", function(error, response, body) {
					assert.ifError(error);
					assert.equal(body.length, 4);
					callback();
				});
			},
			function(callback) {
				client.getCategoriesWithNameStartingWith("ab", function(error, response, body) {
					assert.ifError(error);
					assert.equal(body.length, 2);
					callback();
				});
			},
			function(callback) {
				client.getCategoriesWithNameStartingWith("b", function(error, response, body) {
					assert.ifError(error);
					assert.equal(body.length, 2);
					done();
				});
			}
		]);
	});

	it("should let me delete category linked to note", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id);
				});
			},
			function(jsCategoryId, callback) {
				client.createNote({
					content: "hello there",
					categories: [
						{ id: jsCategoryId }
					]
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, jsCategoryId, body.id);
				});
			},
			function(jsCategoryId, helloNoteId, callback) {
				client.deleteCategory(jsCategoryId, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					callback(null, helloNoteId);
				});
			},
			function(helloNoteId, callback) {
				client.getNote(helloNoteId, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					assert.equal(body.categories.length, 0);
					done();
				});
			}
		]);
	});

	it("should let me delete note linked to category", function(done) {
		async.waterfall([
			function(callback) {
				client.createCategory({
					name: "js"
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, body.id);
				});
			},
			function(jsCategoryId, callback) {
				client.createNote({
					content: "hello there",
					categories: [
						{ id: jsCategoryId }
					]
				}, function(error, response, body) {
					assert.ifError(error);
					callback(null, jsCategoryId, body.id);
				});
			},
			function(jsCategoryId, helloNoteId, callback) {
				client.deleteNote(helloNoteId, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					callback(null, jsCategoryId);
				});
			},
			function(jsCategoryId, callback) {
				client.getCategory(jsCategoryId, function(error, response, body) {
					assert.ifError(error);
					assert.equal(response.statusCode, 200);
					done();
				});
			}
		]);
	});
});
