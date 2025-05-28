const { Op } = require("sequelize");
const {
  Task,
  TaskChecklist,
  TaskComment,
  Sprint,
  Project,
  User,
  Group,
  Class,
  GroupMember,
} = require("../models");

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const projectId = req.query.projectId ? Number(req.query.projectId) : null;
    const sprintId = req.query.sprintId ? Number(req.query.sprintId) : null;
    const mode = req.query.mode; // "user" | "team"
    const selectedUserId = req.query.selectedUserId
      ? Number(req.query.selectedUserId)
      : null;

    const where = {};

    // Nếu là chế độ user thì lọc theo user
    if (mode === "user") {
      where.assigned_to = selectedUserId;
    }
    // Ưu tiên lọc theo sprint
    if (sprintId !== null && !isNaN(sprintId)) {
      where.sprint_id = sprintId;
    } else if (projectId) {
      // Nếu không có sprintId, lọc theo project
      where["$sprint.project_id$"] = projectId;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: Sprint,
          as: "sprint",
          required: true,
          include: [
            {
              model: Project,
              as: "project",
              required: true,
            },
          ],
        },
        {
          model: TaskChecklist,
          as: "checklists",
        },
        {
          model: TaskComment,
          as: "comments",
          attributes: [], // chỉ dùng để đếm
        },
      ],
      attributes: {
        include: [
          [
            Task.sequelize.literal(`(
              SELECT COUNT(*) FROM TaskComments AS comments
              WHERE comments.task_id = Tasks.task_id
            )`),
            "comment_count",
          ],
        ],
      },
      distinct: true,
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get task details
exports.getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ["user_id", "username"],
        },
        { model: TaskChecklist, as: "checklists" },
        {
          model: TaskComment,
          as: "comments",
          include: [
            { model: User, as: "author", attributes: ["user_id", "username"] },
          ],
        },
      ],
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  const { task_id, comment_text } = req.body;
  const user_id = req.user?.user_id;

  try {
    await TaskComment.create({ task_id, user_id, comment_text });
    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update checklist item
exports.updateChecklistItem = async (req, res) => {
  const { checklistId } = req.params;
  const { is_completed } = req.body;
  const userId = req.user?.user_id;

  try {
    const checklist = await TaskChecklist.findByPk(checklistId, {
      include: { model: Task, as: "task" },
    });

    if (!checklist)
      return res.status(404).json({ message: "Checklist item not found" });
    if (checklist.task.assigned_to !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    checklist.is_completed = is_completed;
    await checklist.save();
    res.status(200).json({ message: "Checklist item updated" });
  } catch (error) {
    console.error("Error updating checklist item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userId = req.user?.user_id;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.assigned_to !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    task.status = status;
    await task.save();
    res.status(200).json({ message: "Task status updated" });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // Get projects
// exports.getProjects = async (req, res) => {
//   try {
//     const projects = await Project.findAll({
//       attributes: ["project_id", "project_name"],
//     });
//     res.status(200).json(projects);
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Get sprints
exports.getSprints = async (req, res) => {
  try {
    const { projectId } = req.query;
    //console.log("projectID: >>>>>>>>:", projectId);
    const sprints = await Sprint.findAll({ where: { project_id: projectId } });
    res.status(200).json(sprints);
  } catch (error) {
    console.error("Error fetching sprints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create sprint
exports.createSprint = async (req, res) => {
  const { sprint_name, start_date, end_date } = req.body;
  const { projectId } = req;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const sprintCount = await Sprint.count({
      where: { project_id: projectId },
    });
    const sprint_number = sprintCount + 1;

    const sprint = await Sprint.create({
      project_id: projectId,
      sprint_number,
      sprint_name,
      start_date,
      end_date,
    });

    res
      .status(201)
      .json({ message: "Sprint created", sprintId: sprint.sprint_id });
  } catch (error) {
    console.error("Error creating sprint:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create task
exports.createTask = async (req, res) => {
  const {
    title,
    description,
    sprint_id,
    due_date,
    status,
    subtasks,
    assigned_to,
  } = req.body;

  try {
    const sprint = await Sprint.findByPk(sprint_id);
    if (!sprint) return res.status(404).json({ message: "Sprint not found" });

    const task = await Task.create({
      title,
      description,
      sprint_id,
      due_date,
      status: status || "To-Do",
      progress_percentage: 0,
      assigned_to,
    });

    if (subtasks?.length) {
      await TaskChecklist.bulkCreate(
        subtasks.map((item_description) => ({
          task_id: task.task_id,
          item_description,
          is_completed: false,
        }))
      );
    }

    res.status(201).json({ message: "Task created", taskId: task.task_id });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get group members by project
exports.getGroupMembersByProject = async (req, res) => {
  try {
    const { projectId } = req;

    const project = await Project.findByPk(projectId, {
      include: {
        model: Group,
        include: {
          model: GroupMember,
          include: { model: User, attributes: ["user_id", "username"] },
        },
      },
    });

    if (!project || !project.Group?.GroupMembers?.length)
      return res.status(404).json({ message: "No group members found" });

    const members = project.Group.GroupMembers.map((gm) => gm.User);
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching group members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // Get team details
// exports.getTeamDetails = async (req, res) => {
//   const { projectId } = req;
//   const userId = req.user?.user_id;

//   try {
//     const project = await Project.findByPk(projectId, {
//       include: {
//         model: Group,
//         include: { model: Class },
//       },
//     });

//     if (!project) return res.status(404).json({ message: "Project not found" });

//     const group = project.Group;
//     const classInfo = group.Class;

//     const members = await User.findAll({
//       include: {
//         model: GroupMember,
//         where: { group_id: group.group_id },
//       },
//     });

//     const isTeamLead = group.leader_id === userId || req.user?.role === "Admin";

//     res.status(200).json({
//       className: classInfo.class_name,
//       classCode: classInfo.secret_code,
//       teamName: group.group_name,
//       projectName: project.project_name,
//       members: members.map((m) => ({
//         user_id: m.user_id,
//         username: m.username,
//       })),
//       isTeamLead,
//     });
//   } catch (error) {
//     console.error("Error fetching team details:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
