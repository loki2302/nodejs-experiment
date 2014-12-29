var koa = require('koa');
var bodyParser = require('koa-body-parser');
var router = require('koa-router');
var Q = require('q');
var Sequelize = require('sequelize');
var co = require('co');

module.exports = function() {
  var sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'my.db'
  });

  var Note = sequelize.define('Note', {
    content: Sequelize.STRING
  });

  var app = koa();
  app.use(bodyParser());
  app.use(function* (next) {
    this.Note = Note;
    
    this.throwNoteNotFound = function() {
      this.status = 404;
      this.body = "Note not found";
    };

    yield next;
  });

  app.use(function* (next) {
    var tx = yield sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    });

    this.tx = tx;
    
    try {
      yield next;

      try {
        yield tx.commit();
        console.log("operation succeeded, commit succeeded");
      } catch(commitException) {
        console.log("operation succeeded, commit failed: %s", commitException);
      }
    } catch(operationException) {
      try {
        yield tx.rollback();
        console.log("operation failed, rollback succeeded");
      } catch(rollbackException) {
        console.log("operation failed, rollback failed: %s", rollbackException);
      }
    }
  });
  
  app.use(router(app));

  app.param("note", function* (noteId, next) {
    var note = yield this.Note.find({ 
      where: { id: noteId }
    }, { 
      transaction: this.tx
    });
    if(!note) {
      this.throwNoteNotFound();
      return;
    }

    this.note = note;
    yield next;
  });

  app.get('/notes', function* (next) {
    this.body = yield this.Note.findAll({
      transaction: this.tx
    });
  });

  app.post('/notes', function* (next) {   
    this.body = yield this.Note.create({
      content: this.request.body.content
    }, {
      transaction: this.tx
    });
  });

  app.get('/notes/:note', function* (next) {
    this.body = this.note;
  });

  app.delete('/notes/:note', function* (next) {
    yield this.note.destroy({
      transaction: this.tx
    });

    this.body = { 'message': 'ok' };
  });

  app.put('/notes/:note', function* (next) {
    this.note.content = this.request.body.content;
    yield this.note.save({
      transaction: this.tx
    });

    this.body = { 'message': 'ok' };
  });

  return co(function* () {
    yield sequelize.drop();
    yield sequelize.sync();
    return Q.Promise(function(resolve) {
      server = app.listen(3000, function() {
        resolve(server);
      });
    });
  });
};
