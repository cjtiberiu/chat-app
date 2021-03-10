import React, { useState, Fragment } from 'react';
import { userStatus } from '../../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ChatHeader.css';

const ChatHeader = (props) => {

    const { chat } = props;
    const [showChatOptions, setShowChatOptions] = useState(false);
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);
    const [showDeleteChatModal, setDeleteChatModal] = useState(false);

    return (
        <Fragment>
            <div className='chatter'>
                {
                    chat.Users.map(user => {
                        return (
                            <div key={user.id} className='chatter-info'>
                                <h3>{user.username}</h3>
                                <div className='chatter-status'>
                                    <span className={`online-status ${userStatus(user)}`}></span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <FontAwesomeIcon 
                onClick={() => setShowChatOptions(!showChatOptions)}
                icon={['fas', 'ellipsis-v']} 
                className='fa-icon' 
            />
            {
                showChatOptions ? (
                    <div className='settings'>
                        <div>
                            <FontAwesomeIcon icon={['fas', 'user-plus']} className='fa-icon' />
                            <p>Add user to chat</p>
                        </div>

                        {
                            chat.type === 'group' ? (
                                <div>
                                    <FontAwesomeIcon icon={['fas', 'sign-out-alt']} className='fa-icon' />
                                    <p>Leave chat</p>
                                </div>
                            ) : null
                        }
                        
                        <div>
                            <FontAwesomeIcon icon={['fas', 'trash']} className='fa-icon' />
                            <p>Delete Chat</p>
                        </div>
                    </div>
                ) : null
            }
        </Fragment>
    )
};

export default ChatHeader;