import chatService from '../../services/chatService';
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

export const fetchChats = () => dispatch => {

    return chatService.fetchChats()
        .then(data => {
            console.log(data);
            data.forEach(chat => {
                chat.Users.forEach(user => {
                    user.status = 'offline';
                })
                if (chat.Messages.length === 20) {
                    chat.Messages.pop();
                }
                chat.Messages.sort((a, b) => {
                    return a.id - b.id
                })
            })

            dispatch({ type: FETCH_CHATS, payload: data })
            return data;
        })
        .catch(err => {
            throw err;
        })
};

export const setCurrentChat = (chat) => dispatch => {
    dispatch({ type: SET_CURRENT_CHAT, payload: chat })
}

export const onlineFriends = friends => dispatch => {
    dispatch({ type: FRIENDS_ONLINE, payload: friends })
}

export const onlineFriend = friend => dispatch => {
    dispatch({ type: FRIEND_ONLINE, payload: friend })
}

export const offlineFriend = friend => dispatch => {
    dispatch({ type: FRIEND_OFFLINE, payload: friend })
}

export const setSocket = socket => dispatch => {
    dispatch({ type: SET_SOCKET, payload: socket })
}

export const receivedMessage = (message, userID) => dispatch => {
    dispatch({ type: RECEIVED_MESSAGE, payload: { message, userID} })
}

export const senderTyping = (sender) => dispatch => {
    dispatch({ type: SENDER_TYPING, payload: sender })
}

export const paginateMessages = (id, page) => dispatch => {
    return chatService.paginateMessages(id, page)
        .then(res => {

            const { messages, pagination } = res;

            if (typeof messages !== 'undefined' && messages.length > 0) {
                messages.reverse();
                const payload = { messages, id, pagination };

                dispatch({ type: PAGINATE_MESSAGES, payload: payload })
                return true;
            }

            return false;
        })
        .catch(err => {
            throw err;
        })
    
}

export const incrementScroll = () => dispatch => {
    dispatch({ type: INCREMENT_SCROLL })
}

export const createNewChat = chat => dispatch =>  {

    dispatch({ type: SET_NEW_CHAT, payload: chat })

}