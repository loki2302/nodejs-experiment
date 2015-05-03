module.exports = function ErrorModal() {
  this.element = element(by.css('.error-modal'));
  this.title = this.element.element(by.css('.modal-title'));
  this.message = this.element.element(by.css('.modal-body'));
  this.ok = this.element.element(by.css('.ok'));
};
