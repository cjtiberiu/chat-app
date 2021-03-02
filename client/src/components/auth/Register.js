import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { register, setErrorMsg } from '../../store/actions/auth';
import loginImage from '../../assets/login.svg';
import { Link } from 'react-router-dom';

import './Auth.css';

const Register = (props) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        dispatch(setErrorMsg(''));
    }, [])

    const onSubmit = e => {
        e.preventDefault();

        if (password === confirmPassword) {
            dispatch(register( { username, password}, props.history ))
        } else {
            dispatch(setErrorMsg('Passwords don\'t match'));
        }
    
            
        
    }

    return (
        <div className='auth-container'>
        <div className='auth-card'>
            <div className='card-shadow'>
                <div className='image-section'>
                    <img src={loginImage} alt='Login' />
                </div>

                <div className='form-section'>
                    <h1>Register</h1>
                    <form onSubmit={onSubmit}>
                        <div className='input-field'>
                            <input 
                                type='text'
                                value={username}
                                required='required'
                                placeholder='username' 
                                onChange={e => setUsername(e.target.value)}>
                            </input>
                        </div>

                        <div className='input-field'>
                            <input 
                                type='password'
                                value={password}
                                required='required'
                                placeholder='password' 
                                onChange={e => setPassword(e.target.value)}>
                            </input>
                        </div>

                        <div className='input-field'>
                            <input 
                                type='password'
                                value={confirmPassword}
                                required='required'
                                placeholder='confirmPassword' 
                                onChange={e => setConfirmPassword(e.target.value)}>
                            </input>                        
                        </div>

                        <button type='submit'>Register</button>
                    </form>

                    <p style={{ color: 'red' }}>{auth.errorMsg}</p>

                    <p>Have an account? <Link to='/login'>Log In</Link></p>
                </div>
            </div>
        </div>
    </div>
    )
};

export default Register;