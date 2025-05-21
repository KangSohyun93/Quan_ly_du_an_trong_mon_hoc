// backend/controllers/taskController.js
const mysql = require("mysql2/promise");
const dbConfig = require("../config/db-connect");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Hard-coded user ID and project ID for testing (replace with actual authentication in production)
const getCurrentUserId = () => 1; // Hard-coded user_id = 1
const getCurrentProjectId = () => 1; // Hard-coded project_id = 1

// Fetch tasks with their checklists, comment counts, and progress_percentage
exports.getTasks = async (req, res) => {
  try {
    const projectId = getCurrentProjectId();
    const userId = getCurrentUserId();
    const { mode } = req.query; // "user" for Team task, "all" for My task

    let query = `
      SELECT 
          t.task_id,
          t.title,
          CASE
            WHEN t.status = 'Completed' THEN t.completed_at
            ELSE t.due_date
          END AS due_date,
          t.status,
          t.progress_percentage,
          t.assigned_to,
          t.sprint_id,
          IFNULL(
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'checklist_id', tc.checklist_id,
                  'item_description', tc.item_description,
                  'is_completed', tc.is_completed
                )
              )
              FROM TaskChecklists tc
              WHERE tc.task_id = t.task_id
            ),
            JSON_ARRAY()
          ) AS checklists,
          (SELECT COUNT(*) FROM TaskComments tcmt WHERE tcmt.task_id = t.task_id) AS comment_count
      FROM Tasks t
      JOIN Sprints s ON t.sprint_id = s.sprint_id
      JOIN Projects p ON s.project_id = p.project_id
      WHERE p.project_id = ?
    `;
    const params = [projectId];

    if (mode === "user") {
      query += " AND t.assigned_to = ?";
      params.push(userId);
    }

    query += " GROUP BY t.task_id";

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch task details with subtasks and comments
exports.getTaskDetails = async (req, res) => {
  const { taskId } = req.params;
  try {
    const [task] = await pool.query(`
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.assigned_to,
        u.username AS assigned_username,
        IFNULL(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'checklist_id', tc.checklist_id,
                'item_description', tc.item_description,
                'is_completed', tc.is_completed
              )
            )
            FROM TaskChecklists tc
            WHERE tc.task_id = t.task_id
          ),
          JSON_ARRAY()
        ) AS checklists,
        IFNULL(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'comment_id', tcmt.comment_id,
                'user_id', tcmt.user_id,
                'username', u2.username,
                'comment_text', tcmt.comment_text,
                'created_at', tcmt.created_at
              )
            )
            FROM TaskComments tcmt
            JOIN Users u2 ON tcmt.user_id = u2.user_id
            WHERE tcmt.task_id = t.task_id
          ),
          JSON_ARRAY()
        ) AS comments
      FROM Tasks t
      LEFT JOIN Users u ON t.assigned_to = u.user_id
      WHERE t.task_id = ?
    `, [taskId]);

    if (!task || task.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task[0]);
  } catch (error) {
    console.error("Error fetching task details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new comment
exports.addComment = async (req, res) => {
  const { task_id, user_id, comment_text } = req.body;
  try {
    await pool.query(
      "INSERT INTO TaskComments (task_id, user_id, comment_text) VALUES (?, ?, ?)",
      [task_id, user_id, comment_text]
    );
    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a checklist item (progress_percentage and status are handled by DB triggers)
exports.updateChecklistItem = async (req, res) => {
  const { checklistId } = req.params;
  const { is_completed } = req.body;
  const currentUserId = getCurrentUserId();

  try {
    const [task] = await pool.query(`
      SELECT t.assigned_to
      FROM TaskChecklists tc
      JOIN Tasks t ON tc.task_id = t.task_id
      WHERE tc.checklist_id = ?
    `, [checklistId]);

    if (!task || task.length === 0) {
      return res.status(404).json({ message: "Checklist item not found" });
    }

    if (task[0].assigned_to !== currentUserId) {
      return res.status(403).json({ message: "Only the assigned user can update this checklist item" });
    }

    await pool.query(
      "UPDATE TaskChecklists SET is_completed = ? WHERE checklist_id = ?",
      [is_completed, checklistId]
    );

    res.status(200).json({ message: "Checklist item updated" });
  } catch (error) {
    console.error("Error updating checklist item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task status (progress_percentage is handled by DB triggers)
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const currentUserId = getCurrentUserId();

  try {
    const [task] = await pool.query(
      "SELECT assigned_to FROM Tasks WHERE task_id = ?",
      [taskId]
    );

    if (!task || task.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task[0].assigned_to !== currentUserId) {
      return res.status(403).json({ message: "Only the assigned user can update this task" });
    }

    await pool.query(
      "UPDATE Tasks SET status = ? WHERE task_id = ?",
      [status, taskId]
    );
    res.status(200).json({ message: "Task status updated" });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all projects
exports.getProjects = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT project_id, project_name FROM Projects");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all sprints
exports.getSprints = async (req, res) => {
  try {
    const projectId = 1; // Fix cứng project_id
    const [rows] = await pool.query(
      "SELECT sprint_id, sprint_name, sprint_number, project_id FROM Sprints WHERE project_id = ?",
      [projectId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching sprints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new sprint
exports.createSprint = async (req, res) => {
  const { project_id, sprint_name, start_date, end_date } = req.body;

  try {
    // Validate project_id
    const [project] = await pool.query(
      "SELECT project_id FROM Projects WHERE project_id = ?",
      [project_id]
    );

    if (!project || project.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Insert new sprint
    const [result] = await pool.query(
      "INSERT INTO Sprints (project_id, sprint_name, start_date, end_date) VALUES (?, ?, ?, ?)",
      [project_id, sprint_name || null, start_date || null, end_date || null]
    );

    res.status(201).json({ message: "Sprint created successfully", sprintId: result.insertId });
  } catch (error) {
    console.error("Error creating sprint:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task with subtasks
exports.createTask = async (req, res) => {
  const { title, description, sprint_id, due_date, status, subtasks, assigned_to } = req.body;

  try {
    // Kiểm tra sprint_id có tồn tại không
    const [sprint] = await pool.query(
      "SELECT sprint_id FROM Sprints WHERE sprint_id = ?",
      [sprint_id]
    );

    if (!sprint || sprint.length === 0) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    // Tạo task mới
    const [taskResult] = await pool.query(
      "INSERT INTO Tasks (title, description, sprint_id, due_date, status, progress_percentage, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description || null, sprint_id, due_date || null, status || 'To-Do', 0, assigned_to || null]
    );
    const taskId = taskResult.insertId;

    // Thêm subtasks nếu có
    if (subtasks && subtasks.length > 0) {
      const subtaskValues = subtasks.map((subtask) => [taskId, subtask, false]);
      await pool.query(
        "INSERT INTO TaskChecklists (task_id, item_description, is_completed) VALUES ?",
        [subtaskValues]
      );
    }

    res.status(201).json({ message: "Task created successfully", taskId });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch group members by project
exports.getGroupMembersByProject = async (req, res) => {
  try {
    const projectId = 1; // Fix cứng project_id = 1
    const [rows] = await pool.query(
      `SELECT u.user_id, u.username
       FROM Users u
       JOIN GroupMembers gm ON u.user_id = gm.user_id
       JOIN Projects p ON gm.group_id = p.group_id
       WHERE p.project_id = ?`,
      [projectId]
    );
    console.log("Group members fetched:", rows);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No group members found for this project" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching group members by project:", error);
    res.status(500).json({ message: "Server error" });
  }
};