describe('NotesController', function() {
  beforeEach(module('app'));

  it('should publish notes on the scope', inject(function($controller, $rootScope, $q) {
    var $scope = $rootScope.$new();

    var notesController = $controller('NotesController', {
      $scope: $scope,
      $q: $q,
      notes: [],
      apiService: {}
    });

    expect($scope.notes).toBeDefined();
  }));

  describe('create note functionality', function() {
    var createNoteResultDeferred;
    var getNotesResultDeferred;
    var apiService;

    beforeEach(inject(function($controller, $rootScope, $q) {
      createNoteResultDeferred = $q.defer();
      getNotesResultDeferred = $q.defer();

      apiService = {
        createNote: function(note) {
          return createNoteResultDeferred.promise;
        },
        getNotes: function() {
          return getNotesResultDeferred.promise;
        }
      };

      $controller('NotesController', {
        $scope: $rootScope,
        $q: $q,
        notes: [],
        apiService: apiService
      });

      spyOn(apiService, 'createNote').and.callThrough();
      spyOn(apiService, 'getNotes').and.callThrough();
    }));

    it('should call apiService.createNote() when new note is submitted', inject(function($rootScope) {
      $rootScope.createNote({
        content: 'hello there',
        categories: []
      });

      expect(apiService.createNote).toHaveBeenCalled();
    }));

    it('should wait for apiService.createNote() to finish before loading an updated list of notes', inject(function($rootScope) {
      $rootScope.createNote({
        content: 'hello there',
        categories: []
      });

      expect(apiService.getNotes).not.toHaveBeenCalled();      

      $rootScope.$apply(function() {
        createNoteResultDeferred.resolve({
          id: 123,
          content: 'hello there',
          categories: []
        });
      });

      expect(apiService.getNotes).toHaveBeenCalled();
    }));

    it('should publish an updated list of notes on the scope', inject(function($rootScope) {
      $rootScope.createNote({
        content: 'hello there',
        categories: []
      });

      $rootScope.$apply(function() {
        createNoteResultDeferred.resolve({
          id: 123,
          content: 'hello there',
          categories: []
        });
      });

      $rootScope.$apply(function() {
        getNotesResultDeferred.resolve([{
          id: 123,
          content: 'hello there',
          categories: []
        }]);
      });

      expect($rootScope.notes.length).toBe(1);
    }));    
  });
});
