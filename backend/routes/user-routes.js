const express = require("express");
const router = express.Router({ mergeParams: true });
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verify-token");

router.get("/", verifyToken, userController.fetchUser);
module.exports = router;
