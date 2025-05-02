// backend/routes/task-routes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Route to fetch all tasks
router.get("/tasks", taskController.getTasks);

// Route to update a checklist item
router.patch("/task-checklists/:checklistId", taskController.updateChecklistItem);

module.exports = router;