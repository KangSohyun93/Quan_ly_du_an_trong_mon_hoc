// frontend/src/components/task/KanbanView.js
import React, { useState, useEffect } from "react";
import "./KanbanView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { fetchTasks, updateChecklistItem, updateTaskStatus } from "../../services/api-client";

export const KanbanView = () => {
  const [tasks, setTasks] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);

  // Hàm xử lý nhấp vào icon công việc
  const handleTaskClick = (taskId) => {
    setOpenTaskId(openTaskId === taskId ? null : taskId);
  };

  // Function to update reportData based on tasks
  const updateReportData = (updatedTasks) => {
    const counts = { "to-do": 0, "in-progress": 0, "done": 0 };
    updatedTasks.forEach((task) => {
      counts[task.status]++;
    });

    setReportData([
      { id: 1, name: "To-Do", status: "to-do", count: counts["to-do"] },
      {
        id: 2,
        name: "In-progress",
        status: "in-progress",
        count: counts["in-progress"],
      },
      {
        id: 3,
        name: "Done",
        status: "done",
        count: counts["done"],
      },
    ]);
  };

  // Fetch tasks từ API
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        console.log("Raw API data:", data); // Kiểm tra dữ liệu gốc
        const mappedTasks = data.map((task) => {
          console.log("Task checklists:", task.checklists); // Kiểm tra checklists của mỗi task
          return {
            id: task.task_id,
            title: task.title,
            date: task.due_date ? new Date(task.due_date).toLocaleDateString() : "",
            time: task.due_date
              ? new Date(task.due_date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            tags: ["SQL", "Backend"],
            avatar: `https://i.pravatar.cc/24?img=${task.assigned_to || task.task_id}`,
            comments: task.comment_count || 0,
            subTasks: task.checklists
              ? task.checklists.map((checklist) => ({
                  id: checklist.checklist_id,
                  text: checklist.item_description,
                  completed: checklist.is_completed,
                }))
              : [], // Gán mảng rỗng nếu checklists không tồn tại
            status: task.status
              .toLowerCase()
              .replace("to-do", "to-do")
              .replace("in-progress", "in-progress")
              .replace("done", "done"),
            overdue:
              task.due_date &&
              new Date(task.due_date) < new Date() &&
              task.status !== "Done",
          };
        });

        setTasks(mappedTasks);
        updateReportData(mappedTasks); // Update reportData initially
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, []);

  const getStatusClass = (status, overdue) => {
    if (status === "done") return "report-status-completed";
    if (overdue) return "report-status-overdue";
    switch (status) {
      case "to-do":
        return "report-status-to-do";
      case "in-progress":
        return "report-status-in-progress";
      default:
        return "";
    }
  };

  const getCircleClass = (status) => {
    switch (status) {
      case "to-do":
        return "circle-to-do";
      case "in-progress":
        return "circle-in-progress";
      case "done":
        return "circle-completed";
      default:
        return "";
    }
  };

  const toggleSubTask = async (taskId, subTaskId) => {
    try {
      const currentTask = tasks.find((task) => task.id === taskId);
      const currentSubTask = currentTask.subTasks.find((sub) => sub.id === subTaskId);
      console.log("Toggling subtask:", { taskId, subTaskId, currentSubTask }); // Debug log
      await updateChecklistItem(subTaskId, !currentSubTask.completed);

      // Update local state for the subtask
      let updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              ),
            }
          : task
      );

      // Check and update task status based on subtask completion
      const updatedTask = updatedTasks.find((task) => task.id === taskId);
      const allSubtasksCompleted = updatedTask.subTasks.every((subTask) => subTask.completed);
      const anySubtaskCompleted = updatedTask.subTasks.some((subTask) => subTask.completed);
      const subtaskCount = updatedTask.subTasks.length;
      let newStatus = updatedTask.status;

      if (subtaskCount === 1 && allSubtasksCompleted) {
        // If task has exactly 1 subtask and it's completed, move to Done
        newStatus = "done";
      } else if (updatedTask.status === "to-do" && anySubtaskCompleted) {
        // If task is in To-Do and at least one subtask is completed, move to In-Progress
        newStatus = "in-progress";
      } else if (allSubtasksCompleted && updatedTask.status !== "done") {
        // If all subtasks are completed, move to Done (for tasks with more than 1 subtask)
        newStatus = "done";
      } else if (updatedTask.status === "done" && !allSubtasksCompleted) {
        // If task is in Done and a subtask is unticked
        if (subtaskCount > 1) {
          newStatus = "in-progress"; // Move to In-Progress if more than 1 subtask
        } else {
          newStatus = "to-do"; // Move to To-Do if exactly 1 subtask
        }
      } else if (updatedTask.status === "in-progress" && !anySubtaskCompleted) {
        // If task is in In-Progress and all subtasks are unticked, move to To-Do
        newStatus = "to-do";
      }

      // Update task status in the database if it has changed
      if (newStatus !== updatedTask.status) {
        await updateTaskStatus(taskId, newStatus); // Call API to update task status
        updatedTasks = updatedTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
      }

      // Update both tasks and reportData states
      setTasks(updatedTasks);
      updateReportData(updatedTasks);

      console.log("Subtask updated successfully, new status:", newStatus); // Debug log
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  return (
    <div className="report-grid">
      {reportData.map((group) => (
        <div key={group.id} className="status-block">
          <div className="column-header">
            <h3 className="h3">
              {group.name}{" "}
              <span className="count-text">
                ({group.count.toString().padStart(2, "0")})
              </span>
            </h3>
            <span
              className={`status-circle ${getCircleClass(group.status)}`}
            ></span>
          </div>
          {tasks
            .filter((task) => task.status === group.status)
            .map((task) => (
              <div
                key={task.id}
                className={`report-card ${getStatusClass(
                  task.status,
                  task.overdue
                )}`}
              >
                <div className="report-card-header">
                  <div className="header-left">
                    <h4 className="body_1">{task.title}</h4>
                    <div className="task-meta">
                      {task.status === "done" && (
                        <span className="completed-label">Completed </span>
                      )}
                      {task.date}
                      <span className="date-time-space"></span>
                      {(task.status === "to-do" ||
                        task.status === "in-progress") &&
                        task.time && (
                          <span className="time-with-clock">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="clock-icon"
                            />
                            {task.time}
                          </span>
                        )}
                      {task.status === "done" && task.time && (
                        <span>{task.time}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="task-tags">
                  {task.tags.map((tag) => (
                    <span key={tag} className={`tag ${tag.toLowerCase()}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="task-info">
                  <img src={task.avatar} alt="avatar" className="task-avatar" />
                  <div className="task-actions body_2">
                    <span
                      className="task-action-item"
                      onClick={() => handleTaskClick(task.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {task.subTasks && task.subTasks.length > 0 && task.subTasks.every(subTask => subTask.id) ? task.subTasks.length : 0} <FontAwesomeIcon icon={faClipboard} />
                    </span>
                    <span className="task-action-item">
                      {task.comments} <FontAwesomeIcon icon={faComment} />
                    </span>
                  </div>
                </div>
                {openTaskId === task.id && (
                  <>
                    <div className="divider active"></div>
                    <div className="task-subtasks active">
                      {task.subTasks && task.subTasks.length > 0 && task.subTasks.every(subTask => subTask.id) ? (
                        task.subTasks.map((subTask, index) => (
                          <div key={subTask.id}>
                            <div className="subtask">
                              <span className="subtask-icon">
                                <span></span>
                                <div></div>
                              </span>
                              <span className="subtask-count">{index + 1}.</span>
                              <span className="subtask-text">{subTask.text}</span>
                              <span
                                className={`subtask-status ${
                                  subTask.completed ? "completed" : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubTask(task.id, subTask.id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    subTask.completed ? fasCheckCircle : farCircle
                                  }
                                />
                              </span>
                            </div>
                            {index !== task.subTasks.length - 1 && (
                              <div className="divider active"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>No subtasks available.</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanView;