var Sequelize = require("sequelize");

exports.transactionTests = {
	setUp: function(callback) {
		this.sequelize = new Sequelize('database', 'username', 'password', {
			dialect: 'sqlite',
			storage: 'my.db'
		});

		this.Note = this.sequelize.define('Note', {			
			content: Sequelize.TEXT
		});

		this.sequelize.sync().success(function() {
			callback();
		}).error(function(e) {			
			throw e;
		});
	},

	tearDown: function(callback) {
		this.sequelize.drop().success(function() {
			callback()
		}).error(function(e) {
			throw e;
		});
	},

	canCommitTransaction: function(test) {
		var self = this;
		self.sequelize.transaction({
			isolationLevel: "READ UNCOMMITTED" // Sequelize.Transaction.READ_UNCOMMITTED wtf?
		}, function(tx) {
			// create note in transaction tx
			self.Note.create({ 
				content: "hello" 
			}, {
				transaction: tx
			}).success(function(note) {
				// make sure note is visible inside tx
				self.Note.find(1, { 
					transaction: tx 
				}).success(function(note) {		
					if(!note) {
						test.ok(false);
						return;
					}

					// make sure note is invisible outside tx
					self.Note.find(1).success(function(note) {
						if(!!note) {
							test.ok(false);
							return;
						}

						tx.commit().success(function() {
							// make sure note is visible outside tx after commit
							self.Note.find(1).success(function(note) {
								test.ok(!!note);
								test.done();
							}).error(function(e) {
								test.ok(false);
							});							
						}).error(function(e) {
							test.ok(false);
						});
					}).error(function(e) {
						test.ok(false);
					});					
				}).error(function(e) {
					test.ok(false);
				});
			}).error(function(e) {
				test.ok(false);
			});
		});		
	},

	canRollbackTransaction: function(test) {
		var self = this;
		self.sequelize.transaction({
			isolationLevel: "READ UNCOMMITTED" // Sequelize.Transaction.READ_UNCOMMITTED wtf?
		}, function(tx) {
			// create note in transaction tx
			self.Note.create({ 
				content: "hello" 
			}, {
				transaction: tx
			}).success(function(note) {
				// make sure note is visible inside tx
				self.Note.find(1, { 
					transaction: tx 
				}).success(function(note) {		
					if(!note) {
						test.ok(false);
						return;
					}

					// make sure note is invisible outside tx
					self.Note.find(1).success(function(note) {
						if(!!note) {
							test.ok(false);
							return;
						}

						tx.rollback().success(function() {
							// make sure note has not been created
							self.Note.find(1).success(function(note) {
								test.ok(!note);
								test.done();
							}).error(function(e) {
								test.ok(false);
							});							
						}).error(function(e) {
							test.ok(false);
						});
					}).error(function(e) {
						test.ok(false);
					});					
				}).error(function(e) {
					test.ok(false);
				});
			}).error(function(e) {
				test.ok(false);
			});
		});		
	}
};
