const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation');

// controllers imports
const { login, register } = require('../controllers/auth');

router.post('/login', validate, login);

router.post('/register', [
    body('username').notEmpty(),
    body('password').notEmpty(),
], validate, register);



module.exports = router;