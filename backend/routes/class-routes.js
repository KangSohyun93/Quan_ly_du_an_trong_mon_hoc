const express = require("express");
const router = express.Router({ mergeParams: true });
const classController = require("../controllers/classController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const verifyToken = require("../middleware/verify-token");

router.post(
  "/:id/instructor",
  upload.single("avatar"),
  classController.importClass
);
router.post("/join", verifyToken, classController.joinClass);
router.get("/", classController.searchClass);
module.exports = router;
