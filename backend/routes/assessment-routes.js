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
  GroupMember, // Added for student check
} = require("./models");

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

// Modified route to fetch instructor evaluations based on user role
router.get(
  "/groups/:groupId/projects/:projectId/instructor-evaluations",
  verifyToken,
  async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId, 10);
      const projectId = parseInt(req.params.projectId, 10);
      const loggedInUserId = req.user.id;
      const loggedInUserRole = req.user.role;

      if (isNaN(groupId) || groupId <= 0 || isNaN(projectId) || projectId <= 0) {
        return res.status(400).json({ message: "ID nhóm và dự án phải là số nguyên dương." });
      }

      console.log("DEBUG: Fetching evaluations for:", { groupId, projectId, loggedInUserId, loggedInUserRole });

      const group = await Group.findOne({
        where: { group_id: groupId },
        include: [{ model: Class, attributes: ['class_id', 'instructor_id'] }]
      });
      if (!group) {
        return res.status(404).json({ message: "Không tìm thấy nhóm." });
      }

      const project = await Project.findOne({
        where: { project_id: projectId, group_id: groupId },
      });
      if (!project) {
        return res.status(404).json({ message: "Không tìm thấy dự án hoặc dự án không thuộc nhóm này." });
      }

      let evaluations;
      const includeOptions = [
        { model: User, as: "user", attributes: ["user_id", "username", "avatar"] }, // Student being evaluated
        { model: User, as: "instructor", attributes: ["user_id", "username", "avatar"] }, // Instructor who made the evaluation
      ];

      if (loggedInUserRole === "Instructor") {
        // Check if the logged-in user is the instructor of the class this group belongs to
        if (group.Class.instructor_id !== loggedInUserId) {
          return res.status(403).json({ message: "Không có quyền truy cập. Bạn không phải là giảng viên của lớp này." });
        }
        // Instructor sees all evaluations they made for this group
        evaluations = await InstructorEvaluation.findAll({
          where: {
            group_id: groupId,
            instructor_id: loggedInUserId, // Evaluations made by this instructor
          },
          include: includeOptions,
          order: [['user_id', 'ASC'], ['created_at', 'DESC']] // Show per student, latest first
        });
      } else if (loggedInUserRole === "Student") {
        // Check if the logged-in student is a member of the group
        const isMember = await GroupMember.findOne({
          where: { group_id: groupId, user_id: loggedInUserId },
        });
        if (!isMember) {
          return res.status(403).json({ message: "Không có quyền truy cập. Bạn không phải là thành viên của nhóm này." });
        }
        // Student sees evaluations made for them in this group by any instructor
        evaluations = await InstructorEvaluation.findAll({
          where: {
            group_id: groupId,
            user_id: loggedInUserId, // Evaluations for this student
          },
          include: includeOptions,
          order: [['created_at', 'DESC']] // Show latest first
        });
      } else {
        return res.status(403).json({ message: "Vai trò người dùng không hợp lệ để xem đánh giá này." });
      }

      console.log("DEBUG: Evaluations found:", evaluations.length);
      res.json(evaluations);
    } catch (error) {
      console.error("ERROR: Fetch instructor evaluations:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
);

router.post(
  "/groups/:groupId/projects/:projectId/instructor-evaluations",
  verifyToken, // Ensures req.user.id and req.user.role are available
  assessmentController.saveInstructorEvaluation // Controller will use req.user.id as instructor_id
);
router.put(
  "/groups/:groupId/projects/:projectId/instructor-evaluations/:evaluationId",
  verifyToken, // Ensures req.user.id is available
  assessmentController.updateInstructorEvaluation // Controller will use req.user.id to verify ownership
);

module.exports = router;