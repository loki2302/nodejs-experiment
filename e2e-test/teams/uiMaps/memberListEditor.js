module.exports = function MemberListEditor() {
  this.memberCount = function() {
    return element.all(by.css('.member')).then(function(elements) {
      return elements.length;
    });
  };

  this.member = function(index) {
    return element(by.css('.member-' + index));
  };

  var self = this;
  this.name = function(index) {
    return self.member(index).element(by.css('h4'));
  };

  this.role = function(index) {
    return self.member(index).element(by.css('.member-role'));
  };

  this.remove = function(index) {
    return self.member(index).element(by.css('.remove-member-button'));
  };
};
