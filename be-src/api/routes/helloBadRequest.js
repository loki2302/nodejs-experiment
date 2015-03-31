module.exports = function(dummyMessage, Team, Person, Membership) {
  return function(router) {
    router.get('/hello/badRequest', function* () {
      this.badRequest({
        message: dummyMessage
      });
    });
  };
};
