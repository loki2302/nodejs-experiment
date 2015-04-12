describe('tbPersonEditor UI', function() {
  beforeEach(module('tbPersonEditor', 'tbTemplates'));

  var $scope;
  var $compile;
  var $q;
  beforeEach(inject(function($rootScope, _$compile_, _$q_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $q = _$q_;
  }));

  var handlePersonDeferred;
  var handleTeamLookupDeferred;
  var ui;
  var scope;
  beforeEach(function() {
    handlePersonDeferred = $q.defer();
    $scope.handlePerson = jasmine.createSpy('handlePerson').and
      .callFake(function() {
        return handlePersonDeferred.promise;
      });

    handleTeamLookupDeferred = $q.defer();
    $scope.handleTeamLookup = jasmine.createSpy('handleTeamLookup').and
      .callFake(function() {
        return handleTeamLookupDeferred.promise;
      });

    $scope.busy = false;
    $scope.person = {
      name: 'the person',
      memberships: [
        {
          team: { id: 123, name: 'the team' },
          role: 'developer'
        }
      ]
    };

    var element = $compile(
      '<tb-person-editor ' +
      '  busy="busy"' +
      '  submit-title="Hello World"' +
      '  on-submit="handlePerson(person)"' +
      '  on-team-lookup="handleTeamLookup(query)"' +
      '  person-template="person">' +
      '</tb-person-editor>')($scope);
    $scope.$digest();
    scope = element.isolateScope();

    ui = new UiMap(element);
  });

  it('should set up the submit button text based on submitTitle', function() {
    expect(ui.submitPersonButtonElement().text()).toBe('Hello World');
  });

  it('should prepopulate the fields based on personTemplate', function() {
    expect(ui.nameInputElement().val()).toBe('the person');

    var firstTeamMembershipNameElement = ui.teamMembershipNameElement(0);
    expect(firstTeamMembershipNameElement.text()).toBe('the team');

    var firstTeamMembershipRoleElement = ui.teamMembershipRoleElement(0);
    expect(firstTeamMembershipRoleElement.val()).toBe('developer');

    var firstTeamMembershipRemoveButtonElement = ui.teamMembershipRemoveButtonElement(0);
    expect(firstTeamMembershipRemoveButtonElement.length).toBe(1);
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

  describe('adding a new membership', function() {
    describe('team selector', function() {
      it('should delegate to search teams', function() {
        spyOn(scope, 'searchTeams').and.returnValue($q.when([]));
        ui.newMembershipNameElement().val('a');
        ui.newMembershipNameElement().change();
        expect(scope.searchTeams).toHaveBeenCalledWith('a');
      });

      it('should display a typeahead list', function() {
        expect(ui.newMembershipNameTypeaheadList().hasClass('ng-hide')).toBe(true);
        ui.newMembershipNameElement().val('t');
        ui.newMembershipNameElement().change();
        $scope.$apply(function() {
          handleTeamLookupDeferred.resolve([{
            id: 123, name: 'the team'
          }]);
        });
        $scope.$digest();

        expect(ui.newMembershipNameTypeaheadList().hasClass('ng-hide')).toBe(false);
      });

      it('should update the team when typeahead item is clicked', function() {
        ui.newMembershipNameElement().val('t');
        ui.newMembershipNameElement().change();
        $scope.$apply(function() {
          handleTeamLookupDeferred.resolve([{
            id: 123, name: 'the team'
          }]);
        });

        ui.newMembershipNameTypeaheadListItem(0).click();

        expect(scope.newMembership.team).toEqual({ id: 123, name: 'the team' });
      });
    });

    describe('role editor', function() {
      it('should delegate to newMembership.role', function() {
        ui.newMembershipRoleElement().val('developer');
        ui.newMembershipRoleElement().change();
        expect(scope.newMembership.role).toBe('developer');
      });
    });

    describe('add membership button', function() {
      it('should delegate to scope.addMembership()', function() {
        spyOn(scope, 'addMembership');
        ui.addNewMembershipButtonElement().click();
        expect(scope.addMembership).toHaveBeenCalled();
      })
    });
  });

  describe('removing an existing membership', function() {
    it('should delegate to removeMembership()', function() {
      spyOn(scope, 'removeMembership');
      ui.teamMembershipRemoveButtonElement(0).click();
      expect(scope.removeMembership).toHaveBeenCalledWith(jasmine.objectContaining({
        team: jasmine.objectContaining({
          id: 123
        })
      }));
    });
  });

  describe('form submission', function() {
    it('should delegate to submitPerson', function() {
      spyOn(scope, 'submitPerson').and.callThrough();
      ui.formElement().submit();
      expect(scope.submitPerson).toHaveBeenCalled();
    });

    it('should display validation errors when onSubmit returns a rejection', function() {
      ui.formElement().submit();

      $scope.$apply(function() {
        handlePersonDeferred.reject({ name: 'ugly' });
      });

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(true);
      expect(ui.nameInputElement().val()).toBe('the person');
      expect(ui.nameHelpBlockElement().text()).toBe('ugly');
    });

    it('should do nothing when onSubmit succeeds', function() {
      ui.formElement().submit();

      $scope.$apply(function() {
        handlePersonDeferred.resolve();
      });

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
      expect(ui.nameInputElement().val()).toBe('the person');
    });

    it('should eliminate the validation errors once the form is touched', function() {
      ui.formElement().submit();

      $scope.$apply(function() {
        handlePersonDeferred.reject({ name: 'the person' });
      });

      ui.nameInputElement().val('the person 2');
      ui.nameInputElement().change();

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
    });

    it('should eliminate the validation errors when the form is submitted again after the previous rejection', function() {
      ui.formElement().submit();
      $scope.$apply(function() {
        handlePersonDeferred.reject({ name: 'ugly' });
      });

      handlePersonDeferred = $q.defer();
      ui.formElement().submit();

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
      $scope.$apply(function() {
        handlePersonDeferred.reject({ name: 'ugly' });
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

    this.teamMembershipElement = function(index) {
      var elementClassName = 'li.membership-' + index;
      return element.find(elementClassName);
    };

    this.teamMembershipNameElement = function(index) {
      return this.teamMembershipElement(index).find('.team-name');
    };

    this.teamMembershipRoleElement = function(index) {
      return this.teamMembershipElement(index).find('.membership-role');
    };

    this.teamMembershipRemoveButtonElement = function(index) {
      return this.teamMembershipElement(index).find('.remove-membership-button');
    };

    this.newMembershipNameElement = function() {
      return element.find('#new-membership-name');
    };

    this.newMembershipNameTypeaheadList = function() {
      return element.find('ul.dropdown-menu');
    };

    this.newMembershipNameTypeaheadListItem = function(index) {
      return this.newMembershipNameTypeaheadList().find('li')[0];
    }

    this.newMembershipRoleElement = function() {
      return element.find('#new-membership-role');
    };

    this.addNewMembershipButtonElement = function() {
      return element.find('button#add-membership-button');
    };

    this.submitPersonButtonElement = function() {
      return element.find('button#submit-person-button');
    };
  };
});
