var Sequelize = require('sequelize');
var co = require('co');

module.exports = {
  setUp: function(done) {
    var sequelize = new Sequelize('db', 'user', 'password', {
      dialect: 'sqlite',
      storage: 'my.db'
    });

    var Book = sequelize.define('Book', {
      title: Sequelize.STRING
    });

    var Author = sequelize.define('Author', {
      name: Sequelize.STRING
    });

    var BooksAuthors = sequelize.define('BooksAuthors', {
      isCorrect: Sequelize.BOOLEAN
    });

    Book.hasMany(Author, { through: BooksAuthors });
    Author.hasMany(Book, { through: BooksAuthors });

    this.sequelize = sequelize;
    this.Book = Book;
    this.Author = Author;
    this.BooksAuthors = BooksAuthors;

    sequelize.sync().then(function() {
      done();
    }, function(e) {
      throw e;
    });
  },

  tearDown: function(done) {
    this.sequelize.drop().then(function() {
      done()
    }, function(e) {
      throw e;
    });
  },

  dummy: function(test) {
    var Book = this.Book;
    var Author = this.Author;

    co(function* () {
      var anotherFineMythBook = yield Book.create({
        title: 'Another Fine Myth'
      });

      var robertAsprinPerson = yield Author.create({
        name: 'Robert Asprin'
      });

      yield anotherFineMythBook.addAuthor(robertAsprinPerson, {
        isCorrect: true
      });

      var authors = yield anotherFineMythBook.getAuthors();
      console.log('Authors', authors.length);

      test.done();
    });
  }
};
