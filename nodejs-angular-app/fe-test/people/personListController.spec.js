describe('PersonList', function() {
  beforeEach(module('tbPersonList', 'tbApiService', function(apiServiceProvider) {
    apiServiceProvider.apiRoot('/api');
  }));

  describe('PersonListController', function() {
    var $scope;
    var apiServiceDeletePersonDeferred;
    beforeEach(inject(function($controller, $rootScope, $q, execute, apiService) {
      $scope = $rootScope.$new();
      $controller('PersonListController', {
        $scope: $scope,
        people: [
          { id: 1, name: 'person 1' },
          { id: 2, name: 'person 2' }
        ],
        execute: execute,
        apiService: apiService
      });

      apiServiceDeletePersonDeferred = $q.defer();
      spyOn(apiService, 'deletePerson').and.callFake(function(person) {
        return apiServiceDeletePersonDeferred.promise;
      });
    }));

    it('should publish a collection of people', function() {
      expect($scope.people).toBeDefined();
    });

    it('should publish a deletePerson', function() {
      expect($scope.deletePerson).toBeDefined();
    });

    describe('deletePerson()', function() {
      it('should throw an error when it fails to update $scope.people', function() {
        apiServiceDeletePersonDeferred.resolve();
        $scope.deletePerson({ id: 3, name: 'person 3' });
        expect(function() {
          $scope.$digest();
        }).toThrow();
      });

      it('should throw an error when apiService.deletePerson() fails', function() {
        apiServiceDeletePersonDeferred.reject(new Error());
        $scope.deletePerson({ id: 3, name: 'person 3' });
        expect(function() {
          $scope.$digest();
        }).toThrow();
      });

      it('should remove the person from $scope.people when apiService.deletePerson() succeeds', function() {
        apiServiceDeletePersonDeferred.resolve();
        $scope.deletePerson($scope.people[1]);
        $scope.$digest();
        expect($scope.people.length).toBe(1);
        expect($scope.people[0].id).toBe(1);
      });
    });
  });

  it('should register at /people', inject(function($route) {
    var route = $route.routes['/people'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('PersonListController');
    expect(route.templateUrl).toBe('people/personList.html');
    expect(route.resolve.people).toBeDefined();
  }));
});
