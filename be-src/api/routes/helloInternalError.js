module.exports = function(dummyMessage, Team, Person, Membership) {
  return function(router) {
    router.get('/hello/internalError', function* () {
      throw new Error('shit happened');
    });
  };
};
