module.exports = function(Sequelize) {
  return function(sequelize) {
    return sequelize.define('Membership', {
      role: Sequelize.STRING
    });
  };
};
