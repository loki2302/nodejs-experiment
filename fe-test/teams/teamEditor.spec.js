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

      it('should publish the "newMember" on a scope', function() {
        expect(scope.newMember).toBeDefined();
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

    it('should reload the team from teamTemplate if onSubmit resolves', function() {
      scope.team = { id: 123 };
      scope.submitTeam({ preventDefault: angular.noop });
      onSubmitDeferred.resolve();
      $scope.$digest();
      expect(scope.team).toEqual({});
    });

    it('should handle validation errors if onSubmit rejects', function() {
      scope.team = { id: 123 };

      spyOn(scope.vf, 'setFieldErrors');
      scope.submitTeam({ preventDefault: angular.noop });
      onSubmitDeferred.reject({
        name: 'ugly'
      });
      $scope.$digest();

      expect(scope.vf.setFieldErrors).toHaveBeenCalledWith({
        name: 'ugly'
      });
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

  describe('canAddMember', function() {
    var scope;
    beforeEach(function() {
      var element = $compile(
        '<tb-team-editor ' +
        '  submit-title="Submit"' +
        '  team-template="{}">' +
        '</tb-team-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.canAddMember).toBeDefined();
    });

    it('should return false if newMember is not set', function() {
      scope.newMember = null;
      expect(scope.canAddMember()).toBe(false);
    });

    it('should return false if newMember.person is not set', function() {
      scope.newMember = {
        role: 'developer'
      };
      expect(scope.canAddMember()).toBe(false);
    });

    it('should return false if newMember.role is not set', function() {
      scope.newMember = {
        person: {}
      };
      expect(scope.canAddMember()).toBe(false);
    });

    it('should return true if newMember has everything set up', function() {
      scope.newMember = {
        person: {},
        role: 'developer'
      };
      expect(scope.canAddMember()).toBe(true);
    });
  });

  describe('addMember', function() {
    var scope;
    beforeEach(function() {
      var element = $compile(
        '<tb-team-editor ' +
        '  submit-title="Submit"' +
        '  team-template="{members:[]}">' +
        '</tb-team-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.addMember).toBeDefined();
    });

    it('should throw if canAddMember() returns false', function() {
      scope.canAddMember = jasmine.createSpy('canAddMember').and.returnValue(false);
      expect(function() {
        scope.addMember();
      }).toThrow();
      expect(scope.canAddMember).toHaveBeenCalled();
    });

    it('should append a new member to the list of members', function() {
      scope.canAddMember = function() { return true; };
      scope.newMember = 'new member';
      scope.addMember();
      expect(scope.team.members).toEqual(['new member']);
    });

    it('should clean up the current new member', function() {
      scope.canAddMember = function() { return true; };
      scope.newMember = 'new member';
      scope.addMember();
      expect(scope.newMember).toEqual({});
    });
  });

  describe('removeMember', function() {
    var scope;
    beforeEach(function() {
      $scope.team = {
        members: [
          {
            person: { id: 11 }
          }
        ]
      };
      var element = $compile(
        '<tb-team-editor ' +
        '  submit-title="Submit"' +
        '  team-template="team">' +
        '</tb-team-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.removeMember).toBeDefined();
    });

    it('should throw if member is not on the list', function() {
      expect(function() {
        scope.removeMember({});
      }).toThrow();
      expect(scope.team.members.length).toBe(1);
    });

    it('should remove the member if it is on the list', function() {
      scope.removeMember(scope.team.members[0]);
      expect(scope.team.members.length).toBe(0);
    });
  });
});
