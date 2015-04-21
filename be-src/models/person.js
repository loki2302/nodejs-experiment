module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Person', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Person name should be 2 to 50 characters long'
        }
      }
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Position should be 2 to 50 characters long'
        }
      }
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'City should be 2 to 50 characters long'
        }
      }
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'State should be 2 to 50 characters long'
        }
      }
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Phone should be 2 to 50 characters long'
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
