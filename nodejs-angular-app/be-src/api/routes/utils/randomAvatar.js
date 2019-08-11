module.exports = function(faker) {
  return function(router) {
    router.get('/utils/randomAvatar', function* (next) {
      this.status = 200;
      this.body = {
        url: faker.internet.avatar()
      };
    });
  };
};
