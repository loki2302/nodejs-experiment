var AppRunner = require('../be-src/apprunner.js');

var AppNavbar = function() {
  this.notesItem = element(by.css('.nav-notes'));
  this.categoriesItem = element(by.css('.nav-categories'));
};

var App = function() {
  this.getTitle = function() { return browser.getTitle(); };
};

var NotesPage = function() { 
  this.noNotesAlert = element(by.css('#no-notes-alert'));
  
  this.noteList = element(by.css('#note-list'));
  this.noteListNoteIdByNoteIndex = function(index) { return element(by.css('#note-list li.note-' + index + ' .note-id')); }
  this.noteListNoteContentByNoteIndex = function(index) { return element(by.css('#note-list li.note-' + index + ' .note-content')); }
  
  this.newNoteEditor = element(by.css('#new-note-editor'));
  this.newNoteEditorContent = element(by.css('#new-note-editor #content'));
  this.newNoteEditorSubmit = element(by.css('#new-note-editor button'));
};

var CategoriesPage = function() {
  this.noCategoriesAlert = element(by.css('#no-categories-alert'));

  this.categoryList = element(by.css('#category-list'));
  this.categoryListCategoryIdByCategoryIndex = function(index) { return element(by.css('#category-list li.category-' + index + ' .category-id')); }
  this.categoryListCategoryNameByCategoryIndex = function(index) { return element(by.css('#category-list li.category-' + index + ' .category-name')); }
  
  this.newCategoryEditor = element(by.css('#new-category-editor'));
  this.newCategoryEditorName = element(by.css('#new-category-editor #name'));
  this.newCategoryEditorSubmit = element(by.css('#new-category-editor button'));
};

describe('app', function() {
  var appRunner;
  beforeEach(function(done) {
    appRunner = new AppRunner();
    appRunner.start().then(function() {
      return appRunner.reset().finally(done);
    });    
  });

  afterEach(function(done) {
    appRunner.stop().finally(done);
  });

  describe('App', function() {
    describe('defaults', function() {
      var appPage;
      beforeEach(function() {
        browser.get('/');
        app = new App();
      });

      it('should have a title set to nodejs-app-experiment', function() {
        expect(app.getTitle()).toBe('nodejs-app-experiment');
      });

      it('should open Notes page by default', function() {
        // WTF '/notes' is an absolute URL?
        expect(browser.getLocationAbsUrl()).toBe('/notes');
      });
    });

    describe('navbar', function() {
      var appNavbar;
      beforeEach(function() {
        appNavbar = new AppNavbar()
      });

      it('should hightlight Notes when Notes page is active', function() {
        browser.get('/notes');
        expect(appNavbar.notesItem.getAttribute('class')).toContain('active');
        expect(appNavbar.categoriesItem.getAttribute('class')).not.toContain('active');
      });

      it('should hightlight Categories when Categories page is active', function() {
        browser.get('/categories');
        expect(appNavbar.notesItem.getAttribute('class')).not.toContain('active');
        expect(appNavbar.categoriesItem.getAttribute('class')).toContain('active');
      });

      it('should switch from notes to categories, when notes page is active and one clicks categories', function() {
        browser.get('/notes');
        appNavbar.categoriesItem.$('a').click(); // Chrome doesn't need xxx.$('a'), while FireFox does
        expect(browser.getLocationAbsUrl()).toBe('/categories');
      });

      it('should switch from categories to notes, when categories page is active and one clicks notes', function() {
        browser.get('/categories');
        appNavbar.notesItem.$('a').click(); // Chrome doesn't need xxx.$('a'), while FireFox does
        expect(browser.getLocationAbsUrl()).toBe('/notes');
      });
    });    
  });

  describe('Notes page', function() {
    var notesPage;
    beforeEach(function() {
      browser.get('/notes');
      notesPage = new NotesPage();
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

  describe('Categories page', function() {
    var categoriesPage;
    beforeEach(function() {
      browser.get('/categories');
      categoriesPage = new CategoriesPage();
    });

    it('should display "there are no categories" message', function() {
      expect(categoriesPage.noCategoriesAlert.isPresent()).toBe(true);
      expect(categoriesPage.noCategoriesAlert.getText()).toBe('There are no categories so far.');
    });

    it('should not display a list of categories', function() {
      expect(categoriesPage.categoryList.isPresent()).toBe(false);
    });

    it('should have a new category editor', function() {
      expect(categoriesPage.newCategoryEditor.isPresent()).toBe(true);
    });

    it('should let me create a category', function() {      
      expect(categoriesPage.newCategoryEditorName.isPresent()).toBe(true);
      categoriesPage.newCategoryEditorName.sendKeys('hello');

      expect(categoriesPage.newCategoryEditorSubmit.isPresent()).toBe(true);
      categoriesPage.newCategoryEditorSubmit.click();

      expect(categoriesPage.noCategoriesAlert.isPresent()).toBe(false);
      expect(categoriesPage.categoryList.isPresent()).toBe(true);
      expect(categoriesPage.categoryListCategoryIdByCategoryIndex(0).isPresent()).toBe(true);
      expect(categoriesPage.categoryListCategoryIdByCategoryIndex(0).getText()).toBe('1');
      expect(categoriesPage.categoryListCategoryNameByCategoryIndex(0).isPresent()).toBe(true);
      expect(categoriesPage.categoryListCategoryNameByCategoryIndex(0).getText()).toBe('hello');
    });

    // TODO: should let me edit category
    // TODO: should let me start editing category and then cancel it
    // TODO: should let me delete a category
  });
});
