require('co-mocha');

var expect = require('chai').expect;
var PouchDB = require('pouchdb');

describe('PouchDB', function() {
  var db;
  beforeEach(function* () {
    db = new PouchDB('notes');
    yield db.destroy();    
    db = new PouchDB('notes');
  });

  it('should let me save and read a document', function* () {
    var note = yield db.post({
      text: 'hello there'
    });
    expect(note.id).to.be.ok;
    expect(note.text).to.be.undefined;

    var readNote = yield db.get(note.id);
    expect(readNote._id).to.equal(note.id);
    expect(readNote.text).to.equal('hello there');
  });

  it('should let me save and read multiple documents', function* () {
    var note1 = yield db.post({ text: 'hello 1' });
    var note2 = yield db.post({ text: 'hello 2' });
    var note3 = yield db.post({ text: 'hello 3' });

    var notes = yield db.allDocs({ include_docs: true });
    expect(notes.total_rows).to.equal(3);
    expect(notes.offset).to.equal(0);
    expect(notes.rows.length).to.equal(3);

    expect(notes.rows[0].doc.text).to.contain('hello ');
  });
});
