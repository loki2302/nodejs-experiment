describe('playground', function() {
  it('should work', function() {
    var $injector = angular.injector(['ng', 'api2', function($controllerProvider) {
      $controllerProvider.register('NoteController', ['$scope', 'api', 'errors', function($scope, api, errors) {
        $scope.createNote = function(note) {
          api.createNote(note).then(function(note) {
            console.log('created a note!')
          }, function(error) {
            throw error;
          });
        };
      }]);
    }, function($provide) {
      $provide.factory('$exceptionHandler', function($injector) {        
        return function(exception, cause) {
          var $rootScope = $injector.get('$rootScope');
          $rootScope.lastError = 'error: ' + exception.constructor.name;
        };
      });
    }]);

    var $q = $injector.get('$q');
    var $controller = $injector.get('$controller');
    var errors = $injector.get('errors');

    var $rootScope = $injector.get('$rootScope');
    var $scope = $rootScope.$new();    

    var noteDeferred = $q.defer();
    var api = {
      createNote: function(note) {
        return noteDeferred.promise;
      }
    };

    $controller('NoteController', { 
      $scope: $scope, 
      api: api 
    });
    $scope.createNote();
    
    noteDeferred.reject(new errors.ValidationError());
    $rootScope.$apply();

    expect($rootScope.lastError).toBe('error: ValidationError');
  });
});
