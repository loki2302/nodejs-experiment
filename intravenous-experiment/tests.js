var intravenous = require("intravenous");

module.exports = {
	"I can use intravenous": function(test) {
		function MyDAO() {};

		MyDAO.prototype.getData = function() {
			return "hello";
		};

		function MyService(dao) {
			this.dao = dao;
		};
		MyService.$inject = ["dao"];

		MyService.prototype.doSomething = function() {
			return {
				data: this.dao.getData()
			};
		};

		var container = intravenous.create();
		container.register("dao", MyDAO);
		container.register("service", MyService);

		var service = container.get("service");
		var result = service.doSomething();
		test.equal(result.data, "hello");
		test.done();
	}
};