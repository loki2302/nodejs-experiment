describe('tbTeamEditor', function() {
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

      it('should publish the "submitTeam" on a scope', function() {
        expect(scope.submitTeam).toBeDefined();
      });

      it('should publish the "removeMember" on a scope', function() {
        expect(scope.removeMember).toBeDefined();
      });

      it('should publish the "searchPeople" on a scope', function() {
        expect(scope.searchPeople).toBeDefined();
      });

      it('should publish the "canAddMember" on a scope', function() {
        expect(scope.canAddMember).toBeDefined();
      });

      it('should publish the "addMember" on a scope', function() {
        expect(scope.addMember).toBeDefined();
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

  describe('UI', function() {
    it('should set up the submit button text based on submitTitle', function() {
      var element = $compile(
        '<tb-team-editor ' +
        '  busy="busy"' +
        '  submit-title="Hello World"' +
        '  team-template="{}">' +
        '</tb-team-editor>')($scope);

      $scope.$digest();

      var ui = new UiMap(element);
      expect(ui.submitTeamButtonElement().text()).toBe('Hello World');
    });

    it('should prepopulate the fields based on teamTemplate', function() {
      $scope.team = {
        name: 'the team',
        members: [
          {
            person: { id: 123, name: 'john' },
            role: 'developer'
          }
        ]
      };
      var element = $compile(
        '<tb-team-editor ' +
        '  busy="busy"' +
        '  submit-title="Hello World"' +
        '  team-template="team">' +
        '</tb-team-editor>')($scope);

      $scope.$digest();

      var ui = new UiMap(element);
      expect(ui.nameInputElement().val()).toBe('the team');

      var firstTeamMemberNameElement = ui.teamMemberNameElement(0);
      expect(firstTeamMemberNameElement.text()).toBe('john');

      var firstTeamMemberRoleElement = ui.teamMemberRoleElement(0);
      expect(firstTeamMemberRoleElement.val()).toBe('developer');

      var firstTeamMemberRemoveButtonElement = ui.teamMemberRemoveButtonElement(0);
      expect(firstTeamMemberRemoveButtonElement.length).toBe(1);
    });

    describe('busy handling', function() {
      var ui;
      beforeEach(inject(function() {
        var element = $compile(
          '<tb-team-editor ' +
          '  busy="busy"' +
          '  submit-title="Hello World"' +
          '  team-template="{}"' +
          '</tb-team-editor>')($scope);
        $scope.$digest();

        ui = new UiMap(element);
      }));

      it('should enable the form contents as long as "busy" is false', function() {
        $scope.$apply(function() {
          $scope.busy = false;
        });

        expect(ui.fieldsetElement().attr('disabled')).toBeUndefined();
      });

      it('should disable the form contents as long as "busy" is true', function() {
        $scope.$apply(function() {
          $scope.busy = true;
        });

        expect(ui.fieldsetElement().attr('disabled')).toBe('disabled');
      });
    });

    describe('adding a new member', function() {
      var ui;
      var element;
      beforeEach(function() {
        $scope.team = {
          name: 'the team',
          members: []
        };

        element = $compile(
          '<tb-team-editor ' +
          '  submit-title="Hello World"' +
          '  team-template="team"' +
          '  on-person-lookup="lookupPerson(query)"' +
          '  on-submit="handleTeam(team)">' +
          '</tb-team-editor>')($scope);
        $scope.lookupPerson = jasmine.createSpy('lookupPerson');
        $scope.$digest();

        ui = new UiMap(element);
      });

      it('should let me add a new member', function() {
        var elementScope = element.scope();
        expect(elementScope.team).toBeDefined();
        expect(elementScope.teamTemplate).not.toBeDefined();
        // expect(elementScope.getTeam).not.toBeDefined(); // it's not on the scope
        expect(elementScope.newMember).not.toBeDefined();
        expect(elementScope.submitTeam).not.toBeDefined();
        expect(elementScope.removeMember).not.toBeDefined();
        expect(elementScope.searchPeople).not.toBeDefined();
        expect(elementScope.canAddMember).not.toBeDefined();
        expect(elementScope.addMember).not.toBeDefined();
        expect(elementScope.addMember).not.toBeDefined();

        var isolateScope = element.isolateScope();
        expect(isolateScope.team).toBeDefined();
        expect(isolateScope.teamTemplate).toBeDefined();
        // expect(isolateScope.getTeam).toBeDefined(); // it's not on the scope
        expect(isolateScope.newMember).toBeDefined();
        expect(isolateScope.submitTeam).toBeDefined();
        expect(isolateScope.removeMember).toBeDefined();
        expect(isolateScope.searchPeople).toBeDefined();
        expect(isolateScope.canAddMember).toBeDefined();
        expect(isolateScope.addMember).toBeDefined();
        expect(isolateScope.addMember).toBeDefined();
      });
    });

    describe('removing an existing member', function() {
      var handleTeamDeferred;
      var ui;
      beforeEach(function() {
        handleTeamDeferred = $q.defer();
        $scope.team = {
          name: 'the team',
          members: [
            {
              person: { id: 111, name: 'person A' },
              role: 'developer'
            },
            {
              person: { id: 222, name: 'person B' },
              role: 'qa'
            }
          ]
        };
        $scope.handleTeam = jasmine.createSpy('handleTeam').and.callFake(function() {
          return handleTeamDeferred.promise;
        });
        var element = $compile(
          '<tb-team-editor ' +
          '  submit-title="Hello World"' +
          '  team-template="team"' +
          '  on-submit="handleTeam(team)">' +
          '</tb-team-editor>')($scope);
        $scope.$digest();

        ui = new UiMap(element);
      });

      // TODO: check if I can somehow look at the real remove functionality

      it('should remove a member when Remove button is clicked', function() {
        ui.teamMemberRemoveButtonElement(0).click();
        ui.formElement().submit();

        // first argument of first call to handleTeam(x)
        var submittedTeam = $scope.handleTeam.calls.allArgs()[0][0];
        expect(submittedTeam.members.length).toBe(1);
        expect(submittedTeam.members[0].person.id).toBe(222);
      });
    });

    describe('submission', function() {
      var handleTeamDeferred;
      var ui;
      beforeEach(inject(function() {
        handleTeamDeferred = $q.defer();
        $scope.team = { name: 'the team' };
        $scope.handleTeam = jasmine.createSpy('handleTeam').and.callFake(function() {
          return handleTeamDeferred.promise;
        });
        var element = $compile(
          '<tb-team-editor ' +
          '  submit-title="Hello World"' +
          '  team-template="team"' +
          '  on-submit="handleTeam(team)">' +
          '</tb-team-editor>')($scope);
        $scope.$digest();

        ui = new UiMap(element);
        ui.formElement().submit();
      }));

      it('should call onSubmit when the form is submitted', function() {
        expect($scope.handleTeam).toHaveBeenCalledWith({ name: 'the team' });
      });

      it('should display validation errors when onSubmit returns a rejection', function() {
        $scope.$apply(function() {
          handleTeamDeferred.reject({ name: 'ugly' });
        });

        expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(true);
        expect(ui.nameInputElement().val()).toBe('the team');
        expect(ui.nameHelpBlockElement().text()).toBe('ugly');
      });

      it('should do nothing when onSubmit succeeds', function() {
        $scope.$apply(function() {
          handleTeamDeferred.resolve();
        });

        expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
        expect(ui.nameInputElement().val()).toBe('the team');
      });

      it('should eliminate the validation errors once the form is touched', function() {
        $scope.$apply(function() {
          handleTeamDeferred.reject({ name: 'the team' });
        });

        ui.nameInputElement().val('the team 2');
        ui.nameInputElement().change();

        expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
      });

      it('should eliminate the validation errors when the form is submitted again after the previous rejection', function() {
        $scope.$apply(function() {
          handleTeamDeferred.reject({ name: 'ugly' });
        });

        handleTeamDeferred = $q.defer();
        ui.formElement().submit();

        expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
        $scope.$apply(function() {
          handleTeamDeferred.reject({ name: 'ugly' });
        });
        expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(true);
      });
    });

    function UiMap(element) {
      this.formElement = function() {
        return element.find('form');
      };

      this.fieldsetElement = function() {
        return element.find('fieldset');
      };

      this.nameFormGroupElement = function() {
        return element.find('.form-group.name');
      };

      this.nameInputElement = function() {
        return element.find('.form-group.name input');
      };

      this.nameHelpBlockElement = function() {
        return element.find('.form-group.name .help-block');
      };

      this.teamMemberElement = function(index) {
        var elementClassName = 'li.member-' + index;
        return element.find(elementClassName);
      };

      this.teamMemberNameElement = function(index) {
        return this.teamMemberElement(index).find('.person-name');
      };

      this.teamMemberRoleElement = function(index) {
        return this.teamMemberElement(index).find('.member-role');
      };

      this.teamMemberRemoveButtonElement = function(index) {
        return this.teamMemberElement(index).find('.remove-member-button');
      };

      this.newMemberNameElement = function() {
        return element.find('#new-member-name');
      };

      this.newMemberRoleElement = function() {
        return element.find('#new-member-role');
      };

      this.addNewMemberButtonElement = function() {
        return element.find('#add-new-member');
      };

      this.submitTeamButtonElement = function() {
        return element.find('button#submit-team-button');
      };
    };
  });
});
