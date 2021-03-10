import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Friend from '../Friend/Friend';
import Modal from '../../Modal/Modal';
import { setCurrentChat, createNewChat } from '../../../store/actions/chat';
import chatService from '../../../services/chatService'; 
import './FriendList.css';

const FriendList = () => {

    // store
    const dispatch = useDispatch();
    const chats = useSelector(state => state.chat.chats);
    const socket = useSelector(state => state.chat.socket);

    // state
    const [showModal, setShowModal] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    // set the current chat function using redux actions
    const openChat = chat => {
        dispatch( setCurrentChat(chat) );
    }

    // search friends function
    const searchFriends = e => {
        // chat service
        chatService.getSuggestions(searchTerm)
            .then(res => setSuggestions(res))
            .catch(err => console.log(err))
    }

    // add a new friend
    const addNewFriend = id => {
        // dispatch
        chatService.createChat(id)
            .then(res => {
                socket.emit('add-friend', res)
                setShowModal(false)
            })
            .catch(err => {
                console.log(err)
            })

    }

    return (
        <div className='friends'>
            <div className='title'>
                <h3 className='m-0'>Friends</h3>
                <button onClick={() => setShowModal(true)}>ADD</button>
            </div>

            <hr />

            <div className='friends-box'>
                {
                    chats.length > 0
                        ? chats.map(chat => {
                            return <Friend click={() => openChat(chat)} chat={chat} key={chat.id} />
                        })
                        : <p className='no-chat' style={{ textAlign: 'center'}}>No friends added</p>
                }
            </div>

            {
                showModal &&
                <Modal showModal={showModal} setShowModal={setShowModal} setSearchTerm={setSearchTerm} setSuggestions={setSuggestions}>
                    <Fragment key='header'>
                        <h3 className='m-0'>Create new chat</h3>
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

        </div>
    )
};

export default FriendList;