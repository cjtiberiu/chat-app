import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import loginImage from '../../assets/login.svg';

import { login, setErrorMsg } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';

import './Auth.css';

const Login = (props) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // if (auth.user) {
    //     props.history.push('/chat')
    // }

    useEffect(() => {
        dispatch(setErrorMsg(''));
    }, [])

    const onSubmit = e => {
        e.preventDefault();

        dispatch(login({ username, password }, props.history));
    }

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <div className='card-shadow'>
                    <div className='image-section'>
                        <img src={loginImage} alt='Login' />
                    </div>

                    <div className='form-section'>
                        <h1>Welcome</h1>
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

                            <button type='submit'>Log In</button>
                        </form>

                        <p style={{ color: 'red' }}>{auth.errorMsg}</p>

                        <p>Don't have an account? <Link to='/register'>Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;