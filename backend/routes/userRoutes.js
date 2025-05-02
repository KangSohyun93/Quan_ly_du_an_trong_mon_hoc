const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, changePassword } = require('../controllers/userController');

router.get('/users/:userId', getUserProfile);
router.put('/users/:userId', updateUserProfile);
router.post('/users/:userId/password', changePassword);

module.exports = router;