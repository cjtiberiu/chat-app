import chatService from '../../services/chatService';
import {
    FETCH_CHATS
} from '../types';

export const fetchChats = () => dispatch => {

    return chatService.fetchChats()
        .then(data => {
            data.forEach(chat => {
                chat.Users.forEach(user => {
                    user.status = 'offline';
                })
                chat.Messages.reverse();
            })

            dispatch({ type: FETCH_CHATS, payload: data })
            return data;
        })
        .catch(err => {
            throw err;
        })
}