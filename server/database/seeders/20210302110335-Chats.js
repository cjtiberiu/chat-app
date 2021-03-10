'use strict';

const models = require('../../models');
const User = models.User;
const Chat = models.Chat;
const ChatUser = models.ChatUser;
const Message = models.Message;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const users = await User.findAll({ limit: 3 })

    const chat = await Chat.create()

    await ChatUser.bulkCreate([
      {
        chatID: chat.getDataValue('id'),
        userID: users[2].getDataValue('id')
      },
      {
        chatID: chat.getDataValue('id'),
        userID: users[0].getDataValue('id')
      }
    ])

    await Message.bulkCreate([
      {
        message: 'Salut',
        chatID: chat.getDataValue('id'),
        userID: users[2].getDataValue('id')
      },
      {
        message: 'Hello',
        chatID: chat.getDataValue('id'),
        userID: users[0].getDataValue('id')
      },
      {
        message: 'Test?',
        chatID: chat.getDataValue('id'),
        userID: users[2].getDataValue('id')
      },
      {
        message: 'It works!',
        chatID: chat.getDataValue('id'),
        userID: users[0].getDataValue('id')
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
