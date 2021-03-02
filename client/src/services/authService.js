import API from './api';

const authService = {
    login(data) {
        return API.post('/login', data)
            .then(res => {

                setHeadersAndStorage(res.data)
                // returning the response for redux store use
                return res;
            })
            .catch(err => {
                return { ...err };
            })
    },
    register(data) {
        return API.post('/register', data)
            .then(res => {
                setHeadersAndStorage(res.data);

                // returning the response for redux store use
                return res;
            })
            .catch(err => {
                return { ...err };
            })
    },
    logOut() {
        API.defaults.headers['Authorization'] = '';
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },
    updateProfile(data) {
        return API.post('/users/update', data)
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res.data))
                return res;
            })
            .catch(err => {
                return { ...err };
            })
    }
};

const setHeadersAndStorage = ({ user, token } ) => {

    // setting the authorization header for server side use
    API.defaults.headers['Authorization'] = token;

    // setting the user object in local storage
    localStorage.setItem('user', JSON.stringify(user));

    // set tthe token in local storage
    localStorage.setItem('token', token);

}

export default authService;