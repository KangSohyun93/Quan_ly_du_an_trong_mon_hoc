// backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyToken = require("../middleware/verify-token");

// Routes for comments
router.post("/comments", verifyToken, taskController.addComment);

// Routes for checklists
router.patch(
  "/checklists/:checklistId",
  verifyToken,
  taskController.updateChecklistItem
);

// Routes for projects and sprints
// router.get("/projects", taskController.getProjects);
router.get("/sprints", verifyToken, taskController.getSprints);
router.post("/sprints", verifyToken, taskController.createSprint);

// Route for group members
router.get(
  "/group-members-by-project",
  verifyToken,
  taskController.getGroupMembersByProject
);
// Routes for tasks
router.get("/", verifyToken, taskController.getTasks);
router.get("/:taskId", verifyToken, taskController.getTaskDetails);
router.post("/", verifyToken, taskController.createTask);

router.patch(
  "/checklists/:checklistId",
  verifyToken,
  taskController.updateChecklistItem
);
router.post("/sprints", verifyToken, taskController.createSprint);
router.patch("/:taskId", verifyToken, taskController.updateTask);
// Route for team details
// router.get("/team-details", taskController.getTeamDetails);

module.exports = router;
