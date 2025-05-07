const express = require("express");
const router = express.Router({ mergeParams: true });
const groupController = require("../controllers/groupController");

router.get(
  "/introduce",
  (req, res, next) => {
    console.log(req.params);
    next();
  },
  groupController.group_introduce
);
module.exports = router;
