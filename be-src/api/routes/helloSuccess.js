module.exports = function(dummyMessage, Team, Person, Membership) {
  return function(router) {
    router.get('/hello/success', function* () {
      this.ok({
        message: dummyMessage
      });
    });
  };
};
