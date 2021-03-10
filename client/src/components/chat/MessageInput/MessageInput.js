import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MessageInput.css';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import chatService from '../../../services/chatService';
import { incrementScroll } from '../../../store/actions/chat';

const MessageInput = ({ chat }) => {

    // store 
    const socket = useSelector(state => state.chat.socket);
    const user = useSelector(state => state.auth.user);
    const newMessage = useSelector(state => state.chat.newMessage);

    const dispatch = useDispatch();

    // state
    const [message, setMessage] = useState('');
    const [image, setImage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [newMessageNotification, setNewMessageNotification] = useState(false);

    // refs
    const fileUpload = useRef();
    const msgInput = useRef();


    const handleMessage = e => {

        const value = e.target.value;
        setMessage(value);

        // notify other users that this user is typing using sockets
        const receiver = {
            chatID: chat.id,
            from: user,
            to: chat.Users.map(user => user.id)
        }

        if (value.length === 1) {
            receiver.typing = true;
            socket.emit('typing', receiver);
        } 
        
        if (value.length === 0) {
            receiver.typing = false;
            socket.emit('typing', receiver);
        }
    }

    const handleKeyDown = (e, imageUpload) => {

        if (e.keyCode === 13) {
            sendMessage(imageUpload);
        }
    }


    const sendMessage = imageUpload => {

        if (message.length < 1 && !imageUpload) return;

        const msg = {
            type: imageUpload ? 'image' : 'text',
            from: user,
            to: chat.Users.map(user => user.id),
            chatID: chat.id,
            message: imageUpload ? imageUpload : message
        };

        // send message with sockets
        socket.emit('message', msg);

        setMessage('');
        setImage('');
        setShowEmojiPicker(false);
    
    }


    const handleImageUpload = () => {
        const formData = new FormData();
        formData.append('id', chat.id);
        formData.append('image', image);

        // chat service
        chatService.uploadImage(formData)
            .then(imageUrl => {
                console.log(imageUrl);
                sendMessage(imageUrl)
            })
            .catch(err => console.log(err))
    }


    const selectEmoji = emoji => {
        const startPosition = msgInput.current.selectionStart;
        const endPosition = msgInput.current.selectionEnd;
        const emojiLength = emoji.native.length;
        const value = msgInput.current.value;
        
        setMessage(value.substring(0, startPosition) + emoji.native + value.substring(endPosition, value.length));
        msgInput.current.focus();
        msgInput.current.selectionEnd = endPosition + emoji.length;
    }

    useEffect(() => {
        const messageBox = document.querySelector('.msg-box');
        if (!newMessage.seen && newMessage.chatID === chat.id && messageBox.scrollHeight !== messageBox.clientHeight) {
            
            if (messageBox.scrollTop > messageBox.scrollHeight * 0.30) {
                dispatch(incrementScroll());
            } else {
                setNewMessageNotification(true);
            }
        } else {
            setNewMessageNotification(false);
        }
    }, [newMessage, dispatch])

    const showNewMessage = () => {
        // dispatch
        dispatch(incrementScroll())
        setNewMessageNotification(false);
    }

    return (
        <div className='input-container'>
            <div className='image-upload-container'>
                <div>
                    {
                        newMessageNotification ?
                        <div className='message-notification' onClick={showNewMessage}>
                            <FontAwesomeIcon icon='bell' className='fa-icon' />
                            <p className='m-0'>new message</p>
                        </div>  
                        : null
                    }
                </div>

                <div className='image-upload'>
                    {
                        image.name ? 
                        <div className='image-details'>
                            <p className='m-0'>{image.name}</p>
                            <FontAwesomeIcon
                                onClick={handleImageUpload}
                                icon='upload'
                                className='fa-icon'
                            />
                            <FontAwesomeIcon
                                onClick={() => setImage('')}
                                icon='times'
                                className='fa-icon'
                            />
                        </div>
                        : null
                    }
                    <FontAwesomeIcon 
                        onClick={() => fileUpload.current.click()}
                        icon={['fa', 'image']}
                        className='fa-icon'
                    />
                </div>
            </div>
            <div className='message-input'>
                <input
                    ref={msgInput}
                    value={message}
                    type='text'
                    placeholder="Your message here"
                    onChange={e => handleMessage(e)}
                    onKeyDown={e => handleKeyDown(e, false)}
                />
                <FontAwesomeIcon 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    icon={['fa', 'smile']} 
                    className='fa-icon' 
                />
            </div>

            <input className='chat-image' ref={fileUpload} type='file' onChange={e => setImage(e.target.files[0]) } />

            {
                showEmojiPicker ?
                <Picker 
                    title='Pick an emoji...'
                    emoji='point-up'
                    style={{ position: 'absolute', bottom: '20px', right: '20px' }}
                    onSelect={selectEmoji}
                />
                : null
            }
        </div>
    )
};

export default MessageInput;