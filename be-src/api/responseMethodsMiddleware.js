module.exports = function(RESTError) {
  return function* (next) {
    this.ok = function(data) {
      this.status = 200;
      this.body = data;
    };

    this.badRequest = function(data) {
      throw new RESTError(400, data);
    };

    try {
      yield next;
    } catch(e) {
      if(e instanceof RESTError) {
        this.status = e.status;
        this.body = e.body;
      } else {
        this.status = 500;
        this.body = 'internal server error ' + e;
      }
    }
  };
};
