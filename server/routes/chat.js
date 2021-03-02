const router = require('express').Router();

// controllers imports
const { index, create, paginateMessages, deleteChat } = require('../controllers/chat');

// middleware
const { auth } = require('../middlewares/auth');


router.get('/', auth, index);
router.get('/messages', auth, paginateMessages);
router.delete('/:id', auth, deleteChat);
router.post('/create', auth, create);

module.exports = router;