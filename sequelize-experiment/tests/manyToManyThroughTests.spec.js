var expect = require('chai').expect;

var Sequelize = require('sequelize');
var co = require('co');

describe('Many to many through', function() {
  var sequelize;
  var Book;
  var Author;
  var BooksAuthors;
  beforeEach(function(done) {
    sequelize = new Sequelize('sqlite://my.db');

    Book = sequelize.define('Book', {
      title: Sequelize.STRING
    });

    Author = sequelize.define('Author', {
      name: Sequelize.STRING
    });

    BooksAuthors = sequelize.define('BooksAuthors', {
      isCorrect: Sequelize.BOOLEAN
    });

    Book.hasMany(Author, { through: BooksAuthors });
    Author.hasMany(Book, { through: BooksAuthors });

    co(function* () {
      yield sequelize.sync();
    }).then(done, done);
  });

  describe('omg', function() {
    var anotherFineMythBook;
    var robertAsprinPerson;
    beforeEach(function(done) {
      co(function* () {
        anotherFineMythBook = yield Book.create({
          title: 'Another Fine Myth'
        });

        robertAsprinPerson = yield Author.create({
          name: 'Robert Asprin'
        });
      }).then(done, done);
    });

    it('should let me add author to book', function(done) {
      co(function* () {
        yield anotherFineMythBook.addAuthor(robertAsprinPerson, {
          isCorrect: true
        });
      }).then(done, done);
    });

    it('should let me add book to author', function(done) {
      co(function* () {
        yield robertAsprinPerson.addBook(anotherFineMythBook, {
          isCorrect: true
        });
      }).then(done, done);
    });

    afterEach(function(done) {
      co(function* () {
        var authors = yield anotherFineMythBook.getAuthors();
        expect(authors.length).to.equal(1);

        var books = yield robertAsprinPerson.getBooks();
        expect(books.length).to.equal(1);
      }).then(done, done);
    });
  });

  afterEach(function(done) {
    co(function* () {
      yield sequelize.drop();
    }).then(done, done);
  });
});
