'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/app');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Chat, { through: 'ChatUser', foreignKey: 'userID'})
      this.hasMany(models.ChatUser, { foreignKey: 'userID' })
    }
  };
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      get() {
        const avatar = this.getDataValue('avatar');
        const url = `${config.appUrl}:${config.appPort}`

        if (!avatar) {
          return `${url}/male.svg`
        }

        const id = this.getDataValue('id');
        return `${avatar}`
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
    }
  });
  return User;
};

const hashPassword = async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  return user;
}