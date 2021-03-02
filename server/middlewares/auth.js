const jwt = require('jsonwebtoken');
const config = require('../config/app');

exports.auth = (req, res, next) => {

    // check for the token in request headers
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token' })
    }

    // verify the token valability using jwt module
    jwt.verify(token, config.appKey, (err, user) => {
        // in case of an error return the error
        if (err) {
            return res.status(401).json({ message: err })
        }

        // set the user in the request object 
        req.user = user;
    })

    next();
}