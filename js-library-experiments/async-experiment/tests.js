var async = require("async");
var uuid = require("node-uuid");
var assert = require("assert");

function createNote(content, callback) {
	setTimeout(function() {
		var note = {
			id: uuid.v4(),
			content: content
		};
		callback(null, note);
	}, 1);
};

function assertResultIsOk(result) {
	assert.ok("js" in result);
	assert.equal("js note", result.js.content);

	assert.ok("java" in result);
	assert.equal("java note", result.java.content);

	assert.ok("dotnet" in result);
	assert.equal("dotnet note", result.dotnet.content);
};

describe("To create multiple notes, I can use", function() {
	it("reduce", function(done) {
		function createNotes(notesWithTags, callback) {
			async.reduce(notesWithTags, {}, function(memo, item, callback) {				
				createNote(item.content, function(err, result) {
					if(err) {
						callback(err);
						return;
					}

					memo[item.tag] = result;
					callback(null, memo);
				});
			}, callback);
		};

		createNotes([
			{ tag: "js", content: "js note" },
			{ tag: "java", content: "java note" },
			{ tag: "dotnet", content: "dotnet note" }
		], function(err, result) {
			if(err) {
				assert.ok(false);
			}

			assertResultIsOk(result);
			done();
		});
	});

	it("series", function(done) {
		function createNotes(notesWithTags, callback) {
			var tasks = notesWithTags.reduce(function(memo, item) {
				memo[item.tag] = createNote.bind(null, item.content);
				return memo;
			}, {});

			async.series(tasks, callback);
		};

		createNotes([
			{ tag: "js", content: "js note" },
			{ tag: "java", content: "java note" },
			{ tag: "dotnet", content: "dotnet note" }
		], function(err, result) {
			if(err) {
				assert.ok(false);
			}

			assertResultIsOk(result);
			done();
		});
	});
});

describe("I can use", function() {
	it("auto", function(done) {
		async.auto({
			getId: function(callback) {
				callback(null, 123);
			},
			getText: function(callback) {
				callback(null, "hello");
			},
			createNote: ["getId", "getText", function(callback, results) {
				callback(null, {
					id: results.getId,
					text: results.getText
				});
			}]
		}, function(error, results) {
			assert.equal(results.createNote.id, 123);
			assert.equal(results.createNote.text, "hello");
			done();
		});
	});
});