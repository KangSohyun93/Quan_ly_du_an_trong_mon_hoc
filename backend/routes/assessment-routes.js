const express = require("express");
const router = express.Router();
const assessmentController = require("../controllers/assessmentController");
const verifyToken = require("../middleware/verify-token");

router.get(
  "/groups/:groupId/projects/:projectId/assessments/:assessorId",
  assessmentController.getPeerAssessments
);
router.post(
  "/groups/:groupId/projects/:projectId/assessments",
  assessmentController.saveAssessment
);
router.get(
  "/groups/:groupId/projects/:projectId/task-stats",
  assessmentController.getTaskStats
);
router.get(
  "/groups/:groupId/projects/:projectId/member-task-stats",
  assessmentController.getMemberTaskStats
);

module.exports = router;
