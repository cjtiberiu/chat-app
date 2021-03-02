const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Home Screen')
})

router.use('/', require('./auth'));
router.use('/users', require('./user'));
router.use('/chats', require('./chat'));

module.exports = router;