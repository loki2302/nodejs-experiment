var enableDestroy = require('server-destroy');
var makeModels = require("../be-src/models.js");
var makeApp = require("../be-src/app.js");

var NotesPage = function() {
  this.getTitle = function() { return browser.getTitle(); };
  
  this.noNotesAlert = element(by.css('#no-notes-alert'));
  
  this.noteList = element(by.css('#note-list'));
  this.noteListNoteIdByNoteIndex = function(index) { return element(by.css('#note-list li.note-' + index + ' .note-id')); }
  this.noteListNoteContentByNoteIndex = function(index) { return element(by.css('#note-list li.note-' + index + ' .note-content')); }
  
  this.newNoteEditor = element(by.css('#new-note-editor'));
  this.newNoteEditorContent = element(by.css('#new-note-editor #content'));
  this.newNoteEditorSubmit = element(by.css('#new-note-editor button'));  
};

describe('app', function() {
  var server;
  beforeEach(function(done) {
    var models = makeModels();
    models.reset(function(error) {
      if(error) {
        throw new Error("Failed to reset database");
      }

      var app = makeApp(models, {
        // no synth delays for tests
      });
      server = app.listen(3000, function() {
        enableDestroy(server);
        done();
      });
    });
  });

  afterEach(function(done) {
    server.destroy(function() {
      done();
    });
  });

  describe('by default', function() {
    var notesPage;

    beforeEach(function() {
      browser.get('/');
      notesPage = new NotesPage();
    });

    it('should have page title set to nodejs-app-experiment', function() {
      expect(notesPage.getTitle()).toBe('nodejs-app-experiment');
    });

    it('should display "there are no notes" message', function() {
      expect(notesPage.noNotesAlert.isPresent()).toBe(true);
      expect(notesPage.noNotesAlert.getText()).toBe('There are no notes so far.');
    });

    it('should not display a list of notes', function() {
      expect(notesPage.noteList.isPresent()).toBe(false);
    });

    it('should have a new note editor', function() {
      expect(notesPage.newNoteEditor.isPresent()).toBe(true);
    });

    it('should let me create a note', function() {      
      expect(notesPage.newNoteEditorContent.isPresent()).toBe(true);
      notesPage.newNoteEditorContent.sendKeys('hello there');

      expect(notesPage.newNoteEditorSubmit.isPresent()).toBe(true);
      notesPage.newNoteEditorSubmit.click();

      expect(notesPage.noNotesAlert.isPresent()).toBe(false);
      expect(notesPage.noteList.isPresent()).toBe(true);
      expect(notesPage.noteListNoteIdByNoteIndex(0).isPresent()).toBe(true);
      expect(notesPage.noteListNoteIdByNoteIndex(0).getText()).toBe('1');
      expect(notesPage.noteListNoteContentByNoteIndex(0).isPresent()).toBe(true);
      expect(notesPage.noteListNoteContentByNoteIndex(0).getText()).toBe('hello there');
    });
  });
});
