import {
    FETCH_CHATS,
    SET_CURRENT_CHAT,
    FRIENDS_ONLINE,
    FRIEND_ONLINE,
    FRIEND_OFFLINE,
    SET_SOCKET,
    RECEIVED_MESSAGE,
    SENDER_TYPING,
    PAGINATE_MESSAGES,
    INCREMENT_SCROLL,
    SET_NEW_CHAT,
    ADD_USER_TO_GROUP,
    LEAVE_CURRENT_CHAT,
    DELETE_CHAT
} from '../types';

const INITIAL_STATE = {
    chats: [],
    currentChat: {},
    socket: {},
    newMessage: {
        chatID: null,
        seen: null
    },
    scrollBottom: 0,
    senderTyping: { typing: false }
}

const chatReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_CHATS:
            return {
                ...state,
                chats: action.payload
            }
        case SET_CURRENT_CHAT:
            return {
                ...state,
                currentChat: action.payload,
                scrollBottom: state.scrollBottom + 1,
                newMessage: { chatID: null, seen: null }
            }
        case FRIENDS_ONLINE: {
            const chatsCopy = state.chats.map(chat => {
                return {
                    ...chat,
                    Users: chat.Users.map(user => {
                        if (action.payload.includes(user.id)) {
                            return {
                                ...user,
                                status: 'online'
                            }
                        }
                        return user;
                    })
                }
            })

            return {
                ...state,
                chats: chatsCopy
            }
        }
        case FRIEND_ONLINE: {
            
            let currentChatCopy = { ...state.currentChat };

            const chatsCopy = state.chats.map(chat => {

                const Users = chat.Users.map(user => {

                    if (user.id === action.payload.id) {
                        return {
                            ...user,
                            status: 'online'
                        }
                    } else {
                        return user;
                    }
                })

                if (chat.id === currentChatCopy.id) {
                    currentChatCopy = {
                        ...currentChatCopy,
                        Users
                    }
                }

                return {
                    ...chat,
                    Users
                }
            })

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy
            }
        }
        case FRIEND_OFFLINE: {

            let currentChatCopy = { ...state.currentChat };

            const chatsCopy = state.chats.map(chat => {

                const Users = chat.Users.map(user => {

                    if (user.id === action.payload.id) {
                        return {
                            ...user,
                            status: 'offline'
                        }
                    } else {
                        return user;
                    }
                })

                if (chat.id === currentChatCopy.id) {
                    currentChatCopy = {
                        ...currentChatCopy,
                        Users
                    }
                }

                return {
                    ...chat,
                    Users
                }
            })

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy
            }
        }
        case SET_SOCKET: {
            return {
                ...state,
                socket: action.payload
            }
        }
        case RECEIVED_MESSAGE: {
            const { userID, message } = action.payload;
            let currentChatCopy = { ...state.currentChat };
            let newMessage = { ...state.newMessage };
            let scrollBottom = { ...state.scrollBottom };

            // check if message belong to chat and append to message to chat
            const chatsCopy = state.chats.map(chat => {
                if (message.chatID === chat.id) {

                    if (message.User.id === userID) {
                        scrollBottom++
                    } else {
                        newMessage = {
                            chatID: chat.id,
                            seen: false
                        }
                    }

                    if (message.chatID === currentChatCopy.id) {
                        currentChatCopy = {
                            ...currentChatCopy,
                            Messages: [ ...currentChatCopy.Messages, ...[message]]
                        }
                    }

                    return {
                        ...chat,
                        Messages: [ ...chat.Messages, ...[message]]
                    }
                }

                return chat;
            })

            if (scrollBottom === state.scrollBottom) {
                return {
                    ...state,
                    chats: chatsCopy,
                    currentChat: currentChatCopy,
                    newMessage,
                    
                }
            }

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy,
                newMessage,
                scrollBottom,
                senderTyping: { typing: false }
            }

        }
        case SENDER_TYPING: {
            if (action.payload.typing) {
                return {
                    ...state,
                    senderTyping: action.payload,
                    scrollBottom: state.scrollBottom + 1
                }
            } else {
                return {
                    ...state,
                    senderTyping: action.payload,
                }
            }
        }
        case PAGINATE_MESSAGES: {
            const { id, messages, pagination } = action.payload;
            let currentChatCopy = { ...state.currentChat };
            console.log(id);
            const chatsCopy = state.chats.map(chat => {
                if (chat.id === id) {
                    const shifted = [...messages, ...chat.Messages];
                    currentChatCopy = {
                        ...currentChatCopy,
                        Messages: shifted,
                        Pagination: pagination
                    }

                    return {
                        ...chat,
                        Messages: shifted,
                        Pagination: pagination
                    }
                }

                return chat;
            })

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy
            }
        }
        case INCREMENT_SCROLL:
                return {
                    ...state,
                    scrollBottom: state.scrollBottom + 1,
                    newMessage: { chatID: null, seen: true }
                }
        case SET_NEW_CHAT: {
            const chatsCopy = state.chats.map(el => el);
            chatsCopy.push(action.payload)

            return {
                ...state,
                chats: chatsCopy
            }

        }
        case ADD_USER_TO_GROUP: {

            const { chat, chatters } = action.payload;

            let exists = false;

            const chatsCopy = state.chats.map(chatState => {
                if (chat.id === chatState.id) {
                    exists = true;

                    return {
                        ...chatState,
                        Users: [...chatState.Users, ...chatters]
                    }
                }

                return chatState;
            })

            if (!exists) {
                chatsCopy.push(chat);
            }

            let currentChatCopy = { ...state.currentChat };

            if (Object.keys(currentChatCopy).length > 0) {
                if (chat.id === currentChatCopy.id) {
                    currentChatCopy = {
                        ...state.currentChat,
                        Users: [ ...state.currentChat.Users, ...chatters]
                    }
                }
            }

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy
            }
        }
        case LEAVE_CURRENT_CHAT: {

            const { chatID, userID, currentUserID } = action.payload;

            if (userID === currentUserID) {

                const chatsCopy = state.chats.filter(chat => chat.id !== chatID);

                return {
                    ...state,
                    chats: chatsCopy,
                    currentChat: state.currentChat.id === chatID ? {} : state.currentChat
                }

            } else {

                const chatsCopy = state.chats.map(chat => {
                    if (chatID === chat.id) {
                        return {
                            ...chat,
                            Users: chat.Users.filter(user => user.id === userID)
                        }
                    }

                    return chat;
                })

                let currentChatCopy = { ...state.currentChat };

                if (currentChatCopy.id === chatID) {
                    currentChatCopy = {
                        ...currentChatCopy,
                        Users: currentChatCopy.Users.filter(user => user.id === userID)
                    }
                }

                return {
                    ...state,
                    chats: chatsCopy,
                    currentChat: currentChatCopy
                }

            }
            
        }
        case DELETE_CHAT: {
            
            return {
                ...state,
                chats: state.chats.filter(chat => chat.id !== action.payload),
                currentChat: state.currentChat.id === action.payload ? {} : state.currentChat
            }
        }
        default: 
            return state;
    }
};

export default chatReducer;