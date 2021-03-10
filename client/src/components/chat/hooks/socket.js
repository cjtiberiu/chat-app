import { useEffect } from 'react';
import socketIO from 'socket.io-client';
import { 
    fetchChats, 
    onlineFriends, 
    onlineFriend, 
    offlineFriend, 
    setSocket, 
    receivedMessage, 
    senderTyping,
    createNewChat
} from '../../../store/actions/chat';

export function useSocket(user, dispatch) {

    useEffect(() => {

        dispatch(fetchChats())
            .then(res => {
                const socket = socketIO.connect(`http://localhost:5000`);

                dispatch( setSocket(socket) )

                socket.emit('join', user);

                socket.on('typing', sender => {
                    dispatch( senderTyping(sender) )
                })

                socket.on('friends', friends => {
                    dispatch( onlineFriends(friends) );
                })

                socket.on('online', friend => {
                    dispatch( onlineFriend(friend) );
                })

                socket.on('offline', friend => {
                    dispatch( offlineFriend(friend) );
                })

                socket.on('received message', message => {
                    dispatch( receivedMessage(message, user.id));
                })

                socket.on('new chat', chat => {
                    dispatch( createNewChat(chat) );
                })
            })
            .catch(err => console.log(err))

        

    }, [dispatch])
}