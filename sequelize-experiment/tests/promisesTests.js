var Sequelize = require('sequelize');
var co = require('co');

exports.promisesTests = {
  setUp: function(callback) {
    var sequelize = new Sequelize('database', 'username', 'password', {
      dialect: 'sqlite',
      storage: 'my.db'
    });
    this.sequelize = sequelize;

    this.Note = this.sequelize.define('Note', {
      content: Sequelize.STRING
    });

    co(function* () {
      yield sequelize.sync();
    }).then(callback, function(e) {
      throw e;
    });
  },

  tearDown: function(callback) {
    var sequelize = this.sequelize;
    co(function* () {
      yield sequelize.drop();
    }).then(callback, function(e) {
      throw e;
    });
  },

  dummy: function(test) {
    var sequelize = this.sequelize;
    var Note = this.Note;

    co(function* () {
      var noteCount = yield Note.count();
      test.equals(noteCount, 0);

      var note = yield Note.create({ content: 'hi there' });
      test.equals(note.id, 1);

      noteCount = yield Note.count();
      test.equals(noteCount, 1);

      var allNotes = yield Note.all();
      test.equals(allNotes.length, 1);
      test.equals(allNotes[0].id, 1);
      test.equals(allNotes[0].content, 'hi there');

      test.done();
    });
  }
};
