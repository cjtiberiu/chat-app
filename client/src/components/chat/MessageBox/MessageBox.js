import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../Message/Message';
import { paginateMessages } from '../../../store/actions/chat';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MessageBox.css';

const MessageBox = ({ chat }) => {

    // store
    const user = useSelector(state => state.auth.user);
    const scrollBottom = useSelector(state => state.chat.scrollBottom);
    const senderTyping = useSelector(state => state.chat.senderTyping);

    const dispatch = useDispatch();

    // state
    const [loading, setLoading] = useState(false);
    const [scrollUp, setScrollUp] = useState(0);

    // refs
    const messageBox = useRef();


    const scrollToBottom = value => {
        messageBox.current.scrollTop = value;
    }

    const handleInfiniteScroll = e => {

        if (e.target.scrollTop === 0) {

            setLoading(true);

            //get and check if pagination exists from db fetch
            const pagination = chat.Pagination;
            const page = typeof pagination === 'undefined' ? 1 : pagination.page

            // dispatch
            dispatch( paginateMessages(chat.id, parseInt(page) + 1))
                .then(res => {
                    if (res) {
                        setScrollUp(scrollUp + 1);
                    }
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                })
        }
    }

    

    // 10 percent scroll bottom when new messages load
    useEffect(() => {
        setTimeout(() => {
            scrollToBottom(Math.ceil(messageBox.current.scrollHeight * 0.10))
        }, 100)
    }, [scrollUp])


    // automatically scroll to bottom if user is only 30% from bottom
    // useEffect(() => {
    //     if (senderTyping.typing && messageBox.current.scrollTop . messageBox.current.scrollHeight * 0.3) {
    //         setTimeout(() => {
    //             scrollToBottom(0)
    //         }, 100)
    //     }
    // }, [senderTyping])

    useEffect(() => {
        setTimeout(() => {
            scrollToBottom(messageBox.current.scrollHeight)
        }, 100)
    }, [scrollBottom])

    return (
        <div className='msg-box' ref={messageBox} onScroll={handleInfiniteScroll}>
            {
                loading
                ? <p className='loader m-0'><FontAwesomeIcon icon='spinner' className='fa-spin' /></p>
                : null
                
            }
            {
                chat.Messages.map((message, index) => {
                    return <Message 
                        user={user}
                        key={message.id} 
                        chat={chat} 
                        index={index} 
                        message={message} 
                    />
                })
            }
            {
                senderTyping.typing && senderTyping.chatID === chat.id ?
                <div className='message'>
                    <div className='other-person'>
                        <p className='m-0'>{senderTyping.from.username} typing...</p>
                    </div>
                </div>
                : null
            }
        </div>
    )
};

export default MessageBox;