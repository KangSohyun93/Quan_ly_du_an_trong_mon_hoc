// backend/routes/assessment-routes.js
const express = require("express");
const router = express.Router();
const assessmentController = require("../controllers/assessmentController");
const verifyToken = require("../middleware/verify-token");

// Import models
const {
  Group,
  Project,
  Class,
  InstructorEvaluation,
  User,
} = require("../models");

router.get(
  "/groups/:groupId/projects/:projectId/peerassessments/:assessorId",
  assessmentController.getPeerAssessments
);
router.post(
  "/groups/:groupId/projects/:projectId/peerassessments",
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
router.put(
  "/groups/:groupId/projects/:projectId/peerassessments/:assessmentId",
  assessmentController.updateAssessment
);
router.get(
  "/groups/:groupId/projects/:projectId/instructor-evaluations",
  verifyToken,
  async (req, res) => {
    try {
      const { groupId, projectId } = req.params;
      const userId = req.user.id; // Lấy từ token

      console.log("DEBUG: Fetching evaluations for:", { groupId, projectId, userId });

      // Kiểm tra group tồn tại
      const group = await Group.findOne({ where: { group_id: groupId } });
      if (!group) {
        return res.status(404).json({ message: "Không tìm thấy nhóm" });
      }

      // Kiểm tra project tồn tại
      const project = await Project.findOne({
        where: { project_id: projectId, group_id: groupId },
      });
      if (!project) {
        return res.status(404).json({ message: "Không tìm thấy dự án" });
      }

      // Kiểm tra user là giảng viên của lớp chứa nhóm
      const classData = await Class.findOne({
        where: { class_id: group.class_id, instructor_id: userId },
      });
      if (!classData) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      // Lấy đánh giá
      const evaluations = await InstructorEvaluation.findAll({
        where: {
          group_id: groupId,
        },
        include: [
          { model: User, as: "user", attributes: ["username"] },
          { model: User, as: "instructor", attributes: ["username"] },
        ],
      });

      console.log("DEBUG: Evaluations found:", evaluations);
      res.json(evaluations);
    } catch (error) {
      console.error("ERROR: Fetch instructor evaluations:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
);

router.post(
  "/groups/:groupId/projects/:projectId/instructor-evaluations",
  verifyToken,
  assessmentController.saveInstructorEvaluation
);
router.put(
  "/groups/:groupId/projects/:projectId/instructor-evaluations/:evaluationId",
  verifyToken,
  assessmentController.updateInstructorEvaluation
);

module.exports = router;