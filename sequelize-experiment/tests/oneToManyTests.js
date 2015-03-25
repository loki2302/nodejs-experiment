var Sequelize = require("sequelize");
var Q = require("q");

exports.oneToManyTests = {
  setUp: function(callback) {
    this.sequelize = new Sequelize('database', 'username', 'password', {
      dialect: 'sqlite',
      storage: 'my.db'
    });

    this.Note = this.sequelize.define('Note', {
      content: Sequelize.STRING
    });

    this.Category = this.sequelize.define('Category', {
      name: Sequelize.STRING
    });

    this.Category.hasMany(this.Note);
    this.Note.belongsTo(this.Category);

    this.sequelize.sync().success(function() {
      callback();
    }).error(function(e) {
      throw e;
    });
  },

  tearDown: function(callback) {
    this.sequelize.drop().success(function() {
      callback()
    }).error(function(e) {
      throw e;
    });
  },

  dummy: function(test) {
    var self = this;
    function createCategory(name) {
      var deferred = Q.defer();

      self.Category.create({ name: name }).success(function(category) {
        deferred.resolve(category);
      }).error(function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    }

    function createNote(categoryId, content) {
      var deferred = Q.defer();

      self.Note.create({ content: content, CategoryId: categoryId }).success(function(note) {
        deferred.resolve(note);
      }).error(function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    }

    function getNoteWithCategory(noteId) {
      var deferred = Q.defer();

      var options = { 
        where: { id: noteId }, 
        include: [ self.Category ]
      };
      self.Note.find(options).success(function(note) {
        deferred.resolve(note);
      }).error(function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    }

    createCategory("js")
    .then(function(jsCategory) {
      return createNote(jsCategory.id, "hello");
    })
    .then(function(note) {
      var noteId = note.id;
      return getNoteWithCategory(noteId);
    })
    .then(function(note) {
      test.equal(note.id, 1);
      test.equal(note.content, "hello");
      test.equal(note.CategoryId, 1);
      test.equal(note.Category.id, 1);
      test.equal(note.Category.name, "js");
      test.done();
    });
  }
};
