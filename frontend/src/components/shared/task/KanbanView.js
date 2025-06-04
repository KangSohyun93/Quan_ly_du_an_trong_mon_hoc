import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle as fasCheckCircle,
  faClipboard,
  faComment,
  faClock,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import {
  fetchTasks,
  updateChecklistItem,
  updateTask,
  deleteChecklistItem,
  deleteTask,
  fetchTaskDetails,
} from "../../../services/api-client";
import CreateTask from "./CreateTask";
import TaskCommentPage from "./TaskCommentPage";
import { filterTasksByUser } from "./UserFilter";
import { useOutletContext } from "react-router-dom";
import "./KanbanView.css";

const KanbanView = ({ sprints }) => {
  const {
    activeTab,
    members,
    isTeamLead,
    currentUserId,
    projectId,
    selectedUserId,
    selectedSprintId,
  } = useOutletContext();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCommentPage, setShowCommentPage] = useState(null);

  const statusMap = {
    "to-do": "To-Do",
    todo: "To-Do",
    "To-Do": "To-Do",
    "in-progress": "In-Progress",
    "In-Progress": "In-Progress",
    done: "Completed",
    completed: "Completed",
    Completed: "Completed",
  };

  const loadTasks = async () => {
    if (!projectId || selectedSprintId === null) return;

    try {
      const isTeamTask = activeTab === "team-task";
      let selectedUserIdToUse = isTeamTask ? selectedUserId || null : userId;
      const mode = isTeamTask
        ? !selectedUserIdToUse
          ? "all"
          : "user"
        : "user";
      console.log("Loading tasks with params:", { mode, projectId, selectedSprintId, selectedUserIdToUse, userId, currentUserId });
      const data = await fetchTasks(
        mode,
        projectId,
        selectedSprintId,
        selectedUserIdToUse
      );
      console.log("Fetched tasks:", data.map(t => ({ task_id: t.task_id, title: t.title, assigned_to: t.assigned_to })));
      const currentDate = new Date();

      const mapped = data.map((task) => {
        const user = members?.find((m) => m.id === task.assigned_to) || {};
        const normalizedStatus = (task.status || "").toLowerCase();
        const finalStatus = statusMap[normalizedStatus] || "To-Do";

        return {
          id: task.task_id,
          title: task.title,
          date: task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : "",
          time: task.due_date
            ? new Date(task.due_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          tags: ["SQL", "Backend"],
          avatar: user.avatarUrl || "/default-avatar.png",
          comments: task.comment_count || 0,
          subTasks: (task.checklists || []).map((c) => ({
            id: c.checklist_id,
            text: c.item_description,
            completed: c.is_completed,
          })),
          status: finalStatus,
          overdue:
            task.due_date &&
            new Date(task.due_date) < currentDate &&
            finalStatus !== "Completed",
          progress_percentage: task.progress_percentage || 0,
          assigned_to: task.assigned_to,
          sprint_id: task.sprint_id,
          due_date: task.due_date ? new Date(task.due_date) : null,
        };
      });

      const sorted = mapped.sort((a, b) => {
        const dateA = a.due_date ? a.due_date.getTime() : Infinity;
        const dateB = b.due_date ? b.due_date.getTime() : Infinity;
        return dateA - dateB;
      });

      setTasks(sorted);
      const filteredByUser = filterTasksByUser(sorted, selectedUserId);
      setFilteredTasks(filteredByUser);
      updateReportData(filteredByUser);
    } catch (err) {
      console.error("Error loading tasks:", err);
      alert("Không thể tải danh sách task. Vui lòng thử lại.");
    }
  };

  const updateReportData = (tasks) => {
    const counts = { "To-Do": 0, "In-Progress": 0, Completed: 0 };
    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    setReportData([
      { id: 1, name: "To-Do", status: "To-Do", count: counts["To-Do"] },
      {
        id: 2,
        name: "In-Progress",
        status: "In-Progress",
        count: counts["In-Progress"],
      },
      {
        id: 3,
        name: "Completed",
        status: "Completed",
        count: counts["Completed"],
      },
    ]);
  };

  useEffect(() => {
    if (
      Array.isArray(members) &&
      members.length > 0 &&
      selectedSprintId !== null &&
      selectedSprintId !== undefined &&
      projectId &&
      activeTab !== undefined
    ) {
      loadTasks();
    }
  }, [activeTab, selectedSprintId, selectedUserId, members, projectId]);

  const toggleSubTask = async (taskId, subTaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      alert("Task không tồn tại.");
      return;
    }
    if (task.assigned_to !== currentUserId) {
      alert("Chỉ người được giao task mới có thể tick subtask.");
      return;
    }

    try {
      const sub = task.subTasks.find((s) => s.id === subTaskId);
      if (!sub) {
        alert("Subtask không tồn tại.");
        return;
      }

      const newCompleted = !sub.completed;
      console.log("Toggling subtask:", { taskId, subTaskId, newCompleted, userId: currentUserId, assignedTo: task.assigned_to, isTeamLead });
      await updateChecklistItem(subTaskId, newCompleted, sub.text, isTeamLead);

      const updatedSubTasks = task.subTasks.map((s) =>
        s.id === subTaskId ? { ...s, completed: newCompleted } : s
      );

      const total = updatedSubTasks.length;
      const completed = updatedSubTasks.filter((s) => s.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      let newStatus = task.status;
      if (completed === total && total > 0) {
        newStatus = "Completed";
      } else if (completed > 0) {
        newStatus = "In-Progress";
      } else {
        newStatus = "To-Do";
      }

      console.log("Updating task:", { taskId, newStatus, progress });
      await updateTask(taskId, { status: newStatus, progress_percentage: progress }, isTeamLead);

      await loadTasks();
    } catch (err) {
      console.error("Toggle subtask error:", err);
      alert(`Lỗi khi cập nhật subtask: ${err.message}`);
    }
  };

  const editSubTask = async (taskId, subTaskId, currentText) => {
    if (!isTeamLead) {
      alert("Chỉ team lead mới có thể chỉnh sửa subtask.");
      return;
    }

    const newText = prompt("Chỉnh sửa mô tả subtask:", currentText);
    if (newText === null || newText.trim() === "") {
      alert("Mô tả subtask không được để trống.");
      return;
    }

    try {
      console.log("Editing subtask:", { taskId, subTaskId, newText });
      await updateChecklistItem(subTaskId, undefined, newText, isTeamLead);
      await loadTasks();
    } catch (err) {
      console.error("Edit subtask error:", err);
      alert(`Lỗi khi chỉnh sửa subtask: ${err.message}`);
    }
  };

  const deleteSubTask = async (taskId, subTaskId) => {
    if (!isTeamLead) {
      alert("Chỉ team lead mới có thể xóa subtask.");
      return;
    }

    if (window.confirm("Bạn có chắc muốn xóa subtask này không?")) {
      try {
        console.log("Deleting subtask:", { taskId, subTaskId });
        await deleteChecklistItem(subTaskId, isTeamLead);
        await loadTasks();
      } catch (err) {
        console.error("Delete subtask error:", err);
        alert(`Lỗi khi xóa subtask: ${err.message}`);
      }
    }
  };

  const deleteTaskHandler = async (taskId) => {
    if (!isTeamLead) {
      alert("Chỉ team lead mới có thể xóa task.");
      return;
    }

    if (window.confirm("Bạn có chắc muốn xóa task này không?")) {
      try {
        console.log("Deleting task:", { taskId });
        await deleteTask(taskId, isTeamLead);
        await loadTasks();
      } catch (err) {
        console.error("Delete task error:", err);
        alert(`Lỗi khi xóa task: ${err.message}`);
      }
    }
  };

  return (
    <div className="kanban-container">
      <div className="report-grid">
        {sprints?.length === 0 && (
          <div style={{ marginBottom: "1rem" }}>
            Không có sprint nào cho dự án này.
          </div>
        )}

        {reportData.map((group) => (
          <div key={group.id} className="status-block">
            <div className="column-header">
              <h3 className="h3">
                {group.name}{" "}
                <span className="count-text">
                  ({group.count.toString().padStart(2, "0")})
                </span>
              </h3>
            </div>

            {filteredTasks
              .filter((t) => t.status === group.status)
              .map((task) => (
                <div key={task.id} className="report-card">
                  <div className="report-card-header">
                    <div className="header-left">
                      <h4 className="body_1">{task.title}</h4>
                      <div className="task-meta">
                        {task.date}{" "}
                        {task.time && (
                          <span className="time-with-clock">
                            <FontAwesomeIcon icon={faClock} /> {task.time}
                          </span>
                        )}
                        <span className="progress-text">
                          Progress: {task.progress_percentage}%
                        </span>
                      </div>
                    </div>
                    {isTeamLead && (
                      <button
                        onClick={() => deleteTaskHandler(task.id)}
                        className="delete-task-btn"
                        style={{ color: "red", marginLeft: "auto" }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>

                  <div className="task-info">
                    <img
                      src={task.avatar}
                      alt="avatar"
                      className="task-avatar"
                    />
                    <div className="task-details">
                      <span
                        onClick={() =>
                          setOpenTaskId(openTaskId === task.id ? null : task.id)
                        }
                      >
                        {task.subTasks.length}{" "}
                        <FontAwesomeIcon icon={faClipboard} />
                      </span>
                      <span
                        onClick={() => setShowCommentPage(task.id)}
                      >
                        {task.comments} <FontAwesomeIcon icon={faComment} />
                      </span>
                    </div>
                  </div>

                  {openTaskId === task.id && (
                    <div className="task-subtasks">
                      {task.subTasks.map((s, i) => (
                        <div key={s.id} className="subtask">
                          <span>{i + 1}.</span>
                          <span>{s.text}</span>
                          <span
                            className={`subtask-status ${
                              s.completed ? "completed" : ""
                            }`}
                            onClick={() => task.assigned_to === currentUserId && toggleSubTask(task.id, s.id)}
                            style={{
                              cursor:
                                task.assigned_to === currentUserId
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={s.completed ? fasCheckCircle : farCircle}
                            />
                          </span>
                          {isTeamLead && (
                            <>
                              <span
                                onClick={() => editSubTask(task.id, s.id, s.text)}
                                style={{ cursor: "pointer", marginLeft: "10px" }}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </span>
                              <span
                                onClick={() => deleteSubTask(task.id, s.id)}
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "10px",
                                  color: "red",
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {group.status === "To-Do" && isTeamLead && (
              <button
                onClick={() => setShowCreateTask(true)}
                className="add-task-btn"
              >
                <FontAwesomeIcon icon={faPlus} /> Thêm task
              </button>
            )}
          </div>
        ))}

        {showCreateTask && (
          <CreateTask
            onCancel={() => {
              setShowCreateTask(false);
              loadTasks();
            }}
            selectedSprintId={selectedSprintId}
            members={members}
          />
        )}

        {showCommentPage && (
          <TaskCommentPage
            currentUserId={userId}
            taskId={showCommentPage}
            onClose={() => {
              setShowCommentPage(null);
              loadTasks();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default KanbanView;
