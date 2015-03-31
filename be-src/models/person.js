module.exports = function(Sequelize) {
  return function(sequelize) {
    return sequelize.define('Person', {
      name: Sequelize.STRING
    });
  };
};
