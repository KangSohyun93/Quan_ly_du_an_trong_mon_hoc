const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', /* isAdmin, */ userController.getAllUsers);

router.delete('/:userId', /* isAdmin, */ userController.deleteUser);

module.exports = router;