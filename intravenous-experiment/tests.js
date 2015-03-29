var expect = require('chai').expect;
var intravenous = require('intravenous');

describe('Intravenous', function() {
	it('should let me register a ctor function and get a new instance on each request', function() {
		var instanceCount = 0;
		function MyService() {
			++instanceCount;
		};

		var container = intravenous.create();
		container.register('myService', MyService, 'unique');

		var instance1 = container.get('myService');
		expect(instance1).to.be.instanceof(MyService);
		expect(instanceCount).to.equal(1);

		var instance2 = container.get('myService');
		expect(instance2).to.be.instanceof(MyService);
		expect(instanceCount).to.equal(2);
	});

	it('should let me register a ctor function as a singleton', function() {
		var instanceCount = 0;
		function MyService() {
			++instanceCount;
		};

		var container = intravenous.create();
		container.register('myService', MyService, 'singleton');

		var instance1 = container.get('myService');
		expect(instance1).to.be.instanceof(MyService);
		expect(instanceCount).to.equal(1);

		var instance2 = container.get('myService');
		expect(instance2).to.be.instanceof(MyService);
		expect(instanceCount).to.equal(1);
	});

	it('should let me register a single object and get the same instance on each request', function() {
		var instanceCount = 0;
		function MyService() {
			++instanceCount;
		};

		var container = intravenous.create();
		var theOnlyInstance = new MyService()
		container.register('myService', theOnlyInstance);

		var instance2 = container.get('myService');
		expect(instance2).to.equal(theOnlyInstance);
		expect(instanceCount).to.equal(1);
	});

	it('should let me inject things', function() {
		function DAL(dbFilename) {
			this.dbFilename = dbFilename;
		};
		DAL.$inject = ['dbFilename'];

		function SL(dal) {
			this.dal = dal;
		};
		SL.$inject = ['dal'];

		var container = intravenous.create();
		container.register('dbFilename', 'my.db', 'singleton');
		container.register('dal', DAL, 'singleton');
		container.register('sl', SL, 'singleton');

		var sl = container.get('sl');
		expect(sl.dal.dbFilename).to.equal('my.db');
	});
});
