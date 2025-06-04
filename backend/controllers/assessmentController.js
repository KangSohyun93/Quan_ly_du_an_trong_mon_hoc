const {
  GroupMember,
  User,
  PeerAssessment,
  Task,
  Sprint,
  Project,
  Group,
  Class,
  InstructorEvaluation, 
} = require("../models");
const { Op } = require("sequelize");

const getPeerAssessments = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const assessorId = parseInt(req.params.assessorId, 10);
    const groupId = parseInt(req.params.groupId, 10);
    if (
      isNaN(projectId) ||
      projectId <= 0 ||
      isNaN(assessorId) ||
      assessorId <= 0 ||
      isNaN(groupId) ||
      groupId <= 0
    ) {
      return res.status(400).json({
        message: "projectId, groupId và assessorId phải là số nguyên dương",
      });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: "Dự án không tồn tại" });
    }

    if (project.group_id !== groupId) {
      return res.status(400).json({ message: "groupId không khớp với dự án" });
    }

    const isMember = await GroupMember.findOne({
      where: {
        group_id: project.group_id,
        user_id: assessorId,
      },
    });
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Người dùng không thuộc nhóm này" });
    }

    const assessments = await PeerAssessment.findAll({
      where: {
        group_id: project.group_id,
        assessor_id: assessorId,
      },
      include: [
        {
          model: User,
          as: "assessee",
          attributes: ["username"],
        },
      ],
    });

    res.status(200).json(assessments);
  } catch (error) {
    console.error("Lỗi trong getPeerAssessments:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const saveAssessment = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const groupId = parseInt(req.params.groupId, 10);
    const {
      assessor_id,
      assessee_id,
      deadline_score,
      friendly_score,
      quality_score,
      team_support_score,
      responsibility_score,
      note,
    } = req.body;

    if (
      isNaN(projectId) ||
      projectId <= 0 ||
      isNaN(groupId) ||
      groupId <= 0 ||
      !Number.isInteger(assessor_id) ||
      !Number.isInteger(assessee_id) ||
      !Number.isInteger(deadline_score) ||
      deadline_score < 0 ||
      deadline_score > 5 ||
      !Number.isInteger(friendly_score) ||
      friendly_score < 0 ||
      friendly_score > 5 ||
      !Number.isInteger(quality_score) ||
      quality_score < 0 ||
      quality_score > 5 ||
      !Number.isInteger(team_support_score) ||
      team_support_score < 0 ||
      team_support_score > 5 ||
      !Number.isInteger(responsibility_score) ||
      responsibility_score < 0 ||
      responsibility_score > 5
    ) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ: Điểm số phải là số nguyên từ 0 đến 5.",
      });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: "Dự án không tồn tại" });
    }

    if (project.group_id !== groupId) {
      return res.status(400).json({ message: "groupId không khớp với dự án" });
    }

    const [assessorMember, assesseeMember] = await Promise.all([
      GroupMember.findOne({
        where: { group_id: project.group_id, user_id: assessor_id },
      }),
      GroupMember.findOne({
        where: { group_id: project.group_id, user_id: assessee_id },
      }),
    ]);
    if (!assessorMember || !assesseeMember) {
      return res.status(403).json({
        message: "Người đánh giá hoặc người được đánh giá không thuộc nhóm",
      });
    }

    if (assessor_id === assessee_id) {
      return res
        .status(400)
        .json({ message: "Không thể tự đánh giá bản thân" });
    }

    const existingAssessment = await PeerAssessment.findOne({
      where: {
        group_id: project.group_id,
        assessor_id,
        assessee_id,
      },
    });
    if (existingAssessment) {
      return res
        .status(400)
        .json({ message: "Đánh giá đã tồn tại cho người này" });
    }

    await PeerAssessment.create({
      group_id: project.group_id,
      assessor_id,
      assessee_id,
      deadline_score,
      friendly_score,
      quality_score,
      team_support_score,
      responsibility_score,
      note,
    });

    res.status(200).json({ message: "Đánh giá đã được lưu" });
  } catch (error) {
    console.error("Lỗi trong saveAssessment:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (isNaN(projectId) || projectId <= 0) {
      return res
        .status(400)
        .json({ message: "projectId phải là số nguyên dương" });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: "Dự án không tồn tại" });
    }

    const tasks = await Task.findAll({
      include: [
        {
          model: Sprint,
          as: "sprint",
          where: { project_id: projectId },
        },
      ],
    });

    const stats = {
      total: tasks.length,
      toDo: tasks.filter((t) => t.status === "To-Do").length,
      inProgress: tasks.filter((t) => t.status === "In-Progress").length,
      done: tasks.filter((t) => t.status === "Completed").length,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Lỗi trong getTaskStats:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getMemberTaskStats = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(projectId) || projectId <= 0 || isNaN(groupId) || groupId <= 0) {
      return res
        .status(400)
        .json({ message: "projectId và groupId phải là số nguyên dương" });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: "Dự án không tồn tại" });
    }

    if (project.group_id !== groupId) {
      return res.status(400).json({ message: "groupId không khớp với dự án" });
    }

    const members = await GroupMember.findAll({
      where: { group_id: project.group_id },
      include: [
        {
          model: User,
          attributes: ["user_id"],
        },
      ],
    });

    const sprints = await Sprint.findAll({
      where: { project_id: projectId },
      attributes: ["sprint_id"],
    });
    const sprintIds = sprints.map((s) => s.sprint_id);

    const tasks = await Task.findAll({
      where: {
        sprint_id: { [Op.in]: sprintIds },
        assigned_to: { [Op.in]: members.map((m) => m.User.user_id) },
      },
    });

    const stats = members
      .filter((member) => member.User?.user_id)
      .map((member) => {
        const userTasks = tasks.filter(
          (t) => t.assigned_to === member.User.user_id
        );

        return {
          id: member.User.user_id,
          total: userTasks.length,
          toDo: userTasks.filter((t) => t.status === "To-Do").length,
          inProgress: userTasks.filter((t) => t.status === "In-Progress").length,
          done: userTasks.filter((t) => t.status === "Completed").length,
          delayed: userTasks.filter((t) => {
            if (!t.due_date) return false;
            const dueDate = new Date(t.due_date);
            const checkDate =
              t.status === "Completed" && t.completed_at
                ? new Date(t.completed_at)
                : new Date();
            return dueDate < checkDate;
          }).length,
        };
      });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Lỗi trong getMemberTaskStats:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const groupId = parseInt(req.params.groupId, 10);
    const assessmentId = parseInt(req.params.assessmentId, 10);
    const {
      assessor_id,
      assessee_id,
      deadline_score,
      friendly_score,
      quality_score,
      team_support_score,
      responsibility_score,
      note,
    } = req.body;

    if (
      isNaN(projectId) ||
      projectId <= 0 ||
      isNaN(groupId) ||
      groupId <= 0 ||
      isNaN(assessmentId) ||
      assessmentId <= 0 ||
      !Number.isInteger(assessor_id) ||
      !Number.isInteger(assessee_id) ||
      !Number.isInteger(deadline_score) ||
      deadline_score < 0 ||
      deadline_score > 5 ||
      !Number.isInteger(friendly_score) ||
      friendly_score < 0 ||
      friendly_score > 5 ||
      !Number.isInteger(quality_score) ||
      quality_score < 0 ||
      quality_score > 5 ||
      !Number.isInteger(team_support_score) ||
      team_support_score < 0 ||
      team_support_score > 5 ||
      !Number.isInteger(responsibility_score) ||
      responsibility_score < 0 ||
      responsibility_score > 5
    ) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ: Điểm số phải là số nguyên từ 0 đến 5.",
      });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: "Dự án không tồn tại" });
    }

    if (project.group_id !== groupId) {
      return res.status(400).json({ message: "groupId không khớp với dự án" });
    }

    const [assessorMember, assesseeMember] = await Promise.all([
      GroupMember.findOne({
        where: { group_id: project.group_id, user_id: assessor_id },
      }),
      GroupMember.findOne({
        where: { group_id: project.group_id, user_id: assessee_id },
      }),
    ]);
    if (!assessorMember || !assesseeMember) {
      return res.status(403).json({
        message: "Người đánh giá hoặc người được đánh giá không thuộc nhóm",
      });
    }

    if (assessor_id === assessee_id) {
      return res
        .status(400)
        .json({ message: "Không thể tự đánh giá bản thân" });
    }

    const assessment = await PeerAssessment.findOne({
      where: {
        assessment_id: assessmentId,
        group_id: project.group_id,
        assessor_id,
        assessee_id,
      },
    });
    if (!assessment) {
      return res.status(404).json({
        message: "Đánh giá không tồn tại hoặc bạn không có quyền chỉnh sửa",
      });
    }

    await assessment.update({
      deadline_score,
      friendly_score,
      quality_score,
      team_support_score,
      responsibility_score,
      note,
    });

    res.status(200).json({ message: "Đánh giá đã được cập nhật" });
  } catch (error) {
    console.error("Lỗi trong updateAssessment:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getInstructorEvaluations = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const groupId = parseInt(req.params.groupId, 10);

    if (isNaN(projectId) || projectId <= 0 || isNaN(groupId) || groupId <= 0) {
      return res.status(400).json({
        message: "projectId và groupId phải là số nguyên dương",
      });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: "Dự án không tồn tại" });
    }

    if (project.group_id !== groupId) {
      return res.status(400).json({ message: "groupId không khớp với dự án" });
    }

    const evaluations = await InstructorEvaluation.findAll({
      where: {
        group_id: groupId,
      },
      include: [
        { model: User, as: "user", attributes: ["user_id", "username", "avatar"] },
        { model: User, as: "instructor", attributes: ["user_id", "username", "avatar"] },
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(evaluations);
  } catch (error) {
    console.error("Lỗi trong getInstructorEvaluations:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// Sửa đổi: Hàm lưu đánh giá từ giảng viên
const saveInstructorEvaluation = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const groupId = parseInt(req.params.groupId, 10);
    const { user_id, score, comments } = req.body; // user_id is the student being evaluated
    const instructor_id_from_token = req.user.id; // Logged-in instructor's ID from token

    if (
      isNaN(projectId) || projectId <= 0 ||
      isNaN(groupId) || groupId <= 0 ||
      !Number.isInteger(instructor_id_from_token) || // Validate token user id
      !Number.isInteger(user_id) ||
      (score !== null && score !== undefined && (!Number.isInteger(score) || score < 0 || score > 100))
    ) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ. ID phải là số nguyên. Điểm số (nếu có) phải là số nguyên từ 0 đến 100.",
      });
    }

    const project = await Project.findOne({ where: { project_id: projectId, group_id: groupId } });
    if (!project) {
      return res.status(404).json({ message: "Dự án không tồn tại hoặc không thuộc nhóm này." });
    }

    // Verify the user making the request is the instructor of the class associated with the group
    const group = await Group.findOne({
      where: { group_id: groupId },
      include: [{ model: Class, attributes: ['class_id', 'instructor_id'] }]
    });

    if (!group) {
      return res.status(404).json({ message: "Nhóm không tồn tại." });
    }
    if (group.Class.instructor_id !== instructor_id_from_token) {
      return res.status(403).json({ message: "Không có quyền. Bạn không phải là giảng viên của lớp này." });
    }


    const groupMember = await GroupMember.findOne({
      where: { group_id: groupId, user_id },
    });
    if (!groupMember) {
      return res
        .status(403)
        .json({ message: "Người được đánh giá không thuộc nhóm này." });
    }

    const newEvaluation = await InstructorEvaluation.create({
      group_id: groupId,
      instructor_id: instructor_id_from_token, // Use ID from token
      user_id,
      score,
      comments,
    });

    res.status(201).json({ message: "Đánh giá đã được lưu", evaluation: newEvaluation });
  } catch (error) {
    console.error("Lỗi trong saveInstructorEvaluation:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Sửa đổi: Hàm cập nhật đánh giá từ giảng viên
const updateInstructorEvaluation = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const groupId = parseInt(req.params.groupId, 10);
    const evaluationId = parseInt(req.params.evaluationId, 10);
    const { score, comments } = req.body; // user_id from body is not needed if we rely on evaluationId & instructor token
    const instructor_id_from_token = req.user.id;

    if (
      isNaN(projectId) || projectId <= 0 ||
      isNaN(groupId) || groupId <= 0 ||
      isNaN(evaluationId) || evaluationId <= 0 ||
      !Number.isInteger(instructor_id_from_token) ||
      (score !== null && score !== undefined && (!Number.isInteger(score) || score < 0 || score > 100))
    ) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ. ID phải là số nguyên. Điểm số (nếu có) phải là số nguyên từ 0 đến 100.",
      });
    }

    const project = await Project.findOne({ where: { project_id: projectId, group_id: groupId } });
    if (!project) {
      return res.status(404).json({ message: "Dự án không tồn tại hoặc không thuộc nhóm này." });
    }

    // Verify the user making the request is the instructor of the class associated with the group
    const group = await Group.findOne({
      where: { group_id: groupId },
      include: [{ model: Class, attributes: ['class_id', 'instructor_id'] }]
    });

    if (!group) {
      return res.status(404).json({ message: "Nhóm không tồn tại." });
    }
    if (group.Class.instructor_id !== instructor_id_from_token) {
      return res.status(403).json({ message: "Không có quyền. Bạn không phải là giảng viên của lớp này." });
    }

    const evaluation = await InstructorEvaluation.findOne({
      where: {
        evaluation_id: evaluationId,
        group_id: groupId, // Ensure evaluation belongs to the specified group
        instructor_id: instructor_id_from_token, // Ensure instructor owns this evaluation
      },
    });

    if (!evaluation) {
      return res.status(404).json({
        message: "Đánh giá không tồn tại hoặc bạn không có quyền chỉnh sửa cho đánh giá này.",
      });
    }

    await evaluation.update({
      score,
      comments,
    });

    res.status(200).json({ message: "Đánh giá đã được cập nhật", evaluation });
  } catch (error) {
    console.error("Lỗi trong updateInstructorEvaluation:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getPeerAssessments,
  saveAssessment,
  getTaskStats,
  getMemberTaskStats,
  updateAssessment,
  getInstructorEvaluations, // Kept for now, though route logic is preferred
  saveInstructorEvaluation,
  updateInstructorEvaluation,
};