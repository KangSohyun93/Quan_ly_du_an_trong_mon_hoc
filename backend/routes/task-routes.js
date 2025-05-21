// backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Routes for tasks
router.get("/tasks", taskController.getTasks);
router.get("/tasks/:taskId", taskController.getTaskDetails);
router.post("/tasks", taskController.createTask);
router.patch("/tasks/:taskId/status", taskController.updateTaskStatus);

// Routes for comments
router.post("/comments", taskController.addComment);

// Routes for checklists
router.patch("/checklists/:checklistId", taskController.updateChecklistItem);

// Routes for projects and sprints
router.get("/projects", taskController.getProjects);
router.get("/sprints", taskController.getSprints);
router.post("/sprints", taskController.createSprint);

// Route for group members
router.get("/group-members-by-project", taskController.getGroupMembersByProject);

// Route for team details
router.get("/team-details", taskController.getTeamDetails);

module.exports = router;