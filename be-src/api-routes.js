var Sequelize = require('sequelize');
var Router = require('koa-router');

module.exports = function(models) {
  var Note = models.Note;
  var Category = models.Category;

  var apiRouter = new Router();  

  apiRouter.param("note_id", function* (noteId, next) {
    var note = yield Note.find({
      where: { id: noteId },
      include: [ Category ]
    }, {
      transaction: this.tx
    });

    if(!note) {
      this.noteNotFound(noteId);
    }

    this.note = note;   
    yield next;
  });

  apiRouter.get("/notes/", function* (next) {
    var notes = yield Note.findAll({
      include: [ Category ]
    }, { 
      transaction: this.tx 
    });

    this.okNoteCollection(notes);
  }); 

  apiRouter.get("/notes/:note_id", function* (next) {
    this.okNote(this.note);
  });

  apiRouter.delete("/notes/:note_id", function* (next) {
    yield this.note.destroy({
      transaction: this.tx
    });

    this.ok('Deleted');
  });

  apiRouter.post('/notes/', function* (next) {
    var categoryIds = (this.request.body.categories || []).map(function(category) {
      return category.id; 
    });

    var categories = yield Category.findAll({
      where: {
        id: { in: categoryIds }
      }
    }, {
      transaction: this.tx
    });

    if(categories.length !== categoryIds.length) {
      this.validationError({
        categories: 'At least one category does not exist'
      });
    }

    var note;
    try {
      note = yield Note.create({
        content: this.request.body.content
      }, {
        transaction: this.tx
      });

      yield note.setCategories(categories, {
        transaction: this.tx
      });
    } catch(e) {
      if(e instanceof Sequelize.ValidationError) {
        this.validationErrorFromSequelizeValidationError(e);
      }

      throw e;
    }

    note = yield Note.find({
      where: { id: note.id },
      include: [ Category ]
    }, {
      transaction: this.tx
    });

    this.createdNote(note);
  });

  apiRouter.post('/notes/:note_id', function* (next) {
    this.note.content = this.request.body.content;
    try {
      yield this.note.save({
        transaction: this.tx
      });
    } catch(e) {
      if(e instanceof Sequelize.ValidationError) {
        this.validationErrorFromSequelizeValidationError(e);
      }

      throw e;
    }

    var categoryIds = (this.request.body.categories || []).map(function(category) {
      return category.id; 
    });

    var categories = yield Category.findAll({
      where: {
        id: { in: categoryIds }
      }
    }, {
      transaction: this.tx
    });

    if(categories.length !== categoryIds.length) {
      this.validationError({
        categories: 'At least one category does not exist'
      });
    }

    yield this.note.setCategories(categories, {
      transaction: this.tx
    });

    var note = yield Note.find({
      where: { id: this.note.id },
      include: [ Category ]
    }, {
      transaction: this.tx
    });

    this.okNote(note);
  });

  apiRouter.param("category_id", function* (categoryId, next) {
    var category = yield Category.find({
      where: { id: categoryId }
    }, {
      transaction: this.tx
    });

    if(!category) {
      this.categoryNotFound(categoryId);
    }

    this.category = category;
    yield next;
  });

  apiRouter.get('/categories/', function* (next) {
    var criteria = {};
    var nameStartsWith = this.request.query.nameStartsWith;
    if(nameStartsWith) {
      var lowercaseNameStartsWith = nameStartsWith.toLowerCase();
      criteria = {
        where: ["lower(name) like ?", lowercaseNameStartsWith + '%']
      };
    }

    var categories = yield Category.findAll(criteria, {
      transaction: this.tx
    });

    this.okCategoryCollection(categories);
  });

  apiRouter.get('/categories/:category_id', function* (next) {
    this.okCategory(this.category);
  });

  apiRouter.post('/categories/', function* (next) {
    var category;
    try {
      category = yield Category.create({
        name: this.request.body.name
      });
    } catch(e) {
      if(e instanceof Sequelize.ValidationError) {
        this.validationErrorFromSequelizeValidationError(e);
      }

      throw e;
    }

    this.createdCategory(category);
  });

  apiRouter.delete('/categories/:category_id', function* (next) {
    yield this.category.destroy({
      transaction: this.tx
    });

    this.ok('Deleted');
  });

  apiRouter.post('/categories/:category_id', function* (next) {
    this.category.name = this.request.body.name;

    try {
      yield this.category.save({
        transaction: this.tx
      });
    } catch(e) {
      if(e instanceof Sequelize.ValidationError) {
        this.validationErrorFromSequelizeValidationError(e);
      }

      throw e;
    }

    this.okCategory(this.category);
  });

  return apiRouter.middleware();
};
