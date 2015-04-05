describe('PersonList', function() {
  beforeEach(module('tbPersonList'));

  describe('PersonListController', function() {
    var scope;
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      $controller('PersonListController', {
        $scope: scope,
        people: 'test data'
      });
    }));

    it('should publish a collection of people', function() {
      expect(scope.people).toBeDefined();
    });
  });

  it('should register at /people', inject(function($route) {
    var route = $route.routes['/people'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('PersonListController');
  }));

  describe('routing', function() {
    beforeEach(module('tbApiService', function(apiServiceProvider) {
      apiServiceProvider.apiRoot('/api');
    }));

    var $rootScope;
    var onRouteChangeSuccess;
    var onRouteChangeError;
    var apiServiceGetPeopleDeferred;
    beforeEach(inject(function(_$rootScope_, $location, $q, apiService, $route) {
      $rootScope = _$rootScope_;

      onRouteChangeSuccess = jasmine.createSpy('onRouteChangeSuccess');
      onRouteChangeError = jasmine.createSpy('onRouteChangeError');

      $rootScope.$on('$routeChangeSuccess', onRouteChangeSuccess);
      $rootScope.$on('$routeChangeError', onRouteChangeError);

      apiServiceGetPeopleDeferred = $q.defer();
      spyOn(apiService, 'getPeople').and.callFake(function() {
        return apiServiceGetPeopleDeferred.promise;
      });

      $location.path('/people');
    }));

    it('should load successfully when apiService.getPeople() does not fail', function() {
      apiServiceGetPeopleDeferred.resolve([]);
      $rootScope.$digest();
      expect(onRouteChangeSuccess).toHaveBeenCalled();
    });

    it('should not load when apiService.getPeople() fails', function() {
      apiServiceGetPeopleDeferred.reject(new Error('no data'));
      $rootScope.$digest();
      expect(onRouteChangeError).toHaveBeenCalled();
    });
  });
});
