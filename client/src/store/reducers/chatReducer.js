import {
    FETCH_CHATS
} from '../types';

const INITIAL_STATE = {
    chats: [],
    currentChat: {},
}

const chatReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_CHATS:
            return {
                ...state,
                chats: action.payload
            }
        default: 
            return state;
    }
};

export default chatReducer;