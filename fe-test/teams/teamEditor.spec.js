describe('tbTeamEditor logic', function() {
  beforeEach(module('tbTeamEditor', 'tbTemplates'));

  var $scope;
  var $compile;
  var $q;
  beforeEach(inject(function($rootScope, _$compile_, _$q_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $q = _$q_;
  }));

  describe('construction', function() {
    it('should throw if submitTitle is not set', function() {
      $compile(
        '<tb-team-editor ' +
        '  busy="busy"' +
        '  team-template="{}">' +
        '</tb-team-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).toThrow();
    });

    it('should throw if teamTemplate is not set', function() {
      $compile(
        '<tb-team-editor ' +
        '  busy="busy"' +
        '  submit-title="Submit">' +
        '</tb-team-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).toThrow();
    });

    it('should not throw if everything is set', function() {
      $compile(
        '<tb-team-editor ' +
        '  busy="busy"' +
        '  submit-title="Submit"' +
        '  team-template="{}">' +
        '</tb-team-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).not.toThrow();
    });

    describe('isolate scope', function() {
      var scope;
      beforeEach(function() {
        var element = $compile(
          '<tb-team-editor ' +
          '  busy="busy"' +
          '  submit-title="Submit"' +
          '  team-template="{}">' +
          '</tb-team-editor>')($scope);
        $scope.$digest();
        scope = element.isolateScope();
      });

      it('should publish the "team" on a scope', function() {
        expect(scope.team).toBeDefined();
      });
    });
  });

  describe('submitTeam', function() {
    var scope;
    var onSubmitDeferred;
    beforeEach(function() {
      onSubmitDeferred = $q.defer();
      $scope.onSubmit = jasmine.createSpy('onSubmit').and.callFake(function() {
        return onSubmitDeferred.promise;
      });
      var element = $compile(
        '<tb-team-editor ' +
        '  on-submit="onSubmit(team)"' +
        '  submit-title="Submit"' +
        '  team-template="{}">' +
        '</tb-team-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.submitTeam).toBeDefined();
    });

    it('should call onSubmit', function() {
      scope.team = { id: 123 };
      scope.submitTeam({ preventDefault: angular.noop });
      expect($scope.onSubmit).toHaveBeenCalledWith({ id: 123 });
    });
  });

  describe('searchPeople', function() {
    var scope;
    var onPersonLookupDeferred;
    beforeEach(function() {
      onPersonLookupDeferred = $q.defer();
      $scope.onPersonLookup = jasmine.createSpy('onPersonLookup').and.callFake(function() {
        return onPersonLookupDeferred.promise;
      });
      var element = $compile(
        '<tb-team-editor ' +
        '  on-person-lookup="onPersonLookup(query)"' +
        '  submit-title="Submit"' +
        '  team-template="{}">' +
        '</tb-team-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.searchPeople).toBeDefined();
    });

    it('should call onPersonLookup', function() {
      scope.searchPeople('a');
      expect($scope.onPersonLookup).toHaveBeenCalled();
    });

    it('should return the result if onPersonLookup succeeds', function() {
      var onSuccess = jasmine.createSpy('onSuccess');
      scope.searchPeople('a').then(onSuccess);
      onPersonLookupDeferred.resolve('hello');
      $scope.$digest();
      expect(onSuccess).toHaveBeenCalledWith('hello');
    });

    it('should return an empty collection if onPersonLookup fails', function() {
      var onSuccess = jasmine.createSpy('onSuccess');
      scope.searchPeople('a').then(onSuccess);
      onPersonLookupDeferred.reject('error');
      $scope.$digest();
      expect(onSuccess).toHaveBeenCalledWith([]);
    });
  });
});
