module.exports = function(dummyMessage, Team, Person, Membership) {
  return function(router) {
    router.get('/hello', function* () {
      this.status = 200;
      this.body = {
        message: dummyMessage
      };
    });
  };
};
