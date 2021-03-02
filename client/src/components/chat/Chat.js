import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats } from '../../store/actions/chat';
import Navbar from './Navbar/Navbar';

const Chat = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    useEffect(() => {

        dispatch( fetchChats() );
    }, [])


    return (
        <div>
            <Navbar />
            <div className='chat-wrap'>
                
            </div>
        </div>
    )
};

export default Chat;