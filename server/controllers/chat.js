const models = require('../models');
const User = models.User;
const Chat = models.Chat;
const ChatUser = models.ChatUser;
const Message = models.Message;
// allows for conditionals
const { Op, json } = require('sequelize');
const { sequelize } = require('../models');


// request the user chats data
exports.index = async (req, res) => {

    const user = await User.findOne({
        // grab the user from the request user id
        where: {
            id: req.user.id
        },
        // get the user chats, **possible due to relations
        include: [
            {
                model: Chat,
                include: [
                    {
                        model: User,
                        where: {
                            [Op.not]: {
                                id: req.user.id
                            }
                        },
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: Message,
                        include: [
                            {
                                model: User,
                                attributes: { exclude: ['password'] }
                            }
                        ],
                        limit: 20,
                        order: [[ 'id', 'DESC']]
                    }
                ]
            }
        ]
    })

    return res.json(user.Chats)
};

exports.create = async (req, res) => {

    const { friendID } = req.body;

    console.log(friendID);

    const t = await sequelize.transaction();
    
    try {

        const user = await User.findOne({
            where: {
                id: req.user.id
            },
            include: [
                {
                    model: Chat,
                    where: {
                        type: 'dual'
                    },
                    include: [
                        {
                            model: ChatUser,
                            where: {
                                userID: friendID
                            }
                        }
                    ]
                }
            ]
        })

        if (user && user.Chats.length > 0) {
            return res.status(401).json({ message: 'Chat with this user already exists', status: 'Error' })
        }

        const chat = await Chat.create({ type: 'dual' }, { transaction: t });

        await ChatUser.bulkCreate([
            {
              chatID: chat.id,
              userID: req.user.id
            },
            {
              chatID: chat.id,
              userID: friendID
            }
        ], { transaction: t })

        

        await t.commit();

        // const newChat = await Chat.findOne({
        //     where: {
        //         id: chat.getDataValue('id'),
        //     },
        //     include: [
        //         {
        //             model: ChatUser,
        //             where: {
        //                 [Op.not]: {
        //                     userID: friendID
        //                 }
        //             }
        //         },
        //         {
        //             model: User,
        //             where: {
        //                 [Op.not]: {
        //                     id: req.user.id
        //                 }
        //             }
        //         },
        //         {
        //             model: Message,
        //         }
        //     ]
        // })

        const creator = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        const partner = await User.findOne({
            where: {
                id: friendID
            }
        })

        const forCreator = {
            id: chat.id,
            type: 'dual',
            Users: [partner],
            Messages: []
        }

        const forReceiver = {
            id: chat.id,
            type: 'dual',
            Users: [creator],
            Messages: []
        }

        return res.json([forCreator, forReceiver]);

    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: err })
    }
}

exports.paginateMessages = async (req, res) => {

    const limit = 20;
    const page = parseInt(req.query.page) || 1;
    const offset = page > 1 ? (page * limit) - limit : 0;

    const messages = await Message.findAndCountAll({
        where: {
            chatID: req.query.id
        },
        include: [
            {
                model: User,
                attributes: { exclude: ['password'] }
            }
        ],
        limit,
        offset,
        order: [['id', 'DESC']]
    })

    const totalPages = Math.ceil(messages.count / limit);

    if (page > totalPages) return res.json({ data: { messages: [] } });

    const results = {
        messages: messages.rows,
        pagination: {
            page,
            totalPages
        }
    }

    return res.json(results)
}

exports.imageUpload = (req, res) => {

    console.log(req.file);

    if (req.file) {
        return res.send(req.file.filename);
    }

    return res.status(500).json({ message: 'Error uploading image' });
}

exports.deleteChat = async (req, res) => {

    try {

        await Chat.destroy({
            where: {
                id: req.params.id
            }
        })

        return res.json({ message: 'Chat deleted' })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}