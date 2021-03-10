const socketIO = require('socket.io');
const { sequelize } = require('../models');
const Message = require('../models').Message;

const users = new Map();
const userSockets = new Map();

const socketServer = server => {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
          }
    });

    io.on('connection', (socket) => {

        // listen to the socket "join" event emitted from the socket server
        socket.on('join', async (user) => {

            let sockets = [];

            // if the user is already connected
            if (users.has(user.id)) {
                
                // get the user
                const existingUser = users.get(user.id);

                // update the user sockets with the new socket
                existingUser.sockets = [...existingUser.sockets, ...[socket.id]]
                users.set(user.id, existingUser)

                // set the user sockets in order to emit online and offline events later
                sockets = [...existingUser.sockets, ...[socket.id]];
                userSockets.set(socket.id, user.id);

            // if the user is not already connected
            } else {

                // set the new connected socket
                users.set(user.id, { id: user.id, sockets: [socket.id] } )

                // set the user sockets in order to emit online and offline events later
                sockets.push(socket.id);
                userSockets.set(socket.id, user.id)
            }

            const onlineFriends = []; //ids

            const chatters = await getChatters(user.id) // all the user chatters ids

            // notify user friends that user is now connected
            for (let i = 0; i < chatters.length; i++) {
                if (users.has(chatters[i])) {
                    const chatter = users.get(chatters[i])
                    chatter.sockets.forEach(socket => {
                        try {
                            io.to(socket).emit('online', user);
                        } catch(err) {

                        }
                    })
                    onlineFriends.push(chatter.id);
                }
            }

            // send to user sockets which of his friends are online
            sockets.forEach(socket => {

                try {
                    io.to(socket).emit('friends', onlineFriends);
                } catch(err) {

                }
            })

            console.log(`${user.username} connected`)


        })

        socket.on('message', async (message) => {
            let sockets = [];

            // check if user is inside users collection
            if (users.has(message.from.id)) {

                // update sockets using the user id
                sockets = users.get(message.from.id).sockets;
            }

            console.log(message);

            message.to.forEach(id => {
                if (users.has(id)) {
                    console.log(sockets);
                    console.log(users.get(id).sockets);
                    sockets = [...sockets, ...users.get(id).sockets];
                }
            })

            try {

                const msg = {
                    type: message.type,
                    userID: message.from.id,
                    chatID: message.chatID,
                    message: message.message
                }

                const newMessage = await Message.create(msg);

                message.User = message.from;
                message.userID = message.from.id;
                message.id = newMessage.getDataValue('id');
                message.message = newMessage.message;
                delete message.to;
                delete message.from;

                sockets.forEach(socket => {
                    io.to(socket).emit('received message', message)
                })
            } catch(err) {

            }
        })

        socket.on('typing', message => {
            message.to.forEach(id => {
                if (users.has(id)) {
                    users.get(id).sockets.forEach(socket => {
                        io.to(socket).emit('typing', message)
                    })
                }
            })
        })

        socket.on('add-friend', chats => {
            try {

                let online = 'offline';
                if (users.has(chats[1].Users[0].id)) {
                    online= 'online';
                    chats[0].Users[0].status = 'online';
                    users.get(chats[1].Users[0].id).sockets.forEach(socket => {
                        io.to(socket).emit('new chat', chats[0])
                    })
                }

                if (users.has(chats[0].Users[0].id)) {
                    chats[1].Users[0].status = online;
                    users.get(chats[0].Users[0].id).sockets.forEach(socket => {
                        io.to(socket).emit('new chat', chats[1])
                    })
                }

            } catch(err) {

            }
        })

        socket.on('disconnect', async () => {

            // if userSockets map has the socket ID that is disconnecting
            if (userSockets.has(socket.id)) {

                // get the user from users based on the socket id
                const user = users.get(userSockets.get(socket.id))

                // if this isn't the last user socket connected
                if (user.sockets.length > 1) {

                    // filter out this socket from the userSockets 
                    user.sockets = user.sockets.filter(sock => {
                        if (sock !== socket.id) return true;
                        userSockets.delete(sock);

                        return false;
                    })

                    // set the new user
                    users.set(user.id, user);

                } else {

                    
                    // notify friend that this user has gone offline
                    const chatters = await getChatters(user.id);

                    for (let i = 0; i < chatters.length; i++) {
                        if (users.has(chatters[i])) {
                            users.get(chatters[i]).sockets.forEach(sock => {
                                try {
                                    console.log('salut')
                                    io.to(sock).emit('offline', user);
                                } catch(err) {
        
                                }
                            })
                        }
                    }

                    // delete the socket and the users from their arrays
                    userSockets.delete(socket.id);
                    users.delete(user.id);
                }
            }

        })

    })
};

const getChatters = async (userID) => {
    try {

        const [results, metaData] = await sequelize.query(`
            SELECT "userID" FROM "ChatUsers"
            INNER JOIN (
                SELECT "id" FROM "Chats"
                WHERE exists (
                    SELECT "Users"."id" FROM "Users"
                    INNER JOIN "ChatUsers" ON "Users"."id" = "ChatUsers"."userID"
                    WHERE "Users"."id" = ${parseInt(userID)} and "Chats"."id" = "ChatUsers"."chatID"
                )
            ) as cjoin ON cjoin.id = "ChatUsers"."chatID"
            WHERE "ChatUsers"."userID" != ${parseInt(userID)}
        `)

        return results.length > 0 ? results.map(result => result.userID) : [];

    } catch(err) {

        console.log(err);
        return [];
    }
}

module.exports = socketServer;