// --- START OF FILE user-routes.js ---

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// const { protect, isAdmin } = require('../middleware/authMiddleware'); // Sẽ dùng sau khi có auth thực sự

// GET all users & POST create new user
router.route('/')
    .get(/* protect, isAdmin, */ userController.getAllUsers) // Tạm thời bỏ protect, isAdmin
    .post(/* protect, isAdmin, */ userController.createUser); // Tạm thời bỏ protect, isAdmin

// GET user roles
router.get('/roles', /* protect, isAdmin, */ userController.getUserRoles);

// GET, PUT, DELETE specific user by ID
router.route('/:userId')
    .get(/* protect, isAdmin, */ userController.GetUserById)    // Tạm thời bỏ protect, isAdmin
    .put(/* protect, isAdmin, */ userController.updateUser)   // Tạm thời bỏ protect, isAdmin
    .delete(/* protect, isAdmin, */ userController.deleteUser); // Tạm thời bỏ protect, isAdmin

module.exports = router;
// --- END OF FILE user-routes.js ---