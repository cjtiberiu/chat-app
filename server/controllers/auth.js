const User = require('../models/').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
    const { username, password } = req.body;    

    try {

        // find the user by username
        const user = await User.findOne({
            where: {
                username
            }
        })

        // check if user found
        if (user) {
            // check if password matches
            const match = await bcrypt.compare(password, user.password) 

            if (match) {
                // generate auth token and return the user data with token
                const userWithToken = generateToken(user.get({raw: true})); // .get({ raw: true }) or user.dataValues is used to get just the raw dataValues from sql object
                userWithToken.avatar = user.avatar;
                return res.send(userWithToken)

            } else {
                return res.status(401).json({ message: 'Incorrect password'} )
            } 
            

        } else {
            return res.status(404).json({ message: 'User not found' })
        }

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.register = async (req, res) => {
    const { username, password } = req.body;

    // check if the same user exists by chechik username field
    const existingUser = await User.findOne({
        where: {
            username
        }
    });

    // if user exists
    if (existingUser) {
        return res.status(401).json({ message: 'Username already exists' })
    }

    // password length validation
    if (password.length < 5) {
        return res.status(401).json({ message: 'Passwords must be at least 5 characters long' })
    }

    try {
        // creating the user using sequelize
        const user = await User.create({ username, password });

        // generate the auth token and return the user data with token
        const userWithToken = generateToken(user.get({raw: true})); // .get({ raw: true }) or user.dataValues is used to get just the raw dataValues from sql object
        userWithToken.avatar = user.avatar;
        return res.send(userWithToken)

    } catch(err) {
        return res.status(500).json({ message: err.message })
    }

}

const generateToken = (user) => {
    // delete user password for frontend use
    delete user.password;

    // generate the token using jwt module
    const token = jwt.sign(user, config.appKey, { expiresIn: 86400 })

    // returning an object with user and token properties
    return { ...{ user }, ...{ token} };
}