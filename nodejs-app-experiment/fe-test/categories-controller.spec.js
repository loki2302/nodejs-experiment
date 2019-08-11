describe('CategoriesController', function() {
  beforeEach(module('categories', function(apiServiceProvider) {
    apiServiceProvider.apiRoot('/api/');
  }));

  beforeEach(inject(function($controller, $rootScope, $q, apiService) {
    $controller('CategoriesController', {
      $scope: $rootScope,
      $q: $q,
      categories: [],
      apiService: apiService
    });
  }));

  it('should publish categories on the scope', inject(function($rootScope) {
    expect($rootScope.categories).toBeDefined();
  }));

  describe('createCategory()', function() {
    var createCategoryResultDeferred;

    beforeEach(inject(function($rootScope, $q, apiService) {
      createCategoryResultDeferred = $q.defer();
      spyOn(apiService, 'createCategory').and.returnValue(createCategoryResultDeferred.promise);
      spyOn($rootScope, 'reloadCategories');

      $rootScope.createCategory({
        name: 'hello there'
      });
    }));

    it('should call apiService.createCategory()', inject(function(apiService) {
      expect(apiService.createCategory).toHaveBeenCalled();
    }));
  });
});
