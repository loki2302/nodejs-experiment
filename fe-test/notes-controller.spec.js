describe('NotesController', function() {
  beforeEach(module('app'));

  it('should publish notes on the scope', inject(function($controller, $rootScope, $q) {
    var notesController = $controller('NotesController', {
      $scope: $rootScope,
      $q: $q,
      notes: [],
      apiService: {}
    });

    expect($rootScope.notes).toBeDefined();
  }));

  it('should be able to create a new note [apiService mock]', inject(function($controller, $rootScope, $q) {
    var createNoteResultDeferred = $q.defer();
    var getNotesResultDeferred = $q.defer();

    var apiService = {
      createNote: function(note) {
        return createNoteResultDeferred.promise;
      },
      getNotes: function() {
        return getNotesResultDeferred.promise;
      }
    };

    var notesController = $controller('NotesController', {
      $scope: $rootScope,
      $q: $q,
      notes: [],
      apiService: apiService
    });

    spyOn(apiService, 'createNote').and.callThrough();
    spyOn(apiService, 'getNotes').and.callThrough();

    $rootScope.createNote({
      content: 'hello there',
      categories: []
    });

    expect(apiService.createNote).toHaveBeenCalled();
    expect(apiService.getNotes).not.toHaveBeenCalled();

    createNoteResultDeferred.resolve({
      id: 123,
      content: 'hello there'
    });

    $rootScope.$apply();

    expect(apiService.getNotes).toHaveBeenCalled();

    getNotesResultDeferred.resolve([{
      id: 123,
      content: 'hello there'
    }]);

    $rootScope.$apply();

    expect($rootScope.notes.length).toBe(1);
  }));
});
