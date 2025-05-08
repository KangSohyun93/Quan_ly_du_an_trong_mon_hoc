// frontend/src/components/task/ProjectManagerKanban.js
import React, { useState, useEffect, useCallback } from "react";
import "./KanbanView.css"; // Reuse the same CSS as KanbanView
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons"; // Add plus icon
import { fetchTasks, updateChecklistItem, updateTaskStatus } from "../../services/api-client";
import CreateTask from "./CreateTask";

export const ProjectManagerKanban = () => {
  const [tasks, setTasks] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false); // State to toggle CreateTask form

  console.log("ProjectManagerKanban rendered"); // Debug log to confirm component is rendering

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
  const loadTasks = useCallback(async () => {
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
          progress_percentage: task.progress_percentage || 0, // Add progress_percentage
        };
      });

      setTasks(mappedTasks);
      updateReportData(mappedTasks); // Update reportData initially
      console.log("Tasks state updated:", mappedTasks); // Debug log
      console.log("ReportData state updated:", reportData); // Debug log
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [reportData]); // Add reportData as a dependency since updateReportData uses it

  useEffect(() => {
    console.log("useEffect triggered"); // Debug log
    loadTasks();
  }, [loadTasks]); // Add loadTasks to the dependency array to fix the ESLint warning

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

      // Recalculate progress_percentage
      const updatedTask = updatedTasks.find((task) => task.id === taskId);
      const totalSubtasks = updatedTask.subTasks.length;
      const completedSubtasks = updatedTask.subTasks.filter(
        (sub) => sub.completed
      ).length;
      const newProgress =
        totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
      updatedTask.progress_percentage = parseFloat(newProgress.toFixed(2));

      // Check and update task status based on subtask completion
      const allSubtasksCompleted = updatedTask.subTasks.every((subTask) => subTask.completed);
      const anySubtaskCompleted = updatedTask.subTasks.some((subTask) => subTask.completed);
      const subtaskCount = updatedTask.subTasks.length;
      let newStatus = updatedTask.status;

      if (subtaskCount === 1 && allSubtasksCompleted) {
        newStatus = "done";
      } else if (updatedTask.status === "to-do" && anySubtaskCompleted) {
        newStatus = "in-progress";
      } else if (allSubtasksCompleted && updatedTask.status !== "done") {
        newStatus = "done";
      } else if (updatedTask.status === "done" && !allSubtasksCompleted) {
        if (subtaskCount > 1) {
          newStatus = "in-progress";
        } else {
          newStatus = "to-do";
        }
      } else if (updatedTask.status === "in-progress" && !anySubtaskCompleted) {
        newStatus = "to-do";
      }

      // Update task status and progress in the database
      if (newStatus !== updatedTask.status || newProgress !== currentTask.progress_percentage) {
        await updateTaskStatus(taskId, newStatus, updatedTask.progress_percentage); // Update with new progress
        updatedTasks = updatedTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus, progress_percentage: updatedTask.progress_percentage } : task
        );
      }

      // Update both tasks and reportData states
      setTasks(updatedTasks);
      updateReportData(updatedTasks);

      console.log("Subtask updated successfully, new status:", newStatus, "new progress:", updatedTask.progress_percentage); // Debug log
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  // Callback function to refresh tasks after a new task is created
  const handleTaskCreated = () => {
    loadTasks(); // Refresh the task list
    setShowCreateTask(false); // Hide the form after task creation
  };

  // Callback function to handle cancel action
  const handleCancel = () => {
    setShowCreateTask(false); // Hide the form
  };

  // Add a fallback UI in case reportData is empty
  if (!reportData.length) {
    return <div>Loading Kanban board...</div>;
  }

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
                      <span className="progress-text">
                        {" "}
                        - Progress: {task.progress_percentage}%
                      </span>
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
          {/* Add the "+" button at the bottom of the "To-Do" column */}
          {group.status === "to-do" && (
            <div className="add-task-btn-container">
              <button
                onClick={() => setShowCreateTask(!showCreateTask)}
                className="add-task-btn"
              >
                <FontAwesomeIcon icon={faPlus} /> Add Task
              </button>
            </div>
          )}
        </div>
      ))}
      {/* Render CreateTask form in a modal when showCreateTask is true */}
      {showCreateTask && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <CreateTask onTaskCreated={handleTaskCreated} onCancel={handleCancel} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerKanban;