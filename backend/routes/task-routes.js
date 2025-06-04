// --- START OF FILE task-routes.js ---

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
  taskController.updateChecklistItem // Dùng cho chỉnh sửa subtask
);
router.delete(
  "/checklists/:checklistId", // Thêm route này để xóa subtask
  verifyToken,
  taskController.deleteChecklistItem
);

// Routes for sprints (đã gộp và loại bỏ trùng lặp)
router.get("/sprints", verifyToken, taskController.getSprints);
router.post("/sprints", verifyToken, taskController.createSprint);

// Route for group members
router.get(
  "/group-members-by-project",
  verifyToken,
  taskController.getGroupMembersByProject
);

// Routes for tasks (đã gộp và loại bỏ trùng lặp, thêm route delete)
router.get("/", verifyToken, taskController.getTasks); // Lấy danh sách tasks
router.post("/", verifyToken, taskController.createTask); // Tạo task mới
router.get("/:taskId", verifyToken, taskController.getTaskDetails); // Lấy chi tiết task
router.patch("/:taskId", verifyToken, taskController.updateTask); // Cập nhật task
router.delete("/:taskId", verifyToken, taskController.deleteTask); // Thêm route này để xóa task

module.exports = router;
// --- END OF FILE task-routes.js ---
