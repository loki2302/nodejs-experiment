var intravenous = require("intravenous");

module.exports = {
	"I can register a class and a new instance on each request": function(test) {
		var instanceCount = 0;
		function Service() {
			++instanceCount;
		};

		var container = intravenous.create();
		container.register("service", Service);
		
		var service1 = container.get("service");
		test.ok(service1 instanceof Service);
		test.equal(instanceCount, 1);

		var service2 = container.get("service");
		test.ok(service2 instanceof Service);
		test.equal(instanceCount, 2);

		test.done();
	},

	"I can register a specific instance and get it on each request": function(test) {
		var instanceCount = 0;
		function Service() {
			++instanceCount;
		};

		var container = intravenous.create();		
		container.register("service", new Service());

		var service1 = container.get("service");
		test.ok(service1 instanceof Service);
		test.equal(instanceCount, 1);

		var service2 = container.get("service");
		test.ok(service2 instanceof Service);
		test.equal(instanceCount, 1);

		test.done();
	},

	"I can register a class as a singleton": function(test) {
		var instanceCount = 0;
		function Service() {
			++instanceCount;
		};

		var container = intravenous.create();		
		container.register("service", Service, "singleton");

		var service1 = container.get("service");
		test.ok(service1 instanceof Service);
		test.equal(instanceCount, 1);

		var service2 = container.get("service");
		test.ok(service2 instanceof Service);
		test.equal(instanceCount, 1);

		test.done();
	},

	"I can register a class not as singleton": function(test) {
		var instanceCount = 0;
		function Service() {
			++instanceCount;
		};

		var container = intravenous.create();
		container.register("service", Service, "unique");
		
		var service1 = container.get("service");
		test.ok(service1 instanceof Service);
		test.equal(instanceCount, 1);

		var service2 = container.get("service");
		test.ok(service2 instanceof Service);
		test.equal(instanceCount, 2);

		test.done();
	},

	"I can have stuff injected": function(test) {
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