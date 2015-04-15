describe('tbPersonEditor logic', function() {
  beforeEach(module('tbPersonEditor', 'tbTemplates'));

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
        '<tb-person-editor ' +
        '  busy="busy"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).toThrow();
    });

    it('should throw if personTemplate is not set', function() {
      $compile(
        '<tb-person-editor ' +
        '  busy="busy"' +
        '  submit-title="Submit">' +
        '</tb-person-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).toThrow();
    });

    it('should not throw if everything is set', function() {
      $compile(
        '<tb-person-editor ' +
        '  busy="busy"' +
        '  submit-title="Submit"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).not.toThrow();
    });

    describe('isolate scope', function() {
      var scope;
      beforeEach(function() {
        var element = $compile(
          '<tb-person-editor ' +
          '  busy="busy"' +
          '  submit-title="Submit"' +
          '  person-template="{}">' +
          '</tb-person-editor>')($scope);
        $scope.$digest();
        scope = element.isolateScope();
      });

      it('should publish the "person" on a scope', function() {
        expect(scope.person).toBeDefined();
      });
    });
  });

  describe('submitPerson', function() {
    var scope;
    var onSubmitDeferred;
    beforeEach(function() {
      onSubmitDeferred = $q.defer();
      $scope.onSubmit = jasmine.createSpy('onSubmit').and.callFake(function() {
        return onSubmitDeferred.promise;
      });
      var element = $compile(
        '<tb-person-editor ' +
        '  on-submit="onSubmit(person)"' +
        '  submit-title="Submit"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.submitPerson).toBeDefined();
    });

    it('should call onSubmit', function() {
      scope.person = { id: 123 };
      scope.submitPerson({ preventDefault: angular.noop });
      expect($scope.onSubmit).toHaveBeenCalledWith({ id: 123 });
    });
  });

  describe('searchTeams', function() {
    var scope;
    var onTeamLookupDeferred;
    beforeEach(function() {
      onTeamLookupDeferred = $q.defer();
      $scope.onTeamLookup = jasmine.createSpy('onTeamLookup').and.callFake(function() {
        return onTeamLookupDeferred.promise;
      });
      var element = $compile(
        '<tb-person-editor ' +
        '  on-team-lookup="onTeamLookup(query)"' +
        '  submit-title="Submit"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.searchTeams).toBeDefined();
    });

    it('should call onTeamLookup', function() {
      scope.searchTeams('a');
      expect($scope.onTeamLookup).toHaveBeenCalled();
    });

    it('should return the result if onTeamLookup succeeds', function() {
      var onSuccess = jasmine.createSpy('onSuccess');
      scope.searchTeams('a').then(onSuccess);
      onTeamLookupDeferred.resolve('hello');
      $scope.$digest();
      expect(onSuccess).toHaveBeenCalledWith('hello');
    });

    it('should return an empty collection if onTeamLookup fails', function() {
      var onSuccess = jasmine.createSpy('onSuccess');
      scope.searchTeams('a').then(onSuccess);
      onTeamLookupDeferred.reject('error');
      $scope.$digest();
      expect(onSuccess).toHaveBeenCalledWith([]);
    });
  });
});
