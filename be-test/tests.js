var assert = require("assert");

var makeModels = require("../be-src/models.js");
var makeApp = require("../be-src/app.js");
var NotepadClient = require("../be-src/client.js");

var co = require('co');

describe("app", function() {
  var client;
  var server;
  beforeEach(function(done) {
    var models = makeModels();

    models.reset().then(function() {
      client = new NotepadClient("http://localhost:3000/api");
      var app = makeApp(models, {
        // no synth delays for tests
      });
      server = app.listen(3000, function() {
        done();
      });
    }, function(error) {
      throw new Error("Failed to reset database");
    });
  });

  afterEach(function(done) {
    server.close(function() {
      done();
    });   
  });

  it("should have no notes by default", function(done) {
    co(function* () {
      var response = yield client.getAllNotes();
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.length, 0);
    }).then(done, done);
  });

  it("should have no categories by default", function(done) {
    co(function* () {
      var response = yield client.getAllCategories();
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.length, 0);
    }).then(done, done);
  });

  it("should let me create a note", function(done) {
    co(function* () {
      var response = yield client.createNote({
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
        yield client.createNote({
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
        yield client.createNote({
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
        yield client.createNote({});
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok("content" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me create a note with single category", function(done) {
    co(function* () {
      var createCategoryResponse = yield client.createCategory({
        name: 'js'
      });
      assert.equal(createCategoryResponse.statusCode, 201);

      var categoryId = createCategoryResponse.body.id;
      var createNoteResponse = yield client.createNote({
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
      var getNoteResponse = yield client.getNote(noteId);
      assert.equal(getNoteResponse.body.categories.length, 1);
    }).then(done, done);
  });

  it("should let me create a note with multiple categories", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategory({
        name: 'java'
      })).body.id;

      var createNoteResponse = yield client.createNote({
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
      var getNoteResponse = yield client.getNote(noteId);
      assert.equal(getNoteResponse.body.categories.length, 2);
    }).then(done, done);
  });

  it("should not let me create a note if at least one category doesn't exist", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      try {
        yield client.createNote({
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
        assert.ok("categories" in e.response.body);
      }

      var getAllNotesResponse = yield client.getAllNotes();
      assert.equal(getAllNotesResponse.statusCode, 200);
      assert.equal(getAllNotesResponse.body.length, 0);
    }).then(done, done);
  });

  it("should let me delete a note", function(done) {
    co(function* () {
      var noteId = (yield client.createNote({
        content: 'hello'
      })).body.id;

      var deleteNoteResponse = yield client.deleteNote(noteId);
      assert.equal(deleteNoteResponse.statusCode, 200);
      assert.ok("message" in deleteNoteResponse.body);
    }).then(done, done);
  });

  it("should not let me delete a note if note does not exist", function(done) {
    co(function* () {
      try {
        yield client.deleteNote(123);
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
        yield client.getNote(123);
        assert.ok(false);
      } catch(e) {
        assert.equal(e.response.statusCode, 404);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me retrieve a note", function(done) {
    co(function* () {
      var noteId = (yield client.createNote({
        content: 'hello'
      })).body.id;

      var getNoteResponse = yield client.getNote(noteId);
      assert.equal(getNoteResponse.statusCode, 200);
      assert.equal(getNoteResponse.body.id, 1);
      assert.equal(getNoteResponse.body.content, "hello");
    }).then(done, done);
  });

  it("should let me update a note", function(done) {
    co(function* () {
      var noteId = (yield client.createNote({
        content: 'hello'
      })).body.id;

      var updateNoteResponse = yield client.updateNote({
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
      var jsCategoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategory({
        name: 'java'
      })).body.id;

      var note = (yield client.createNote({
        content: 'hello there'
      })).body;

      note.content = 'hi there';
      note.categories = [
        { id: jsCategoryId },
        { id: javaCategoryId }
      ];

      var updateNoteResponse = yield client.updateNote(note);
      assert.equal(updateNoteResponse.statusCode, 200);
      assert.equal(updateNoteResponse.body.content, "hi there");
      assert.equal(updateNoteResponse.body.categories.length, 2);

      note = (yield client.getNote(note.id)).body;
      assert.equal(note.categories.length, 2);
    }).then(done, done);
  });

  it("should not let me update a note when at least one category doesn't exist", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategory({
        name: 'java'
      })).body.id;

      var note = (yield client.createNote({
        content: 'hello there'
      })).body;

      note.content = 'hi there';
      note.categories = [
        { id: jsCategoryId },
        { id: javaCategoryId },
        { id: 123 }
      ];

      try {
        yield client.updateNote(note);
      } catch(e) {
        assert.equal(e.response.statusCode, 400);
        assert.ok('categories' in e.response.body);
      }

      note = (yield client.getNote(note.id)).body;
      assert.equal(note.content, 'hello there');
    }).then(done, done);
  });

  it("should let me remove note categories", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategory({
        name: 'java'
      })).body.id;

      var note = (yield client.createNote({
        content: 'hello there',
        categories: [
          { id: jsCategoryId },
          { id: javaCategoryId }
        ]
      })).body;

      note.categories = [];

      var updateNoteResponse = yield client.updateNote(note);
      assert.equal(updateNoteResponse.statusCode, 200);
      assert.equal(updateNoteResponse.body.content, 'hello there');
      assert.equal(updateNoteResponse.body.categories.length, 0);
    }).then(done, done);
  });

  it("should let me replace note categories", function(done) {
    co(function* () {
      var jsCategoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategory({
        name: 'java'
      })).body.id;

      var dotnetCategoryId = (yield client.createCategory({
        name: 'dotnet'
      })).body.id;

      var note = (yield client.createNote({
        content: 'hello there',
        categories: [
          { id: jsCategoryId },
          { id: javaCategoryId }
        ]
      })).body;

      note.categories = [ 
        { id: dotnetCategoryId } 
      ];

      var updateNoteResponse = yield client.updateNote(note);
      assert.equal(updateNoteResponse.statusCode, 200);
      assert.equal(updateNoteResponse.body.content, 'hello there');
      assert.equal(updateNoteResponse.body.categories.length, 1);
    }).then(done, done);
  });

  it("should not let me update a note if note does not exist", function(done) {
    co(function* () {
      try {
        yield client.updateNote({
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
      var noteId = (yield client.createNote({
        content: 'hello'
      })).body.id;

      try {
        yield client.updateNote({
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
      var response = yield client.createCategory({
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
        yield client.createCategory({
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
      yield client.createCategory({
        name: 'js'
      });

      try {
        yield client.createCategory({
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
      var categoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var deleteCategoryResponse = yield client.deleteCategory(categoryId);
      assert.equal(deleteCategoryResponse.statusCode, 200);
      assert.ok("message" in deleteCategoryResponse.body);
    }).then(done, done);
  });

  it("should not let me delete a category if category does not exist", function(done) {
    co(function* () {
      try {
        yield client.deleteCategory(123);
      } catch(e) {
        assert.equal(e.response.statusCode, 404);
        assert.ok("message" in e.response.body);
      }
    }).then(done, done);
  });

  it("should let me update a category", function(done) {
    co(function* () {
      var categoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var updateCategoryResponse = yield client.updateCategory({
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
        yield client.updateCategory({
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
      var categoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      try {
        yield client.updateCategory({
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
      var jsCategoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var javaCategoryId = (yield client.createCategory({
        name: 'java'
      })).body.id;

      try {
        yield client.updateCategory({
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
      yield client.createCategory({ name: 'aaa' });
      yield client.createCategory({ name: 'aab' });
      yield client.createCategory({ name: 'aba' });
      yield client.createCategory({ name: 'abb' });
      yield client.createCategory({ name: 'baa' });
      yield client.createCategory({ name: 'bbb' });

      var aCategories = (yield client.getCategoriesWithNamesStartingWith('a')).body;
      assert.equal(aCategories.length, 4);

      var abCategories = (yield client.getCategoriesWithNamesStartingWith('ab')).body;
      assert.equal(abCategories.length, 2);

      var bCategories = (yield client.getCategoriesWithNamesStartingWith('b')).body;
      assert.equal(bCategories.length, 2);
    }).then(done, done);
  });

  it("should let me delete category linked to note", function(done) {
    co(function* () {
      var categoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var noteId = (yield client.createNote({
        content: 'hello there',
        categories: [
          { id: categoryId }
        ]
      })).body.id;

      yield client.deleteCategory(categoryId);

      var note = (yield client.getNote(noteId)).body;
      assert.equal(note.categories.length, 0);
    }).then(done, done);
  });

  it("should let me delete note linked to category", function(done) {
    co(function* () {
      var categoryId = (yield client.createCategory({
        name: 'js'
      })).body.id;

      var noteId = (yield client.createNote({
        content: 'hello there',
        categories: [
          { id: categoryId }
        ]
      })).body.id;

      yield client.deleteNote(noteId);

      var getCategoryResponse = (yield client.getCategory(categoryId));
      assert.equal(getCategoryResponse.statusCode, 200);
    }).then(done, done);
  });
});
