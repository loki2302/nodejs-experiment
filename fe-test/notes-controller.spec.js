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

    var apiService = {
      createNote: function(note) {
        return createNoteResultDeferred.promise;
      },
      getNotes: function() {
        return [{
          id: 123,
          content: 'hello there'
        }];
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
    expect(apiService.createNote.calls.count()).toBe(1);
    expect(apiService.getNotes.calls.count()).toBe(1);

    $rootScope.$apply();

    expect($rootScope.notes.length).toBe(1);
  }));

  it('should be able to create a new note [$httpBackend mock]', inject(function($controller, $rootScope, $q, $httpBackend, apiService) {
    var notesController = $controller('NotesController', {
      $scope: $rootScope,
      $q: $q,
      notes: [],
      apiService: apiService
    });

    $httpBackend.expect('POST', '/api/notes')
    .respond(201, {
      id: 123,
      content: 'hello there'
    });

    $httpBackend.expect('GET', '/api/notes')
    .respond(200, [{
      id: 123,
      content: 'hello there'
    }]);

    $rootScope.createNote({
      content: 'hello there',
      categories: []
    });    

    $httpBackend.flush();    

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();

    expect($rootScope.notes.length).toBe(1);
  }));
});
