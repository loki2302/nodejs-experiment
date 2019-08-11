function RESTError(status, body) {
  this.status = status;
  this.body = body;
};
RESTError.prototype = new Error();
RESTError.prototype.constructor = RESTError;

module.exports = RESTError;
