angular.module('tbTeamEditor', [
  'tbValidationFacade',
  'tbTemplates',
  'ui.bootstrap'
])
.directive('tbTeamEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onSubmit: '&',
      onPersonLookup: '&',
      submitTitle: '@',
      teamTemplate: '=',
      busy: '='
    },
    templateUrl: 'teams/commons/teamEditor.html',
    link: function(scope) {
      if(!scope.submitTitle) {
        throw new Error('submitTitle is required');
      }

      if(!scope.teamTemplate) {
        throw new Error('teamTemplate is required');
      }

      this.getTeam = function() {
        return angular.copy(scope.teamTemplate);
      };

      scope.team = this.getTeam();
      scope.newMember = {};

      scope.submitTeam = function(e) {
        e.preventDefault();

        scope.vf.setAllFieldsValid();
        scope.onSubmit({
          team: scope.team
        }).then(function() {
          scope.team = this.getTeam();
        }, function(errors) {
          scope.vf.setFieldErrors(errors);
        });
      };

      scope.removeMember = function(member) {
        var memberIndex = scope.team.members.indexOf(member);
        if(memberIndex < 0) {
          throw new Error('Did not find the member in members');
        }

        scope.team.members.splice(memberIndex, 1);
      };

      scope.searchPeople = function(query) {
        return scope.onPersonLookup({
          query: query
        }).catch(function() {
          return [];
        });
      };

      scope.canAddMember = function() {
        return !!(scope.newMember &&
          scope.newMember.person &&
          scope.newMember.role)
      };

      scope.addMember = function() {
        if(!scope.canAddMember()) {
          throw new Error('canAddMember() says the new member is not ready yet');
        }

        scope.team.members.push(scope.newMember);
        scope.newMember = {};
      };
    }
  };
});
