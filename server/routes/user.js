const router = require('express').Router();

// controllers imports
const { update, search } = require('../controllers/user');

// middleware
const { auth } = require('../middlewares/auth');
const { userFile } = require('../middlewares/fileUpload');

router.post('/update', auth, userFile, update);
router.get('/search', auth, search);

module.exports = router;