import authService from '../../services/authService';
import { 
    LOGIN_SUCCES,
    LOGIN_FAIL,
    REGISTER_SUCCES,
    REGISTER_FAIL,
    SET_ERROR_MSG,
    LOGOUT_SUCCES,
    UPDATE_PROFILE_SUCCES
} from '../types';


export const login = (loginData, history) => dispatch => {
    
    // using the response returned by authService.login (as middleware between server) function
    return authService.login(loginData)
        .then(res => {

            // if the response has an error dispatch the error to redux store
            if (res.response) {

                dispatch({ type: LOGIN_FAIL, payload: res.response.data.message }) 

            // if there is no error dispatch set the auth object in store
            } else { 
                
                dispatch({ type: LOGIN_SUCCES, payload: res.data })
                // redirect user to chat
                history.push('/chat');
            } 
        })
};

export const register = (registerData, history) => dispatch => {

    // using the response returned by authService.register (as middleware between server) function
    return authService.register(registerData)
        .then(res => {

            // if the response has an error dispatch the error to redux store
            if (res.response) {

                dispatch({ type: REGISTER_FAIL, payload: res.response.data.message})

            // if there is no error dispatch set the auth object with the new user in store
            } else {
                dispatch({ type: REGISTER_SUCCES, payload: res.data })
                history.push('/chat');
            } 
        })
};


export const setErrorMsg = (msg) => dispatch => {
    return dispatch({ type: SET_ERROR_MSG, payload: msg });
}

export const logout = () => dispatch => {
    // use authService.logout (as middleware between server) function
    authService.logOut();

    // dispatch to redux store
    dispatch({ type: LOGOUT_SUCCES });
}

export const updateProfile = (data) => dispatch => {
    return authService.updateProfile(data)
        .then(res => {
            dispatch({ type: UPDATE_PROFILE_SUCCES, payload: res.data })
        })
        .catch(err => {
            throw err
        })
};