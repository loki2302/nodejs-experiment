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
});
