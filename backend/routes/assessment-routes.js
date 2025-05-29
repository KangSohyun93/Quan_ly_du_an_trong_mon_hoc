const express = require("express");
const router = express.Router();
const assessmentController = require("../controllers/assessmentController");
const verifyToken = require("../middleware/verify-token");

router.get(
  "/groups/:groupId/projects/:projectId/assessments/:assessorId",
  verifyToken,
  assessmentController.getPeerAssessments
);
router.post(
  "/groups/:groupId/projects/:projectId/assessments",
  verifyToken,
  assessmentController.saveAssessment
);
router.get(
  "/groups/:groupId/projects/:projectId/task-stats",
  verifyToken,
  assessmentController.getTaskStats
);
router.get(
  "/groups/:groupId/projects/:projectId/member-task-stats",
  verifyToken,
  assessmentController.getMemberTaskStats
);

module.exports = router;
