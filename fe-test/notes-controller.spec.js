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

  describe('createNote()', function() {
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

    describe('when apiService.createNote() finishes', function() {
      beforeEach(inject(function($rootScope) {
        $rootScope.createNote({
          content: 'hello there',
          categories: []
        });

        expect(apiService.getNotes).not.toHaveBeenCalled();
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

        it('should request an updated list of notes', function() {
          expect(apiService.getNotes).toHaveBeenCalled();
        });

        describe('when updated list of notes is available', function() {
          it('should publish those notes on the scope', inject(function($rootScope) {
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

      describe('with error', function() {
        describe('when error is ValidationError', function() {
          it('should not rethrow it', inject(function($rootScope, errors, $exceptionHandler) {
            $rootScope.$apply(function() {
              createNoteResultDeferred.reject(new errors.ValidationError());
            });

            console.log($exceptionHandler.errors);
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
