import React, { useState, useEffect } from "react";
import "./KanbanView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { fetchTasks, updateChecklistItem } from "../../services/api-client";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export const KanbanView = () => {
  const [tasks, setTasks] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);

  // Hàm xử lý nhấp vào icon công việc
  const handleTaskClick = (taskId) => {
    setOpenTaskId(openTaskId === taskId ? null : taskId);
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
              .replace("done", "completed"),
            overdue:
              task.due_date &&
              new Date(task.due_date) < new Date() &&
              task.status !== "Done",
          };
        });
  
        setTasks(mappedTasks);
  
        const counts = { "to-do": 0, "in-progress": 0, "completed": 0 };
        mappedTasks.forEach((task) => {
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
            name: "Completed",
            status: "completed",
            count: counts["completed"],
          },
        ]);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    loadTasks();
  }, []);

  const getStatusClass = (status, due_date) => {
    const currentDate = new Date();
    const dueDate = new Date(due_date);
    const overdue = dueDate < currentDate;
    if (overdue) return "report-status-overdue";
    switch (status) {
      case "to-do":
        return "report-status-to-do";
      case "in-progress":
        return "report-status-in-progress";
      case "completed":
        return "report-status-completed";
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
      case "completed":
        return "circle-completed";
      default:
        return "";
    }
  };

  const toggleSubTask = async (taskId, subTaskId) => {
    try {
      const currentTask = tasks.find((task) => task.id === taskId);
      const currentSubTask = currentTask.subTasks.find(
        (sub) => sub.id === subTaskId
      );
      await updateChecklistItem(subTaskId, !currentSubTask.completed);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
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
        )
      );
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
                      {task.status === "completed" && (
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
                      {task.status === "completed" && task.time && (
                        <span>{task.time}</span>
                      )}
                    </div>
                  </div>
                  <div className={`status-bar-right ${task.status}`}></div>
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