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
    },
    uploadImage(data) {
        const headers = { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
        }
        return API.post('/chats/upload-image', data, headers)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                throw err;
            })
    },
    paginateMessages(id, page) {
        return API.get('/chats/messages', {
            params: {
                id, page
            }
        })
            .then(res => {
                return res.data;
            })
            .catch(err => {
                throw err;
            })
    },
    getSuggestions(searchTerm) {
        return API.get(`/users/search`, {
            params: {
                searchTerm
            }
        })
            .then(res => {
                return res.data;
            })
            .catch(err => {
                throw err
            })
    },
    createChat(friendID) {
        return API.post('/chats/create', { friendID })
            .then(res => {
                if (res.status === 200) {
                    return res.data;
                }
                
            })
            .catch(err => {
                throw err;
            })
    },
    addFriendToChat(userID, chatID) {
        return API.post('/chats/add-user', { userID, chatID })
            .then(res => {
                return res.data;
                
            })
            .catch(err => {
                throw err;
            })
    },
    leaveCurrentChat(chatID) {
        return API.post('/chats/leave-chat', { chatID })
            .then(res => {
                return res.data;
                
            })
            .catch(err => {
                throw err;
            })
    },
    deleteCurrentChat(chatID) {
        return API.delete(`/chats/${chatID}`)
            .then(res => {
                return res.data;
                
            })
            .catch(err => {
                throw err;
            })
    }
};

export default chatService;