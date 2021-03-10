import React from 'react';
import './Message.css';

const Message = (props) => {

    const { user, chat, index, message } = props;

    const determineMargin = () => {

        if (index + 1 === chat.Messages.length) return

        return message.userID === chat.Messages[index + 1].userID ? 'mb-5' : 'mb-10'
    }

    return (
        <div key={message.id} className={`message ${determineMargin()} ${message.userID === user.id ? 'creator' : ''}`}>
            <div className={message.userID === user.id ? 'owner' : 'other-person'}>
                {
                    message.userID !== user.id ? (
                        <h6 className='m-0'>{message.User.username}</h6>
                    ) : null
                }
                {
                    message.type === 'text' ? (
                        <p className='m-0'>{message.message}</p>
                    ) : <img src={message.message} alt="user upload" />
                }
            </div>
        </div>
    )
};

export default Message;