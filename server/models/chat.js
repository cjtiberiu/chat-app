'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, { through: 'ChatUser', foreignKey: 'chatID' })
      this.hasMany(models.ChatUser, { foreignKey: 'chatID' })
      this.hasMany(models.Message, { foreignKey: 'chatID'})
    }
  };
  Chat.init({
    type: {
      type: DataTypes.STRING,
      defaultValue: 'dual'
    }
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};