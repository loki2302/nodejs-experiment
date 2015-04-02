describe('tbNewPersonEditor', function() {
  beforeEach(module('tbNewPersonEditor', 'tbTemplates'));

  var $scope;
  beforeEach(inject(function($rootScope, $compile, $templateCache) {
    $scope = $rootScope.$new();

    console.log($templateCache.info());
    console.log($templateCache.get('index.html')); // OK
    console.log($templateCache.get('people/personList.html')); // OK
    console.log($templateCache.get('people/newPersonEditor.html')); // OK

    $compile(
      '<tb-new-person-editor on-create="createPerson(person)" busy="busy">' +
      '</tb-new-person-editor>')($scope);
  }));

  it('should work', function() {
    $scope.createPerson = jasmine.createSpy('createPerson');
    $scope.$digest();

  });
});
