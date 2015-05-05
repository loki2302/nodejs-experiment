module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Membership', {
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Role should not be empty'
        }
      }
    }
  }, {
    hooks: {
      beforeValidate: function(membership, options, fn) {
        membership.role = membership.role || '';
        fn(null, membership);
      }
    }
  });
};
