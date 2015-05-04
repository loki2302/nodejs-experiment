module.exports = function MembershipListEditor() {
  this.membershipCount = function() {
    return element.all(by.css('.membership')).then(function(elements) {
      return elements.length;
    });
  };

  this.membership = function(index) {
    return element(by.css('.membership-' + index));
  };

  var self = this;
  this.name = function(index) {
    return self.membership(index).element(by.css('h4'));
  };

  this.role = function(index) {
    return self.membership(index).element(by.css('.membership-role'));
  };

  this.remove = function(index) {
    return self.membership(index).element(by.css('.remove-membership-button'));
  };
};
