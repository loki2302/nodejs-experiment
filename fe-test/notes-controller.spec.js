describe('NotesController', function() {
  beforeEach(module('notes'));
  beforeEach(module(function($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

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

  describe('reloadNotes()', function() {
    var getNotesResultDeferred;
    var apiService;

    beforeEach(inject(function($controller, $rootScope, $q) {
      getNotesResultDeferred = $q.defer();

      apiService = {
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

      spyOn(apiService, 'getNotes').and.callThrough();

      $rootScope.reloadNotes();
    }));

    it('should call apiService.getNotes()', inject(function($rootScope) {
      expect(apiService.getNotes).toHaveBeenCalled();
    }));

    describe('when the call to apiService.getNotes() succeeds', function() {
      beforeEach(inject(function($rootScope) {
        $rootScope.$apply(function() {
          getNotesResultDeferred.resolve([{
            id: 123,
            content: 'hello there',
            categories: []
          }]);
        });
      }));

      it('should update the list of notes', inject(function($rootScope) {
        expect($rootScope.notes.length).toBe(1);
      }));
    });

    describe('when call fails', function() {
      beforeEach(inject(function($rootScope, errors) {
        $rootScope.$apply(function() {
          getNotesResultDeferred.reject(new errors.UnexpectedError());
        });
      }));

      it('should throw', inject(function($exceptionHandler, errors) {
        expect($exceptionHandler.errors.length).toBe(1);
        expect($exceptionHandler.errors[0].constructor).toBe(errors.UnexpectedError);
      }));
    });
  });

  describe('createNote()', function() {
    var createNoteResultDeferred;
    var apiService;

    beforeEach(inject(function($controller, $rootScope, $q) {
      createNoteResultDeferred = $q.defer();

      apiService = {
        createNote: function(note) {
          return createNoteResultDeferred.promise;
        }
      };

      $controller('NotesController', {
        $scope: $rootScope,
        $q: $q,
        notes: [],
        apiService: apiService
      });

      spyOn(apiService, 'createNote').and.callThrough();

      spyOn($rootScope, 'reloadNotes')
    }));

    it('should call apiService.createNote() when new note is submitted', inject(function($rootScope) {
      $rootScope.createNote({
        content: 'hello there',
        categories: []
      });

      expect(apiService.createNote).toHaveBeenCalled();
    }));

    describe('when apiService.createNote() finishes', function() {
      beforeEach(inject(function($rootScope) {
        $rootScope.createNote({
          content: 'hello there',
          categories: []
        });
      }));

      describe('successfully', function() {
        beforeEach(inject(function($rootScope) {
          $rootScope.$apply(function() {
            createNoteResultDeferred.resolve({
              id: 123,
              content: 'hello there',
              categories: []
            });
          });
        }));

        it('should request an updated list of notes', inject(function($rootScope) {
          expect($rootScope.reloadNotes).toHaveBeenCalled();
        }));
      });

      describe('with error', function() {
        describe('when error is ValidationError', function() {
          it('should not rethrow it', inject(function($rootScope, errors, $exceptionHandler) {
            $rootScope.$apply(function() {
              createNoteResultDeferred.reject(new errors.ValidationError());
            });

            expect($exceptionHandler.errors.length).toBe(0);
          }));
        });

        describe('when error is UnexpectedError', function() {
          it('should rethrow it', inject(function($rootScope, errors, $exceptionHandler) {
            $rootScope.$apply(function() {
              createNoteResultDeferred.reject(new errors.UnexpectedError());
            });

            expect($exceptionHandler.errors.length).toBe(1);
            expect($exceptionHandler.errors[0].constructor).toBe(errors.UnexpectedError);
          }));
        });
      });
    });
  });
});
