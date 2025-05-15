const express = require("express");
const router = express.Router({ mergeParams: true });
const groupController = require("../controllers/groupController");

router.get("/introduce",groupController.group_introduce);
module.exports = router;
