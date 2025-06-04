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

exports.getTasks = async (req, res) => {
  try {
    const projectId = req.query.projectId ? Number(req.query.projectId) : null;
    const sprintId = req.query.sprintId ? Number(req.query.sprintId) : null;
    const mode = req.query.mode;
    const selectedUserId = req.query.selectedUserId
      ? Number(req.query.selectedUserId)
      : req.userId;

    console.log("Fetching tasks:", { projectId, sprintId, mode, selectedUserId });

    const where = {};

    if (mode === "user") {
      where.assigned_to = selectedUserId;
    }
    if (sprintId !== null && !isNaN(sprintId)) {
      where.sprint_id = sprintId;
    } else if (projectId) {
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
          attributes: [],
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

    console.log("Tasks fetched:", tasks.length);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    console.log("Fetching task details for taskId:", taskId);

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

    if (!task) {
      console.log("Task not found for taskId:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }
    console.log("Task details fetched:", { task_id: task.task_id, title: task.title, assigned_to: task.assigned_to });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task details:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.addComment = async (req, res) => {
  const { task_id, comment_text, user_id } = req.body;
  console.log("Adding comment:", { task_id, user_id });

  try {
    const task = await Task.findByPk(task_id);
    if (!task) {
      console.log("Task not found:", task_id);
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = await TaskComment.create({ task_id, user_id, comment_text });
    console.log("Comment added:", comment.comment_id);
    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// taskController.js
exports.updateChecklistItem = async (req, res) => {
  const { checklistId } = req.params;
  // Lấy is_completed và item_description từ req.body một cách cẩn thận
  const is_completed = req.body.hasOwnProperty('is_completed') ? req.body.is_completed : undefined;
  const item_description = req.body.hasOwnProperty('item_description') ? req.body.item_description : undefined;
  const userId = req.userId;
  const isUserTeamLead = req.isTeamLead; // Được set bởi verifyToken middleware

  // LOG QUAN TRỌNG ĐỂ DEBUG
  console.log("\n--- SERVER LOG: Inside updateChecklistItem ---");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request received for checklistId:", checklistId);
  console.log("Request body received:", JSON.stringify(req.body));
  console.log("Parsed is_completed:", is_completed, "(type:", typeof is_completed, ")");
  console.log("Parsed item_description:", item_description, "(type:", typeof item_description, ")");
  console.log("User ID from token:", userId);
  console.log("Is User Team Lead (from verifyToken middleware):", isUserTeamLead);
  // KẾT THÚC LOG QUAN TRỌNG

  try {
    const checklist = await TaskChecklist.findByPk(checklistId, {
      include: [{ model: Task, as: "task" }],
    });

    if (!checklist) {
      console.log("SERVER LOG: Checklist item not found for ID:", checklistId);
      return res.status(404).json({ message: "Checklist item not found" });
    }
    console.log("SERVER LOG: Found checklist item. Task assigned to:", checklist.task.assigned_to);

    let needsSave = false;

    // Trường hợp 1: Cập nhật item_description (chỉ team lead)
    if (item_description !== undefined) { // Chỉ xử lý nếu item_description được cung cấp
      console.log("SERVER LOG: Attempting to update item_description to:", item_description);
      if (!isUserTeamLead) {
        console.log(`SERVER LOG: User ${userId} is NOT a team lead. Denying update for item_description.`);
        return res.status(403).json({ message: "Only team leads can edit subtask descriptions." });
      }
      console.log(`SERVER LOG: User ${userId} IS a team lead. Allowing update for item_description.`);
      checklist.item_description = item_description;
      needsSave = true;
    }

    // Trường hợp 2: Cập nhật is_completed (chỉ người được giao)
    if (is_completed !== undefined) { // Chỉ xử lý nếu is_completed được cung cấp
      console.log("SERVER LOG: Attempting to update is_completed to:", is_completed);
      if (typeof is_completed !== 'boolean') {
         console.log("SERVER LOG: Invalid is_completed value provided. Must be boolean. Received:", is_completed);
         return res.status(400).json({ message: "Invalid is_completed value. Must be boolean."});
      }
      if (checklist.task.assigned_to !== userId) {
        // Nếu muốn team lead cũng có thể tick:
        // if (checklist.task.assigned_to !== userId && !isUserTeamLead) {
        console.log(`SERVER LOG: User ${userId} is NOT assigned to this task (assigned to ${checklist.task.assigned_to}). Denying update for is_completed.`);
        return res.status(403).json({ message: "Only the assigned user can update subtask completion status." });
      }
      console.log(`SERVER LOG: User ${userId} IS assigned to this task. Allowing update for is_completed.`);
      checklist.is_completed = is_completed;
      needsSave = true;
    }

    if (!needsSave) {
      // Điều này xảy ra nếu client gửi body rỗng hoặc body không chứa is_completed hoặc item_description
      console.log("SERVER LOG: No valid data provided for update (neither is_completed nor item_description was present or valid).");
      return res.status(400).json({ message: "No valid data for update. Provide 'is_completed' or 'item_description'." });
    }

    await checklist.save();
    console.log("SERVER LOG: Checklist item updated successfully for ID:", checklistId);
    res.status(200).json({ message: "Checklist item updated successfully." });

  } catch (error) {
    console.error("SERVER LOG: Error updating checklist item:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
exports.deleteChecklistItem = async (req, res) => {
  const { checklistId } = req.params;
  const isTeamLead = req.isTeamLead;

  console.log("Deleting checklist item:", { checklistId, isTeamLead });

  try {
    const checklist = await TaskChecklist.findByPk(checklistId);
    if (!checklist) {
      console.log("Checklist item not found:", checklistId);
      return res.status(404).json({ message: "Checklist item not found" });
    }
    if (!isTeamLead) {
      console.log("Unauthorized: Not a team lead");
      return res.status(403).json({ message: "Only team leads can delete subtasks" });
    }

    await checklist.destroy();
    console.log("Checklist item deleted:", checklistId);
    res.status(200).json({ message: "Checklist item deleted" });
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { status, progress_percentage } = req.body;
  const userId = req.userId;

  console.log("Updating task:", { taskId, status, progress_percentage, userId });

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      console.log("Task not found:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.assigned_to !== userId) {
      console.log("Unauthorized: User is not assigned to task", { userId, assignedTo: task.assigned_to });
      return res.status(403).json({ message: "Only assigned users can update tasks" });
    }

    if (status !== undefined) task.status = status;
    if (progress_percentage !== undefined) task.progress_percentage = progress_percentage;

    await task.save();
    console.log("Task updated:", taskId);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const isTeamLead = req.isTeamLead;

  console.log("Deleting task:", { taskId, isTeamLead });

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      console.log("Task not found:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }
    if (!isTeamLead) {
      console.log("Unauthorized: Not a team lead");
      return res.status(403).json({ message: "Only team leads can delete tasks" });
    }

    await task.destroy();
    console.log("Task deleted:", taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getSprints = async (req, res) => {
  try {
    const { projectId } = req.query;
    console.log("Fetching sprints for projectId:", projectId);

    const sprints = await Sprint.findAll({ where: { project_id: projectId } });
    console.log("Sprints fetched:", sprints.length);
    res.status(200).json(sprints);
  } catch (error) {
    console.error("Error fetching sprints:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.createSprint = async (req, res) => {
  const { project_id, sprint_name, start_date, end_date } = req.body;
  console.log("Creating sprint:", { project_id, sprint_name });

  try {
    const project = await Project.findByPk(project_id);
    if (!project) {
      console.log("Project not found:", project_id);
      return res.status(404).json({ message: "Project not found" });
    }

    const sprintCount = await Sprint.count({ where: { project_id } });
    const sprint_number = sprintCount + 1;

    const sprint = await Sprint.create({
      project_id,
      sprint_number,
      sprint_name,
      start_date,
      end_date,
    });

    console.log("Sprint created:", sprint.sprint_id);
    res.status(201).json({ message: "Sprint created", sprintId: sprint.sprint_id });
  } catch (error) {
    console.error("Error creating sprint:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, sprint_id, due_date, status, subtasks, assigned_to } = req.body;
  console.log("Creating task:", { title, sprint_id, assigned_to });

  try {
    const sprint = await Sprint.findByPk(sprint_id);
    if (!sprint) {
      console.log("Sprint not found:", sprint_id);
      return res.status(404).json({ message: "Sprint not found" });
    }

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

    console.log("Task created:", task.task_id);
    res.status(201).json({ message: "Task created", taskId: task.task_id });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getGroupMembersByProject = async (req, res) => {
  try {
    const { projectId } = req.query;
    console.log("Fetching group members for projectId:", projectId);

    const project = await Project.findByPk(projectId, {
      include: {
        model: Group,
        include: {
          model: GroupMember,
          include: { model: User, attributes: ["user_id", "username"] },
        },
      },
    });

    if (!project || !project.Group?.GroupMembers?.length) {
      console.log("No group members found for projectId:", projectId);
      return res.status(404).json({ message: "No group members found" });
    }

    const members = project.Group.GroupMembers.map((gm) => gm.User);
    console.log("Group members fetched:", members.length);
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching group members:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
