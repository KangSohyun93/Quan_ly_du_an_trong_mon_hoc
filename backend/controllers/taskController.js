// backend/controllers/taskController.js
const mysql = require("mysql2/promise");
const dbConfig = require("../config/db-connect");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Fetch all tasks with their checklists and comment counts
exports.getTasks = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
          t.task_id,
          t.title,
          CASE
            WHEN t.status = 'Done' then t.completed_at
            ELSE t.due_date
          END AS due_date,
          t.status,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'checklist_id', tc.checklist_id,
                  'item_description', tc.item_description,
                  'is_completed', tc.is_completed
              )
          ) as checklists,
          (SELECT COUNT(*) FROM TaskComments tcmt WHERE tcmt.task_id = t.task_id) as comment_count
      FROM Tasks t
      LEFT JOIN TaskChecklists tc ON tc.task_id = t.task_id
      GROUP BY t.task_id
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a checklist item
exports.updateChecklistItem = async (req, res) => {
  const { checklistId } = req.params;
  const { is_completed } = req.body;

  try {
    console.log("Updating checklist item:", { checklistId, is_completed }); // Debug log
    await pool.query(
      "UPDATE TaskChecklists SET is_completed = ? WHERE checklist_id = ?",
      [is_completed, checklistId]
    );
    console.log("Checklist item updated successfully"); // Debug log
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

  try {
    console.log("Updating task status:", { taskId, status }); // Debug log
    await pool.query(
      "UPDATE Tasks SET status = ? WHERE task_id = ?",
      [status, taskId]
    );
    console.log("Task status updated successfully"); // Debug log
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

// Create a new task with subtasks
exports.createTask = async (req, res) => {
  const { title, description, project_id, due_date, status, subtasks } = req.body;

  try {
    // Insert the task into the Tasks table
    const [taskResult] = await pool.query(
      "INSERT INTO Tasks (title, description, project_id, due_date, status) VALUES (?, ?, ?, ?, ?)",
      [title, description || null, project_id, due_date || null, status]
    );
    const taskId = taskResult.insertId;

    // Insert subtasks into the TaskChecklists table
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