import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { userStatus } from '../../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../Modal/Modal';
import chatService from '../../../services/chatService';
import './ChatHeader.css';

const ChatHeader = ({ chat }) => {

    // store
    const socket = useSelector(state => state.chat.socket);

    // state
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showChatOptions, setShowChatOptions] = useState(false);
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);
    const [showDeleteChatModal, setDeleteChatModal] = useState(false);


    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (searchTerm) {
                searchFriends()
            }
        }, 500)

        return () => {
            clearTimeout(timeoutID);
        }
    }, [searchTerm])

    const searchFriends = e => {
        // chat service
        chatService.getSuggestions(searchTerm)
            .then(res => setSuggestions(res))
            .catch(err => console.log(err))
    }

    // add a new friend
    const addNewFriend = id => {
        // dispatch
        chatService.addFriendToChat(id, chat.id)
            .then(data => {
                console.log(data);
                socket.emit('add-user-to-group', data)
                setShowAddFriendModal(false)
            })
            .catch(err => {
                console.log(err)
            })

    }

    const leaveChat = () => {
        chatService.leaveCurrentChat(chat.id)
            .then(data => {
                socket.emit('leave current chat', data)
            })
            .catch(err => {
                throw err;
            })
    }

    const deleteChat = () => {
        chatService.deleteCurrentChat(chat.id)
            .then(data => {
                socket.emit('delete chat', data)
            })
            .catch(err => {
                throw err;
            })
    }

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

                <FontAwesomeIcon 
                    onClick={() => setShowChatOptions(!showChatOptions)}
                    icon={['fas', 'ellipsis-v']} 
                    className='fa-icon'
                    style={{ cursor: 'pointer'}}
                />
            </div>
            
            {
                showChatOptions ? (
                    <div className='settings'>
                        <div onClick={() => setShowAddFriendModal(true)}>
                            <FontAwesomeIcon icon={['fas', 'user-plus']} className='fa-icon' />
                            <p>Add user to chat</p>
                        </div>

                        {
                            chat.type === 'group' ? (
                                <div onClick={() => leaveChat()}>
                                    <FontAwesomeIcon icon={['fas', 'sign-out-alt']} className='fa-icon' />
                                    <p>Leave chat</p>
                                </div>
                            ) : null
                        }
                        
                        {
                            chat.type === 'dual' ?
                            <div onClick={() => deleteChat()}>
                                <FontAwesomeIcon icon={['fas', 'trash']} className='fa-icon' />
                                <p>Delete Chat</p>
                            </div>
                            : null
                        }
                        
                    </div>
                ) : null
            }

            {
                showAddFriendModal &&
                <Modal showModal={showAddFriendModal} setShowModal={setShowAddFriendModal} setSearchTerm={setSearchTerm} setSuggestions={setSuggestions}>
                    <Fragment key='header'>
                        <h3 className='m-0'>Add friend to group chat</h3>
                    </Fragment>

                    <Fragment key='body'>
                        <p>Find friends by username</p>
                        <input
                            onChange={e => setSearchTerm(e.target.value)}
                            type='text'
                            placeholder='search...'
                        />
                        <div className='suggestions'>
                            {
                                suggestions.map(user => {
                                    return (
                                        <div className='suggestion' key={user.id}>
                                            <p className='m-0'>{user.username}</p>
                                            <button onClick={() => addNewFriend(user.id)}>ADD</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Fragment>
                </Modal> 
            }
        </Fragment>
    )
};

export default ChatHeader;