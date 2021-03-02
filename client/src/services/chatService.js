import API from './api';

const chatService = {

    fetchChats() {
        return API.get('/chats')
            .then(res => {
                return res.data;
            })
            .catch(err => {
                throw err;
            })
    }
};

export default chatService;