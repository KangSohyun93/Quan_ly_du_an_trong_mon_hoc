const express = require("express");
const router = express.Router({ mergeParams: true });
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verify-token");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Thư mục lưu file

router.get("/", verifyToken, userController.fetchUser);
router.get("/all", userController.fetchAllUsers);
router.get("/:userId", userController.fetchUserData);
router.put("/:userId", userController.updateUser);
router.post("/", userController.createUser);
router.get("/profile/:userId", verifyToken, userController.getUserProfile);
router.put("/profile/:userId",upload.single('avatar'), verifyToken, userController.updateUserProfile);
router.post("/:userId/change-password", verifyToken, userController.changePassword);

module.exports = router;
