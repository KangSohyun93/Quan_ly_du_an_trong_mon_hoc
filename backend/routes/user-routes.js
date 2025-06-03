const express = require("express");
const router = express.Router({ mergeParams: true });
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verify-token");
const path = require("path");
const multer = require("multer");
const upload = multer({
  dest: path.join(__dirname, "../../frontend/public/uploads"),
}); // Thư mục lưu file

router.get("/", verifyToken, userController.fetchUser);
router.get("/all", userController.fetchAllUsers);
router.get("/profile/:userId", verifyToken, userController.getUserProfile);
router.put(
  "/profile/:userId",
  upload.single("avatar"),
  verifyToken,
  userController.updateUserProfile
);
router.post(
  "/:userId/change-password",
  verifyToken,
  userController.changePassword
);
router.get("/:userId", userController.fetchUserData);
router.put("/:userId", userController.updateUser);
router.post("/", userController.createUser);

module.exports = router;
