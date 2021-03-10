import React from 'react';
import { useSelector } from 'react-redux';
import { userStatus } from '../../../utils/helpers';
import './Friend.css';

const Friend = (props) => {

    const { chat, click } = props;
    const currentChat = useSelector(state => state.chat.currentChat);

    const isChatOpened = () => {
        return currentChat.id === chat.id ? 'opened' : '';
    }

    const lastMessage = () => {
        if (chat.Messages.length > 0) {
            return chat.Messages[chat.Messages.length - 1].message;
        } else {
            return ''
        }
        
    }

    return (
        <div onClick={click} className={`friend-list ${isChatOpened()}`}>
            <div>
                <img width='40' height='40' src={chat.Users[0].avatar} alt='User avatar' />
                <div className='friend-info'>
                    <h4 className='m-0'>{chat.Users[0].username}</h4>
                    <h6 className='m-0'>{lastMessage()}</h6>
                </div>
            </div>
            <div className='friend-status'>
                <span className={`online-status ${userStatus(chat.Users[0])}`}></span>
            </div>
        </div>
    )
};

export default Friend;