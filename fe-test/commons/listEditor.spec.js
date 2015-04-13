describe('tbListEditor', function() {
  beforeEach(module('tbListEditor'));

  var $compile;
  var $scope;
  beforeEach(inject(function(_$compile_, $rootScope) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
  }));

  describe('construction', function() {
    it('should throw if "for" is not specified', function() {
      expect(function() {
        $compile('<tb-list-editor as="e"></tb-list-editor>')($scope);
      }).toThrow();
    });

    it('should throw if "as" is not specified', function() {
      expect(function() {
        $compile('<tb-list-editor for="c"></tb-list-editor>')($scope);
      }).toThrow();
    });

    it('should not throw if both "for" and "as" are specified', function() {
      expect(function() {
        $compile('<tb-list-editor for="c" as="e"></tb-list-editor>')($scope);
      }).not.toThrow();
    });
  });

  describe('visibility', function() {
    var innerScope;
    beforeEach(function() {
      $compile('<tb-list-editor for="c" as="e"></tb-list-editor>')($scope);
      innerScope = $scope.$$childTail;
    });

    it('should not be visible on the outer scope', function() {
      expect($scope.e).not.toBeDefined();
    });

    it('should be visible on the inner scope', function() {
      expect(innerScope.e).toBeDefined();
    });

    it('should create an inner scope that inherits an outer scope', function() {
      $scope.message = 'hello';
      expect(innerScope.message).toBe('hello');
    });
  });

  describe('API', function() {
    var innerScope;
    beforeEach(function() {
      $compile('<tb-list-editor for="c" as="e"></tb-list-editor>')($scope);
      innerScope = $scope.$$childTail;
    });

    describe('removeItem', function() {
      it('should be published', function() {
        expect(innerScope.e.removeItem).toBeDefined();
      });

      it('should throw if item does not belong to the collection', function() {
        $scope.c = [1, 2, 3];

        expect(function() {
          innerScope.removeItem(111);
        }).toThrow();
      });

      it('should remove the item if it belongs to the collection', function() {
        $scope.c = [1, 2, 3];

        innerScope.e.removeItem(2);
        expect($scope.c).toEqual([1, 3]);
      });
    });

    describe('newItem', function() {
      it('should be published', function() {
        expect(innerScope.e.newItem).toBeDefined();
      });

      it('should be an empty object', function() {
        expect(innerScope.e.newItem).toEqual({});
      });
    });

    describe('addItem', function() {
      it('should be published', function() {
        expect(innerScope.e.addItem).toBeDefined();
      });

      it('should push a newItem to the target collection', function() {
        $scope.c = [];
        innerScope.e.newItem = 111;
        innerScope.e.addItem();
        expect($scope.c).toEqual([111]);
      });

      it('should reset a newItem', function() {
        $scope.c = [];
        innerScope.e.newItem = 111;
        innerScope.e.addItem();
        expect(innerScope.e.newItem).toEqual({});
      });
    });
  });
});
