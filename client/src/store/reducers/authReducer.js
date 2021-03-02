import { 
    LOGIN_SUCCES,
    LOGIN_FAIL,
    REGISTER_SUCCES,
    REGISTER_FAIL,
    SET_ERROR_MSG,
    LOGOUT_SUCCES,
    UPDATE_PROFILE_SUCCES
} from '../types';

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || {},
    token: localStorage.getItem('token') || null,
    isLoggedIn: localStorage.getItem('user') ? true : false,
    errorMsg: ''
}

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_SUCCES:
            console.log(action.payload);
            return { 
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isLoggedIn: true,
                errorMsg: ''
            };
        case LOGIN_FAIL:
            return {
                ...state,
                errorMsg: action.payload
            }
        case REGISTER_FAIL:
            return {
                ...state,
                errorMsg: action.payload
            }
        case REGISTER_SUCCES:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isLoggedIn: true,
                errorMsg: ''
            }
        case SET_ERROR_MSG:
            return {
                ...state,
                errorMsg: action.payload
            }
        case LOGOUT_SUCCES:
            return {
                ...state,
                user: {},
                token: null,
                isLoggedIn: false,
                errorMsg: ''
            }
        case UPDATE_PROFILE_SUCCES:
            return {
                ...state,
                user: action.payload,
            }
        default:
            return state;
    }
};

export default authReducer;