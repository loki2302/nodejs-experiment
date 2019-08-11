require('co-mocha');
var expect = require('chai').expect;

var AppRunner = require('../be-src/apprunner.js');
var NotepadClient = require('../be-src/client.js');

describe('app', function() {
  var appRunner;
  var client;
  beforeEach(function* () {
    client = new NotepadClient('http://localhost:3000/api/');
    appRunner = new AppRunner();
    yield appRunner.start();
    yield appRunner.reset();
  });

  afterEach(function* () {
    yield appRunner.stop();
  });

  it('should have no notes by default', function* () {
    var response = yield client.getAllNotes();
    expect(response.statusCode).to.equal(200);
    expect(response.body.length).to.equal(0);
  });

  it('should have no categories by default', function* () {
    var response = yield client.getAllCategories();
    expect(response.statusCode).to.equal(200);
    expect(response.body.length).to.equal(0);
  });

  it('should let me create a note', function* () {
    var response = yield client.createNote({
      content: 'hello'
    });
    expect(response.statusCode).to.equal(201);
    expect(response.body.id).to.equal(1);
    expect(response.body.content).to.equal('hello');
  });

  it('should not let me create a note if content is empty string', function* () {
    try {
      yield client.createNote({
        content: ''
      });
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('content');
    }
  });

  it('should not let me create a note if content is null', function* () {
    try {
      yield client.createNote({
        content: null
      });
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('content');
    }
  });

  it('should not let me create a note if content is not defined', function* () {
    try {
      yield client.createNote({});
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('content');
    }
  });

  it('should let me create a note with single category', function* () {
    var createCategoryResponse = yield client.createCategory({
      name: 'js'
    });
    expect(createCategoryResponse.statusCode).to.equal(201);

    var categoryId = createCategoryResponse.body.id;
    var createNoteResponse = yield client.createNote({
      content: 'hello there',
      categories: [
        { id: categoryId }
      ]
    });
    expect(createNoteResponse.statusCode).to.equal(201);
    expect(createNoteResponse.body.id).to.equal(1);
    expect(createNoteResponse.body.content).to.equal('hello there');
    expect(createNoteResponse.body.categories).to.exist;
    expect(createNoteResponse.body.categories.length).to.equal(1);
    expect(createNoteResponse.body.categories[0].id).to.equal(categoryId);
    expect(createNoteResponse.body.categories[0].name).to.equal('js');

    var noteId = createNoteResponse.body.id;
    var getNoteResponse = yield client.getNote(noteId);
    expect(getNoteResponse.body.categories.length).to.equal(1);
  });

  it('should let me create a note with multiple categories', function* () {
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
    expect(createNoteResponse.statusCode).to.equal(201);
    expect(createNoteResponse.body.id).to.equal(1);
    expect(createNoteResponse.body.content).to.equal('hello there');
    expect(createNoteResponse.body.categories).to.exist;
    expect(createNoteResponse.body.categories.length).to.equal(2);
    expect(createNoteResponse.body.categories[0].id).to.equal(jsCategoryId);
    expect(createNoteResponse.body.categories[0].name).to.equal('js');
    expect(createNoteResponse.body.categories[1].id).to.equal(javaCategoryId);
    expect(createNoteResponse.body.categories[1].name).to.equal('java');

    var noteId = createNoteResponse.body.id;
    var getNoteResponse = yield client.getNote(noteId);
    expect(getNoteResponse.body.categories.length).to.equal(2);
  });

  it('should not let me create a note if at least one category does not exist', function* () {
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
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('categories');
    }

    var getAllNotesResponse = yield client.getAllNotes();
    expect(getAllNotesResponse.statusCode).to.equal(200);
    expect(getAllNotesResponse.body.length).to.equal(0);
  });

  it('should let me delete a note', function* () {
    var noteId = (yield client.createNote({
      content: 'hello'
    })).body.id;

    var deleteNoteResponse = yield client.deleteNote(noteId);
    expect(deleteNoteResponse.statusCode).to.equal(200);
    expect(deleteNoteResponse.body).to.include.keys('message');
  });

  it('should not let me delete a note if note does not exist', function* () {
    try {
      yield client.deleteNote(123);
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(404);
      expect(e.response.body).to.include.keys('message');
    }
  });

  it('should respond with 404 if note does not exist', function* () {
    try {
      yield client.getNote(123);
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(404);
      expect(e.response.body).to.include.keys('message');
    }
  });

  it('should let me retrieve a note', function* () {
    var noteId = (yield client.createNote({
      content: 'hello'
    })).body.id;

    var getNoteResponse = yield client.getNote(noteId);
    expect(getNoteResponse.statusCode).to.equal(200);
    expect(getNoteResponse.body.id).to.equal(1);
    expect(getNoteResponse.body.content).to.equal('hello');
  });

  it('should let me update a note', function* () {
    var noteId = (yield client.createNote({
      content: 'hello'
    })).body.id;

    var updateNoteResponse = yield client.updateNote({
      id: noteId,
      content: 'hi there'
    });
    expect(updateNoteResponse.statusCode).to.equal(200);
    expect(updateNoteResponse.body.id).to.equal(1);
    expect(updateNoteResponse.body.content).to.equal('hi there');
  });

  it('should let me add categories to the note', function* () {
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
    expect(updateNoteResponse.statusCode).to.equal(200);
    expect(updateNoteResponse.body.content).to.equal('hi there');
    expect(updateNoteResponse.body.categories.length).to.equal(2);

    note = (yield client.getNote(note.id)).body;
    expect(note.categories.length).to.equal(2);
  });

  it('should not let me update a note when at least one category does not exist', function* () {
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
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('categories');
    }

    note = (yield client.getNote(note.id)).body;
    expect(note.content).to.equal('hello there');
  });

  it('should let me remove note categories', function* () {
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
    expect(updateNoteResponse.statusCode).to.equal(200);
    expect(updateNoteResponse.body.content).to.equal('hello there');
    expect(updateNoteResponse.body.categories.length).to.equal(0);
  });

  it('should let me replace note categories', function* () {
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
    expect(updateNoteResponse.statusCode).to.equal(200);
    expect(updateNoteResponse.body.content).to.equal('hello there');
    expect(updateNoteResponse.body.categories.length).to.equal(1);
  });

  it('should not let me update a note if note does not exist', function* () {
    try {
      yield client.updateNote({
        id: 123,
        content: 'hi there'
      });
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(404);
      expect(e.response.body).to.include.keys('message');
    }
  });

  it('should not let me update a note if fields are not valid', function* () {
    var noteId = (yield client.createNote({
      content: 'hello'
    })).body.id;

    try {
      yield client.updateNote({
        id: noteId,
        content: ''
      });
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('content');
    }
  });

  it('should let me create a category', function* () {
    var response = yield client.createCategory({
      name: 'js'
    });
    expect(response.statusCode).to.equal(201);
    expect(response.body.id).to.equal(1);
    expect(response.body.name).to.equal('js');
  });

  it('should not let me create a category if fields are not valid', function* () {
    try {
      yield client.createCategory({
        name: ''
      });
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('name');
    }
  });

  it('should not let me create a category if it already exists', function* () {
    yield client.createCategory({
      name: 'js'
    });

    try {
      yield client.createCategory({
        name: 'js'
      });
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('name');
    }
  });

  it('should let me delete a category', function* () {
    var categoryId = (yield client.createCategory({
      name: 'js'
    })).body.id;

    var deleteCategoryResponse = yield client.deleteCategory(categoryId);
    expect(deleteCategoryResponse.statusCode).to.equal(200);
    expect(deleteCategoryResponse.body).to.include.keys('message');
  });

  it('should not let me delete a category if category does not exist', function* () {
    try {
      yield client.deleteCategory(123);
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(404);
      expect(e.response.body).to.include.keys('message');
    }
  });

  it('should let me update a category', function* () {
    var categoryId = (yield client.createCategory({
      name: 'js'
    })).body.id;

    var updateCategoryResponse = yield client.updateCategory({
      id: categoryId,
      name: 'java'
    });
    expect(updateCategoryResponse.statusCode).to.equal(200);
    expect(updateCategoryResponse.body.id).to.equal(categoryId);
    expect(updateCategoryResponse.body.name).to.equal('java');
  });

  it('should not let me update category if category does not exist', function* () {
    try {
      yield client.updateCategory({
        id: 123,
        name: 'java'
      });
    } catch(e) {
      expect(e.response.statusCode).to.equal(404);
      expect(e.response.body).to.include.keys('message');
    }
  });

  it('should not let me update a category if fields are not valid', function* () {
    var categoryId = (yield client.createCategory({
      name: 'js'
    })).body.id;

    try {
      yield client.updateCategory({
        id: categoryId,
        name: ''
      });
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('name');
    }
  });

  it('should not let me update a category name if name already used', function* () {
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
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.include.keys('name');
    }
  });

  it('should let me filter categories by first letters', function* () {
    yield client.createCategory({ name: 'aaa' });
    yield client.createCategory({ name: 'aab' });
    yield client.createCategory({ name: 'aba' });
    yield client.createCategory({ name: 'abb' });
    yield client.createCategory({ name: 'baa' });
    yield client.createCategory({ name: 'bbb' });

    var aCategories = (yield client.getCategoriesWithNamesStartingWith('a')).body;
    expect(aCategories.length).to.equal(4);

    var abCategories = (yield client.getCategoriesWithNamesStartingWith('ab')).body;
    expect(abCategories.length).to.equal(2);

    var bCategories = (yield client.getCategoriesWithNamesStartingWith('b')).body;
    expect(bCategories.length).to.equal(2);
  });

  it('should let me delete category linked to note', function* () {
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
    expect(note.categories.length).to.equal(0);
  });

  it('should let me delete note linked to category', function* () {
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
    expect(getCategoryResponse.statusCode).to.equal(200);
  });
});
