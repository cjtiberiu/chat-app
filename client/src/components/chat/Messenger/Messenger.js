import React from 'react';
import { useSelector } from 'react-redux';

import ChatHeader from '../ChatHeader/ChatHeader';
import MessageBox from '../MessageBox/MessageBox';
import MessageInput from '../MessageInput/MessageInput';

import './Messenger.css';

const Messenger = () => {

    const currentChat = useSelector(state => state.chat.currentChat);

    const activeChat = () => {
        return Object.keys(currentChat).length > 0
    }

    return (
        <div className='messenger'>
            {
                activeChat() ? (
                    <div className='messenger-wrap'>
                        <ChatHeader chat={currentChat} />
                        <hr />
                        <MessageBox chat={currentChat} />
                        <MessageInput chat={currentChat} />
                    </div>
                ) : (
                    <p>No active chat</p>
                )
            }
        </div>
    )
};

export default Messenger;