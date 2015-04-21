module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Membership', {
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Role should be 2 to 50 characters long'
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
