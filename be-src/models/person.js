module.exports = function(Sequelize) {
  return function(sequelize) {
    return sequelize.define('Person', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Person name should not be empty'
          }
        }
      }
    });
  };
};
