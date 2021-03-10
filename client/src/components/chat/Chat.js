import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from './hooks/socket';
import { fetchChats } from '../../store/actions/chat';

// components
import Navbar from './Navbar/Navbar';
import FriendList from './FriendList/FriendList';
import Messenger from './Messenger/Messenger';

import './Chat.css';


const Chat = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    useSocket(user, dispatch);


    return (
        <div className='chat-container shadow-light'>
            <Navbar />
            <div className='chat-wrap'>
                <FriendList />
                <Messenger />
            </div>
        </div>
    )
};

export default Chat;