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

    const users = await User.findAll({ limit: 2 })

    const chat = await Chat.create()

    await ChatUser.bulkCreate([
      {
        chatID: chat.getDataValue('id'),
        userID: users[0].getDataValue('id')
      },
      {
        chatID: chat.getDataValue('id'),
        userID: users[1].getDataValue('id')
      }
    ])

    await Message.bulkCreate([
      {
        message: 'Hello Friend',
        chatID: chat.getDataValue('id'),
        userID: users[0].getDataValue('id')
      },
      {
        message: 'Hello',
        chatID: chat.getDataValue('id'),
        userID: users[1].getDataValue('id')
      },
      {
        message: 'Working?',
        chatID: chat.getDataValue('id'),
        userID: users[0].getDataValue('id')
      },
      {
        message: 'Yes',
        chatID: chat.getDataValue('id'),
        userID: users[1].getDataValue('id')
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
