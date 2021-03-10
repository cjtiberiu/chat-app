import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../store/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../Modal/Modal';
import { updateProfile } from '../../../store/actions/auth';

import './Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [showNav, setShowNav] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [avatar, setAvatar] = useState('');

    
    // updating the user profile form
    const onSubmit = (e) => {
        e.preventDefault();

        const form = { avatar };

        const formData = new FormData();

        for (const key in form) {
            formData.append(key, form[key])
        }

        dispatch(updateProfile(formData, user.token)).then(() => setShowModal(false))
    }

    return (
        <div className='navbar'>
            <h2>chat</h2>
            <div className='profile-menu' onClick={() => setShowNav(!showNav)}>
                <img width='40' height='40' src={user.avatar} alt='profile' />
                <div>{user.username}</div>
                <FontAwesomeIcon icon='caret-down' className='fa-icon' />

                <div className='profile-dropdown' style={{ display: `${showNav ? 'block' : 'none'}`}}>
                    <div onClick={() => setShowModal(true)}>Update Profile</div>
                    <div onClick={() => dispatch(logout())}>Logout</div>
                </div>

                {showModal ? (
                    <Modal setShowModal={setShowModal} showModal={showModal} onSubmit={onSubmit}>

                        <Fragment key='header'>
                            <h3 className='m-0'>Update Profile</h3>
                        </Fragment>

                        <Fragment key='body'>
                            <form onSubmit={onSubmit}>
                                
                                <div className='input-field' style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center'}}>
                                    <div>Avatar</div>
                                    <img width='130' height='130' src={user.avatar} alt='profile' style={{ borderRadius: '50%'}} />
                                    <input 
                                        type='file'
                                        onChange={e => setAvatar(e.target.files[0])}>
                                    </input>                            
                                </div>

                            </form>
                        </Fragment>

                        <Fragment key='footer'>
                            <button className='modal-close' onClick={(e) => onSubmit(e)}>Update</button>
                        </Fragment>

                    </Modal>
                ) : null
                }
            </div>

            
        </div>
    )
};

export default Navbar;