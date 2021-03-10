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
    SET_NEW_CHAT
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
        default: 
            return state;
    }
};

export default chatReducer;