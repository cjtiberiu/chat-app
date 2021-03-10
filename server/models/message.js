'use strict';
const config = require('../config/app');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chat, { foreignKey: 'chatID' })
      this.belongsTo(models.User, { foreignKey: 'userID' })
    }
  };
  Message.init({
    type: DataTypes.STRING,
    message: {
      type: DataTypes.TEXT,
      get() {
        const type = this.getDataValue('type')
        const id = this.getDataValue('chatID')
        const content = this.getDataValue('message')

        return type === 'text' ? content : `${config.appUrl}:${config.appPort}/chat/${id}/${content}`
      }
    },
    chatID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};