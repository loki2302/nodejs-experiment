describe('CategoriesController', function() {
  beforeEach(module('categories'));

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
});
