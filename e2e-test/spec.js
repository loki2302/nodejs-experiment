var enableDestroy = require('server-destroy');
var makeModels = require("../be-src/models.js");
var makeApp = require("../be-src/app.js");

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
    beforeEach(function() {
      browser.get('/');
    });

    it('should have page title set to nodejs-app-experiment', function() {      
      expect(browser.getTitle()).toEqual('nodejs-app-experiment');
    });

    it('should display "there are no notes" message', function() {
      expect(element(by.css('#no-notes-alert')).isPresent()).toBe(true);
      expect(element(by.css('#no-notes-alert')).getText()).toEqual('There are no notes so far.');
    });

    it('should not display a list of notes', function() {
      expect(element(by.css('#note-list')).isPresent()).toBe(false);
    });

    it('should have a new note editor', function() {
      expect(element(by.css('#new-note-editor')).isPresent()).toBe(true);
    });

    it('should let me create a note', function() {
      expect(element(by.css('#new-note-editor #content')).isPresent()).toBe(true);
      element(by.css('#new-note-editor #content')).sendKeys('hello there');

      expect(element(by.css('#new-note-editor button')).isPresent()).toBe(true);
      element(by.css('#new-note-editor button')).click();

      expect(element(by.css('#no-notes-alert')).isPresent()).toBe(false);
      expect(element(by.css('#note-list')).isPresent()).toBe(true);
      expect(element(by.css('#note-list li .note-id')).isPresent()).toBe(true);
      expect(element(by.css('#note-list li .note-id')).getText()).toBe('1');
      expect(element(by.css('#note-list li .note-content')).isPresent()).toBe(true);
      expect(element(by.css('#note-list li .note-content')).getText()).toBe('hello there');
    });
  });
});
