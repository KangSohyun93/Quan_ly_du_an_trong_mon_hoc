// backend/routes/task-routes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Route to fetch all tasks
router.get("/tasks", taskController.getTasks);

// Route to update a checklist item
router.patch("/task-checklists/:checklistId", taskController.updateChecklistItem);

// Route to update task status
router.patch("/tasks/:taskId/status", taskController.updateTaskStatus);

// Route to fetch all projects
router.get("/projects", taskController.getProjects);

// Route to create a new task
router.post("/tasks", taskController.createTask);

module.exports = router;