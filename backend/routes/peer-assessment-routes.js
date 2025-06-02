const express = require("express");
const router = express.Router();
const peerAssessmentController = require("../controllers/peerAssessmentController");
const verifyToken = require("../middleware/verify-token");

router.get(
  "/groups/:groupId/projects/:projectId/peerassessments/:assessorId",
  peerAssessmentController.getPeerAssessments
);
router.post(
  "/groups/:groupId/projects/:projectId/peerassessments",
  peerAssessmentController.saveAssessment
);
router.get(
  "/groups/:groupId/projects/:projectId/task-stats",
  peerAssessmentController.getTaskStats
);
router.get(
  "/groups/:groupId/projects/:projectId/member-task-stats",
  peerAssessmentController.getMemberTaskStats
);
router.put(
  "/groups/:groupId/projects/:projectId/peerassessments/:assessmentId",
  peerAssessmentController.updateAssessment
);
module.exports = router;
