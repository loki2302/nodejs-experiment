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

  omg: {
    setUp: function(done) {
      var Book = this.Book;
      var Author = this.Author;

      var self = this;
      co(function* () {
        self.anotherFineMythBook = yield Book.create({
          title: 'Another Fine Myth'
        });

        self.robertAsprinPerson = yield Author.create({
          name: 'Robert Asprin'
        });

        done();
      });
    },

    'Can add author to book': function(test) {
      var anotherFineMythBook = this.anotherFineMythBook;
      var robertAsprinPerson = this.robertAsprinPerson;

      co(function* () {
        yield anotherFineMythBook.addAuthor(robertAsprinPerson, {
          isCorrect: true
        });

        var authors = yield anotherFineMythBook.getAuthors();
        test.equals(authors.length, 1);

        var books = yield robertAsprinPerson.getBooks();
        test.equals(books.length, 1);

        test.done();
      });
    },

    'Can add book to author': function(test) {
      var anotherFineMythBook = this.anotherFineMythBook;
      var robertAsprinPerson = this.robertAsprinPerson;

      co(function* () {
        yield robertAsprinPerson.addBook(anotherFineMythBook, {
          isCorrect: true
        });

        var authors = yield anotherFineMythBook.getAuthors();
        test.equals(authors.length, 1);

        var books = yield robertAsprinPerson.getBooks();
        test.equals(books.length, 1);

        test.done();
      });
    }
  }
};
