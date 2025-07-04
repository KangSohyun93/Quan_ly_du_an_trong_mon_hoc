const express = require("express");
const router = express.Router({ mergeParams: true });
const classController = require("../controllers/classController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const verifyToken = require("../middleware/verify-token");

router.post("/join", verifyToken, classController.joinClass);
router.post("/create", verifyToken, classController.createClass);
router.post(
  "/:id/import",
  upload.single("file_class"),
  classController.importClass
);
router.get("/search", verifyToken, classController.searchClass);
router.get("/get-info-class", verifyToken, classController.getClass);
router.get("/instructor", verifyToken, classController.getClassforGV);
router.get("/all", classController.getAllClass);
router.delete("/delete/:id", classController.deleteClass);
router.put("/update/:id", classController.updateClass);
module.exports = router;
