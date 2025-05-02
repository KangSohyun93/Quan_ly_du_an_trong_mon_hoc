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