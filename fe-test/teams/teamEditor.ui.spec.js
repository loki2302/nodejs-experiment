describe('tbTeamEditor UI', function() {
  beforeEach(module('tbTeamEditor', 'tbTemplates'));

  var $scope;
  var $compile;
  var $q;
  beforeEach(inject(function($rootScope, _$compile_, _$q_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $q = _$q_;
  }));

  var handleTeamDeferred;
  var handlePersonLookupDeferred;
  var ui;
  var scope;
  beforeEach(function() {
    handleTeamDeferred = $q.defer();
    $scope.handleTeam = jasmine.createSpy('handleTeam').and
      .callFake(function() {
        return handleTeamDeferred.promise;
      });

    handlePersonLookupDeferred = $q.defer();
    $scope.handlePersonLookup = jasmine.createSpy('handlePersonLookup').and
      .callFake(function() {
        return handlePersonLookupDeferred.promise;
      });

    $scope.busy = false;
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
      '  on-submit="handleTeam(team)"' +
      '  on-person-lookup="handlePersonLookup(query)"' +
      '  team-template="team">' +
      '</tb-team-editor>')($scope);
    $scope.$digest();
    scope = element.isolateScope();

    ui = new UiMap(element);
  });

  it('should set up the submit button text based on submitTitle', function() {
    expect(ui.submitTeamButtonElement().text()).toBe('Hello World');
  });

  it('should prepopulate the fields based on teamTemplate', function() {
    expect(ui.nameInputElement().val()).toBe('the team');

    var firstTeamMemberNameElement = ui.teamMemberNameElement(0);
    expect(firstTeamMemberNameElement.text()).toBe('john');

    var firstTeamMemberRoleElement = ui.teamMemberRoleElement(0);
    expect(firstTeamMemberRoleElement.val()).toBe('developer');

    var firstTeamMemberRemoveButtonElement = ui.teamMemberRemoveButtonElement(0);
    expect(firstTeamMemberRemoveButtonElement.length).toBe(1);
  });

  describe('"busy" handling', function() {
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
    describe('person selector', function() {
      it('should delegate to search people', function() {
        spyOn(scope, 'searchPeople').and.returnValue($q.when([]));
        ui.newMemberNameElement().val('a');
        ui.newMemberNameElement().change();
        expect(scope.searchPeople).toHaveBeenCalledWith('a');
      });

      it('should display a typeahead list', function() {
        expect(ui.newMemberNameTypeaheadList().hasClass('ng-hide')).toBe(true);
        ui.newMemberNameElement().val('j');
        ui.newMemberNameElement().change();
        $scope.$apply(function() {
          handlePersonLookupDeferred.resolve([{
            id: 123, name: 'john'
          }]);
        });
        $scope.$digest();

        expect(ui.newMemberNameTypeaheadList().hasClass('ng-hide')).toBe(false);
      });
    });

    describe('add member button', function() {
      it('should delegate to scope.addMember()', function() {
        expect(scope.team.members.length).toBe(1);
        ui.addNewMemberButtonElement().click();
        expect(scope.team.members.length).toBe(2);
      })
    });
  });

  describe('removing an existing member', function() {
    it('should delegate to removeMember()', function() {
      expect(scope.team.members.length).toBe(1);
      ui.teamMemberRemoveButtonElement(0).click();
      expect(scope.team.members.length).toBe(0);
    });
  });

  describe('form submission', function() {
    it('should delegate to submitTeam', function() {
      spyOn(scope, 'submitTeam').and.callThrough();
      ui.formElement().submit();
      expect(scope.submitTeam).toHaveBeenCalled();
    });

    it('should display validation errors when onSubmit returns a rejection', function() {
      ui.formElement().submit();

      $scope.$apply(function() {
        handleTeamDeferred.reject({ name: 'ugly' });
      });

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(true);
      expect(ui.nameInputElement().val()).toBe('the team');
      expect(ui.nameHelpBlockElement().text()).toBe('ugly');
    });

    it('should do nothing when onSubmit succeeds', function() {
      ui.formElement().submit();

      $scope.$apply(function() {
        handleTeamDeferred.resolve();
      });

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
      expect(ui.nameInputElement().val()).toBe('the team');
    });

    it('should eliminate the validation errors once the form is touched', function() {
      ui.formElement().submit();

      $scope.$apply(function() {
        handleTeamDeferred.reject({ name: 'the team' });
      });

      ui.nameInputElement().val('the team 2');
      ui.nameInputElement().change();

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
    });

    it('should eliminate the validation errors when the form is submitted again after the previous rejection', function() {
      ui.formElement().submit();
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

    this.newMemberNameTypeaheadList = function() {
      return element.find('ul.dropdown-menu');
    };

    this.newMemberNameTypeaheadListItem = function(index) {
      return this.newMemberNameTypeaheadList().find('li')[0];
    }

    this.newMemberRoleElement = function() {
      return element.find('#new-member-role');
    };

    this.addNewMemberButtonElement = function() {
      return element.find('button#add-member-button');
    };

    this.submitTeamButtonElement = function() {
      return element.find('button#submit-team-button');
    };
  };
});
