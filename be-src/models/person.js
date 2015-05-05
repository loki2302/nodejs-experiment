module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Person', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Person name should not be empty'
        }
      }
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Position should not be empty'
        }
      }
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'City should not be empty'
        }
      }
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'State should not be empty'
        }
      }
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Phone should not be empty'
        }
      }
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'Avatar should be a valid URL'
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email should be a valid email'
        }
      }
    }
  }, {
    hooks: {
      beforeValidate: function(person, options, fn) {
        person.name = person.name || '';
        person.position = person.position || '';
        person.city = person.city || '';
        person.state = person.state || '';
        person.phone = person.phone || '';
        person.avatar = person.avatar || '';
        person.email = person.email || '';
        fn(null, person);
      }
    }
  });
};
