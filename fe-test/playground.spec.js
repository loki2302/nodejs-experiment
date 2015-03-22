describe('playground', function() {
  describe('inline editor', function() {
    beforeEach(module(function($compileProvider) {
      $compileProvider.directive('noteItem', function() {
        return {
          restrict: 'E',
          template: '<div>hello</div>'
        }
      });
    }));

    it('should work', inject(function($compile, $rootScope) {
      var element = $compile('<note-item></note-item>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toBe('hello');
    }));
  });
});
