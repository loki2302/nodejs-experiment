describe('playground', function() {
  var $q;
  var $controller;
  var errors;
  var $rootScope;
  var $scope;

  beforeEach(function() {
    var $injector = angular.injector(['ng', 'api2', function($controllerProvider) {
      $controllerProvider.register('NoteController', ['$scope', 'api', 'errors', function($scope, api, errors) {
        $scope.createNote = function(note) {
          api.createNote(note).then(function(note) {
            $scope.note = note;
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

    $q = $injector.get('$q');
    $controller = $injector.get('$controller');
    errors = $injector.get('errors');

    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();    
  });

  it('should set $scope.note to note created by API', function() {
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
    
    noteDeferred.resolve({content: 'hello'});
    $rootScope.$apply();

    expect($rootScope.lastError).not.toBeDefined();
    expect($scope.note).toBeDefined();
    expect($scope.note.content).toBe('hello');
  });

  it('should set $rootScope.lastError to error returned by API', function() {
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
    expect($scope.note).not.toBeDefined();
  });
});
