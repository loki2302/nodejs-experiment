require('co-mocha');

var expect = require('chai').expect;

var Sequelize = require('sequelize');

describe('Many to many through', function() {
  var sequelize;
  var Book;
  var Author;
  var BooksAuthors;
  beforeEach(function* () {
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

    yield sequelize.sync();
  });

  describe('omg', function() {
    var anotherFineMythBook;
    var robertAsprinPerson;
    beforeEach(function* () {
      anotherFineMythBook = yield Book.create({
        title: 'Another Fine Myth'
      });

      robertAsprinPerson = yield Author.create({
        name: 'Robert Asprin'
      });
    });

    it('should let me add author to book', function* () {
      yield anotherFineMythBook.addAuthor(robertAsprinPerson, {
        isCorrect: true
      });
    });

    it('should let me add book to author', function* () {
      yield robertAsprinPerson.addBook(anotherFineMythBook, {
        isCorrect: true
      });
    });

    afterEach(function* () {
      var authors = yield anotherFineMythBook.getAuthors();
      expect(authors.length).to.equal(1);

      var books = yield robertAsprinPerson.getBooks();
      expect(books.length).to.equal(1);
    });
  });

  afterEach(function* () {
    yield sequelize.drop();
  });
});
