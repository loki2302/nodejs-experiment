var assert = require("assert");

var models = require("../models.js");
var makeApp = require("../app.js");
var NotepadClient = require("../client.js");

var co = require('co');

describe("app", function() {
  var client;
  var server;
  beforeEach(function(done) {
    models.reset(function(error) {
      if(error) {
        throw new Error("Failed to reset database");
      }

      client = new NotepadClient("http://localhost:3000/api");
      var app = makeApp(models, {
        // no synth delays for tests
      });
      server = app.listen(3000, function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    server.close(function() {
      done();
    });   
  });

  it("should have no notes by default", function(done) {
    co(function* () {
      var response = yield client.getAllNotesPromise();
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.length, 0);
    }).then(done, done);
  });

  it("should have no categories by default", function(done) {
    co(function* () {
      var response = yield client.getAllCategoriesPromise();
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.length, 0);
    }).then(done, done);
  });

  it("should let me create a note", function(done) {
    co(function* () {
      var response = yield client.createNotePromise({
        content: 'hello'
      });
      assert.equal(response.statusCode, 201);
      assert.equal(response.body.id, 1);
      assert.equal(response.body.content, "hello");
    }).then(done, done);
  });

  it("should not let me create a note if content is empty string", function(done) {
    co(function* () {
      try {
        yield client.createNotePromise({
          content: ''
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("content" in e.response.body);
      }
    }).then(done, done);
  });

  it("should not let me create a note if content is null", function(done) {
    co(function* () {
      try {
        yield client.createNotePromise({
          content: null
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("content" in e.response.body);
      }
    }).then(done, done);
  });

  it("should not let me create a note if content is not defined", function(done) {
    co(function* () {
      try {
        yield client.createNotePromise({});
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("content" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me create a note with single category", function(done) {
    co(function* () {
      var createCategoryResponse = yield client.createCategoryPromise({
        name: 'js'
      });
      assert.equal(createCategoryResponse.statusCode, 201);

      var categoryId = createCategoryResponse.body.id;
      var createNoteResponse = yield client.createNotePromise({
        content: 'hello there',
        categories: [
          { id: categoryId }
        ]
      });
      assert.equal(createNoteResponse.statusCode, 201);
      assert.equal(createNoteResponse.body.id, 1);
      assert.equal(createNoteResponse.body.content, "hello there");
      assert.ok(createNoteResponse.body.categories);
      assert.equal(createNoteResponse.body.categories.length, 1);
      assert.equal(createNoteResponse.body.categories[0].id, categoryId);
      assert.equal(createNoteResponse.body.categories[0].name, "js");

      var noteId = createNoteResponse.body.id;
      var getNoteResponse = yield client.getNotePromise(noteId);
      assert.equal(getNoteResponse.body.categories.length, 1);
    }).then(done, done);
  });

  it("should let me create a note with multiple categories", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategoryPromise({
        name: 'java'
      })).body.id;

      var createNoteResponse = yield client.createNotePromise({
        content: 'hello there',
        categories: [
          { id: jsCategoryId },
          { id: javaCategoryId }
        ]
      });
      assert.equal(createNoteResponse.statusCode, 201);
      assert.equal(createNoteResponse.body.id, 1);
      assert.equal(createNoteResponse.body.content, "hello there");
      assert.ok(createNoteResponse.body.categories);
      assert.equal(createNoteResponse.body.categories.length, 2);
      assert.equal(createNoteResponse.body.categories[0].id, jsCategoryId);
      assert.equal(createNoteResponse.body.categories[0].name, "js");
      assert.equal(createNoteResponse.body.categories[1].id, javaCategoryId);
      assert.equal(createNoteResponse.body.categories[1].name, "java");

      var noteId = createNoteResponse.body.id;
      var getNoteResponse = yield client.getNotePromise(noteId);
      assert.equal(getNoteResponse.body.categories.length, 2);
    }).then(done, done);
  });

  it("should not let me create a note if at least one category doesn't exist", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      try {
        yield client.createNotePromise({
          content: 'hello there',
          categories: [
            { id: jsCategoryId },
            { id: 123 },
            { id: 222 }
          ]
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("message" in e.response.body);
      }

      var getAllNotesResponse = yield client.getAllNotesPromise();
      assert.equal(getAllNotesResponse.statusCode, 200);
      assert.equal(getAllNotesResponse.body.length, 0);
    }).then(done, done);
  });

  it("should let me delete a note", function(done) {
    co(function* () {
      var noteId = (yield client.createNotePromise({
        content: 'hello'
      })).body.id;

      var deleteNoteResponse = yield client.deleteNotePromise(noteId);
      assert.equal(deleteNoteResponse.statusCode, 200);
      assert.ok("message" in deleteNoteResponse.body);
    }).then(done, done);
  });

  it("should not let me delete a note if note does not exist", function(done) {
    co(function* () {
      try {
        yield client.deleteNotePromise(123);
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 404);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  }); 

  it("should respond with 404 if note does not exist", function(done) {
    co(function* () {
      try {
        yield client.getNotePromise(123);
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 404);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me retrieve a note", function(done) {
    co(function* () {
      var noteId = (yield client.createNotePromise({
        content: 'hello'
      })).body.id;

      var getNoteResponse = yield client.getNotePromise(noteId);
      assert.equal(getNoteResponse.statusCode, 200);
      assert.equal(getNoteResponse.body.id, 1);
      assert.equal(getNoteResponse.body.content, "hello");
    }).then(done, done);
  });

  it("should let me update a note", function(done) {
    co(function* () {
      var noteId = (yield client.createNotePromise({
        content: 'hello'
      })).body.id;

      var updateNoteResponse = yield client.updateNotePromise({
        id: noteId,
        content: 'hi there'
      });
      assert.equal(updateNoteResponse.statusCode, 200);
      assert.equal(updateNoteResponse.body.id, 1);
      assert.equal(updateNoteResponse.body.content, 'hi there');
    }).then(done, done);
  });

  it("should let me add categories to the note", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategoryPromise({
        name: 'java'
      })).body.id;

      var note = (yield client.createNotePromise({
        content: 'hello there'
      })).body;

      note.content = 'hi there';
      note.categories = [
        { id: jsCategoryId },
        { id: javaCategoryId }
      ];

      var updateNoteResponse = yield client.updateNotePromise(note);
      assert.equal(updateNoteResponse.statusCode, 200);
      assert.equal(updateNoteResponse.body.content, "hi there");
      assert.equal(updateNoteResponse.body.categories.length, 2);

      note = (yield client.getNotePromise(note.id)).body;
      assert.equal(note.categories.length, 2);
    }).then(done, done);
  });

  it("should not let me update a note when at least one category doesn't exist", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategoryPromise({
        name: 'java'
      })).body.id;

      var note = (yield client.createNotePromise({
        content: 'hello there'
      })).body;

      note.content = 'hi there';
      note.categories = [
        { id: jsCategoryId },
        { id: javaCategoryId },
        { id: 123 }
      ];

      try {
        yield client.updateNotePromise(note);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("message" in e.response.body);
      }      
    }).then(done, done);
  });

  it("should let me remove note categories", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategoryPromise({
        name: 'java'
      })).body.id;

      var note = (yield client.createNotePromise({
        content: 'hello there',
        categories: [
          { id: jsCategoryId },
          { id: javaCategoryId }
        ]
      })).body;

      note.categories = [];

      var updateNoteResponse = yield client.updateNotePromise(note);
      assert.equal(updateNoteResponse.statusCode, 200);
      assert.equal(updateNoteResponse.body.content, 'hello there');
      assert.equal(updateNoteResponse.body.categories.length, 0);
    }).then(done, done);
  });

  it("should let me replace note categories", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategoryPromise({
        name: 'java'
      })).body.id;

      var dotnetCategoryId = (yield client.createCategoryPromise({
        name: 'dotnet'
      })).body.id;

      var note = (yield client.createNotePromise({
        content: 'hello there',
        categories: [
          { id: jsCategoryId },
          { id: javaCategoryId }
        ]
      })).body;

      note.categories = [ 
        { id: dotnetCategoryId } 
      ];

      var updateNoteResponse = yield client.updateNotePromise(note);
      assert.equal(updateNoteResponse.statusCode, 200);
      assert.equal(updateNoteResponse.body.content, 'hello there');
      assert.equal(updateNoteResponse.body.categories.length, 1);
    }).then(done, done);
  });

  it("should not let me update a note if note does not exist", function(done) {
    co(function* () {
      try {
        yield client.updateNotePromise({
          id: 123,
          content: 'hi there'
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 404);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  });

  it("should not let me update a note if fields are not valid", function(done) {
    co(function* () {
      var noteId = (yield client.createNotePromise({
        content: 'hello'
      })).body.id;

      try {
        yield client.updateNotePromise({
          id: noteId,
          content: ''
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("content" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me create a category", function(done) {
    co(function* () {
      var response = yield client.createCategoryPromise({
        name: 'js'
      });
      assert.equal(response.statusCode, 201);
      assert.equal(response.body.id, 1);
      assert.equal(response.body.name, "js");
    }).then(done, done);
  });

  it("should not let me create a category if fields are not valid", function(done) {
    co(function* () {
      try {
        yield client.createCategoryPromise({
          name: ''
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("name" in e.response.body);
      }
    }).then(done, done);
  });

  it("should not let me create a category if it already exists", function(done) {
    co(function* () {
      yield client.createCategoryPromise({
        name: 'js'
      });

      try {
        yield client.createCategoryPromise({
          name: 'js'
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 409);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me delete a category", function(done) {
    co(function* () {
      var categoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var deleteCategoryResponse = yield client.deleteCategoryPromise(categoryId);
      assert.equal(deleteCategoryResponse.statusCode, 200);
      assert.ok("message" in deleteCategoryResponse.body);
    }).then(done, done);
  });

  it("should not let me delete a category if category does not exist", function(done) {
    co(function* () {
      try {
        yield client.deleteCategoryPromise(123);
      } catch(e) {
        assert.equal(e.response.statusCode, 404);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me update a category", function(done) {
    co(function* () {
      var categoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var updateCategoryResponse = yield client.updateCategoryPromise({
        id: categoryId,
        name: 'java'
      });
      assert.equal(updateCategoryResponse.statusCode, 200);
      assert.equal(updateCategoryResponse.body.id, categoryId);
      assert.equal(updateCategoryResponse.body.name, "java");
    }).then(done, done);
  });

  it("should not let me update category if category does not exist", function(done) {
    co(function* () {
      try {
        yield client.updateCategoryPromise({
          id: 123,
          name: 'java'
        });
      } catch(e) {
        assert.equal(e.response.statusCode, 404);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  });

  it("should not let me update a category if fields are not valid", function(done) {
    co(function* () {
      var categoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      try {
        yield client.updateCategoryPromise({
          id: categoryId,
          name: ''
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("name" in e.response.body);
      }
    }).then(done, done);
  });

  it("should not let me update a category name if name already used", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategoryPromise({
        name: 'java'
      })).body.id;

      try {
        yield client.updateCategoryPromise({
          id: jsCategoryId,
          name: 'java'
        });
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 409);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me filter categories by first letters", function(done) {
    co(function* () {
      yield client.createCategoryPromise({ name: 'aaa' });
      yield client.createCategoryPromise({ name: 'aab' });
      yield client.createCategoryPromise({ name: 'aba' });
      yield client.createCategoryPromise({ name: 'abb' });
      yield client.createCategoryPromise({ name: 'baa' });
      yield client.createCategoryPromise({ name: 'bbb' });

      var aCategories = (yield client.getCategoriesWithNamesStartingWithPromise('a')).body;
      assert.equal(aCategories.length, 4);

      var abCategories = (yield client.getCategoriesWithNamesStartingWithPromise('ab')).body;
      assert.equal(abCategories.length, 2);

      var bCategories = (yield client.getCategoriesWithNamesStartingWithPromise('b')).body;
      assert.equal(bCategories.length, 2);
    }).then(done, done);
  });

  it("should let me delete category linked to note", function(done) {
    co(function* () {
      var categoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var noteId = (yield client.createNotePromise({
        content: 'hello there',
        categories: [
          { id: categoryId }
        ]
      })).body.id;

      yield client.deleteCategoryPromise(categoryId);

      var note = (yield client.getNotePromise(noteId)).body;
      assert.equal(note.categories.length, 0);
    }).then(done, done);
  });

  it("should let me delete note linked to category", function(done) {
    co(function* () {
      var categoryId = (yield client.createCategoryPromise({
        name: 'js'
      })).body.id;

      var noteId = (yield client.createNotePromise({
        content: 'hello there',
        categories: [
          { id: categoryId }
        ]
      })).body.id;

      yield client.deleteNotePromise(noteId);

      var getCategoryResponse = (yield client.getCategoryPromise(categoryId));
      assert.equal(getCategoryResponse.statusCode, 200);
    }).then(done, done);
  });
});
