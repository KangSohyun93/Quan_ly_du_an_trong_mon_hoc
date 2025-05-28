const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verify-token');

router.get('/:userId', verifyToken, userController.getUserProfile);
router.put('/:userId', verifyToken, userController.updateUserProfile);
router.post('/:userId/change-password', verifyToken, userController.changePassword);

module.exports = router;