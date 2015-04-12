angular.module('tbPersonEditor', [
  'tbValidationFacade',
  'tbTemplates',
  'ui.bootstrap'
])
.directive('tbPersonEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onSubmit: '&',
      onTeamLookup: '&',
      submitTitle: '@',
      personTemplate: '=',
      busy: '='
    },
    templateUrl: 'people/commons/personEditor.html',
    link: function(scope) {
      if(!scope.submitTitle) {
        throw new Error('submitTitle is required');
      }

      if(!scope.personTemplate) {
        throw new Error('teamTemplate is required');
      }

      this.getPerson = function() {
        return angular.copy(scope.personTemplate);
      };

      scope.person = this.getPerson();
      scope.newMembership = {};

      scope.submitPerson = function(e) {
        e.preventDefault();

        scope.vf.setAllFieldsValid();
        scope.onSubmit({
          person: scope.person
        }).then(function() {
          scope.person = this.getPerson();
        }, function(errors) {
          scope.vf.setFieldErrors(errors);
        });
      };

      scope.removeMembership = function(membership) {
        var membershipIndex = scope.person.memberships.indexOf(membership);
        if(membershipIndex < 0) {
          throw new Error('Did not find the membership in memberships');
        }

        scope.person.memberships.splice(membershipIndex, 1);
      };

      scope.searchTeams = function(query) {
        return scope.onTeamLookup({
          query: query
        }).catch(function() {
          return [];
        });
      };

      scope.canAddMembership = function() {
        return !!(scope.newMembership &&
          scope.newMembership.team &&
          scope.newMembership.role)
      };

      scope.addMembership = function() {
        if(!scope.canAddMembership()) {
          throw new Error('canAddMembership() says the new membership is not ready yet');
        }

        scope.person.memberships.push(scope.newMembership);
        scope.newMembership = {};
      };
    }
  };
});
