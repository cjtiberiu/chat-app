const router = require('express').Router();

// controllers imports
const { index, create, paginateMessages, imageUpload, deleteChat, addUserToGroup, leaveChat } = require('../controllers/chat');

// middleware
const { auth } = require('../middlewares/auth');
const { chatFile } = require('../middlewares/fileUpload');

router.get('/', auth, index);
router.get('/messages', auth, paginateMessages);
router.delete('/:id', auth, deleteChat);
router.post('/create', auth, create);
router.post('/upload-image', auth, chatFile, imageUpload);
router.post('/add-user', auth, addUserToGroup);
router.post('/leave-chat', auth, leaveChat);

module.exports = router;