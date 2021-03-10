const User = require('../models').User;
const sequelize = require('sequelize');
const config = require('../config/app');

exports.update = async (req, res) => {

    // file returned from multer
    if (req.file) {
        // set to the request body
        req.body.avatar = config.appUrl + ':' + config.appPort + '/user/' +  req.user.id + '/' + req.file.filename
    }
    
    try {
        // updating the user avatar
        const [rows, result] = await User.update(req.body, {
            where: {
                id: req.user.id
            },
            returning: true, // returns the user from db
            individualHooks: true
        })

        const user = result[0].get({ raw: true }) // getting the raw user data from db
        user.avatar = config.appUrl + ':' + config.appPort + '/user/' +  req.user.id + '/' + req.file.filename;
        delete user.password;

        // seting the user obj as a response
        return res.send(user);

    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}

exports.search = async (req, res) => {

    try {

        const users = await User.findAll({
            attributes: ['username', 'id'],
            where: {
                username: {
                    [sequelize.Op.substring]: `${req.query.searchTerm}`,
                },
                [sequelize.Op.not]: {
                    id: req.user.id
                }
            },
            limit: 10
        })

        res.send(users);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

