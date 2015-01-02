var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return function* (next) {
    var tx = yield sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    });

    this.tx = tx;
    
    try {
      yield next;

      try {
        yield tx.commit();
        console.log("operation succeeded, commit succeeded");
      } catch(commitException) {
        console.log("operation succeeded, commit failed: %s", commitException);
      }
    } catch(operationException) {
      try {
        yield tx.rollback();
        console.log("operation failed, rollback succeeded: %j", operationException);
      } catch(rollbackException) {
        console.log("operation failed, rollback failed: %s", rollbackException);
      }

      throw operationException;
    }
  };
};
