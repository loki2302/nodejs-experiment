angular.module('tbPersonEditor', [
  'tbValidationFacade',
  'tbTemplates'
])
.directive('tbPersonEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onSubmit: '&',
      submitTitle: '@',
      personTemplate: '=',
      busy: '='
    },
    // templateUrl: 'people/commons/personEditor.html',
    templateUrl: function(element, attrs) {
      // TODO: make it throw if templateUrl is not specified
      var templateUrl = attrs.templateUrl || 'people/commons/personEditor.html';
      return templateUrl;      
    },
    link: function(scope) {
      if(!scope.submitTitle) {
        throw new Error('submitTitle is required');
      }

      if(!scope.personTemplate) {
        throw new Error('personTemplate is required');
      }

      this.personTemplate = angular.copy(scope.personTemplate);
      this.getPerson = function() {
        return angular.copy(this.personTemplate);
      };

      scope.person = this.getPerson();

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
    }
  };
});
