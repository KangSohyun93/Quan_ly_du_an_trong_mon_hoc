// frontend/src/components/task/KanbanView.js
import React, { useState, useEffect, useCallback } from "react";
import "./KanbanView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { fetchTasks, updateChecklistItem, fetchProjects, fetchSprints } from "../../services/api-client";
import CreateTask from "./CreateTask";
import TaskCommentPage from "./TaskCommentPage";
import TeamHeader from "../TeamHeader/TeamHeader";
import { filterTasksByUser } from "./UserFilter"; // Import hàm lọc

export const KanbanView = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]); // Task sau khi lọc
  const [reportData, setReportData] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCommentPage, setShowCommentPage] = useState(null);
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [activeTab, setActiveTab] = useState("Team task");
  const [selectedUserId, setSelectedUserId] = useState(null); // State để lưu user_id được chọn

  const className = "Class A";
  const classCode = "ABC123";
  const teamName = "Group 1";
  const projectName = projects.length > 0 ? projects[0].project_name : "Project 1";
  const members = [
    { user_id: 1, username: "user1", avatar: "https://i.pravatar.cc/24?img=1" },
    { user_id: 2, username: "user2", avatar: "https://i.pravatar.cc/24?img=2" },
    { user_id: 3, username: "user3", avatar: "https://i.pravatar.cc/24?img=3" },
    { user_id: 4, username: "user4", avatar: "https://i.pravatar.cc/24?img=4" },
  ];

  const currentUserId = 1;
  const isTeamLead = true;

  const loadProjectsAndSprints = useCallback(async () => {
    try {
      const projectData = await fetchProjects();
      console.log("Fetched projects:", projectData);
      setProjects(projectData);

      const sprintData = await fetchSprints();
      console.log("Fetched sprints:", sprintData);

      const currentProjectId = projectData.length > 0 ? projectData[0].project_id : 1;
      const filteredSprints = sprintData.filter(sprint => sprint.project_id === currentProjectId);
      console.log("Filtered sprints for project_id =", currentProjectId, ":", filteredSprints);

      setSprints(filteredSprints);
      if (filteredSprints.length > 0) {
        setSelectedSprintId(filteredSprints[0].sprint_id);
      } else {
        setSelectedSprintId(null);
      }
    } catch (error) {
      console.error("Error fetching projects and sprints:", error);
    }
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const mode = activeTab === "Team task" ? "all" : "user";
      const data = await fetchTasks(mode);
      console.log(`Fetched tasks (mode=${mode}):`, data);

      const currentDate = new Date('2025-05-12');

      const mappedTasks = data
        .filter(task => {
          if (!selectedSprintId) return true;
          return task.sprint_id === selectedSprintId;
        })
        .map((task) => ({
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
          subTasks: task.checklists && task.checklists.length > 0
            ? task.checklists.map((checklist) => ({
                id: checklist.checklist_id,
                text: checklist.item_description,
                completed: checklist.is_completed,
              }))
            : [],
          status: task.status
            .toLowerCase()
            .replace("to-do", "to-do")
            .replace("in-progress", "in-progress")
            .replace("completed", "done"),
          overdue:
            task.due_date &&
            new Date(task.due_date) < currentDate &&
            task.status !== "Completed",
          progress_percentage: task.progress_percentage || 0,
          assigned_to: task.assigned_to,
          sprint_id: task.sprint_id,
          due_date: task.due_date ? new Date(task.due_date) : null,
        }))
        .sort((a, b) => {
          if (a.status === "done" && b.status !== "done") return 1;
          if (b.status === "done" && a.status !== "done") return -1;
          if (a.status === "done" && b.status === "done") {
            if (!a.due_date && !b.due_date) return 0;
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return a.due_date - b.due_date;
          }
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return a.due_date - b.due_date;
        });

      console.log("Mapped and sorted tasks:", mappedTasks);
      setTasks(mappedTasks);
      const filtered = filterTasksByUser(mappedTasks, selectedUserId); // Lọc task theo user
      setFilteredTasks(filtered);
      updateReportData(filtered);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [activeTab, selectedSprintId, selectedUserId]);

  useEffect(() => {
    loadProjectsAndSprints();
  }, [loadProjectsAndSprints]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, activeTab, selectedSprintId, selectedUserId]);

  const updateReportData = (updatedTasks) => {
    const counts = { "to-do": 0, "in-progress": 0, "done": 0 };
    updatedTasks.forEach((task) => {
      counts[task.status]++;
    });

    setReportData([
      { id: 1, name: "To-Do", status: "to-do", count: counts["to-do"] },
      { id: 2, name: "In-progress", status: "in-progress", count: counts["in-progress"] },
      { id: 3, name: "Done", status: "done", count: counts["done"] },
    ]);
  };

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
      await updateChecklistItem(subTaskId, !currentSubTask.completed);
      await loadTasks();
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  const handleTaskCreated = () => {
    loadTasks();
    setShowCreateTask(false);
  };

  const handleCancel = () => {
    setShowCreateTask(false);
  };

  const openCommentPage = (taskId) => {
    setShowCommentPage(taskId);
  };

  const closeCommentPage = () => {
    setShowCommentPage(null);
    loadTasks();
  };

  const handleSprintChange = (sprint) => {
    console.log("Selected sprint:", sprint);
    setSelectedSprintId(sprint.sprint_id);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUserChange = (userId) => {
    setSelectedUserId(userId); // Cập nhật user_id được chọn
  };

  return (
    <div className="kanban-container">
      <TeamHeader
        className={className}
        classCode={classCode}
        teamName={teamName}
        projectName={projectName}
        members={members}
        activeTab={activeTab}
        sprints={sprints}
        selectedSprintId={selectedSprintId}
        onSprintChange={handleSprintChange}
        onTabChange={handleTabChange}
        onUserChange={handleUserChange} // Truyền hàm xử lý chọn user
      />
      <div className="report-grid">
        {sprints.length === 0 && (
          <div>No sprints available for this project.</div>
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
              <span
                className={`status-circle ${getCircleClass(group.status)}`}
              ></span>
            </div>
            {filteredTasks // Sử dụng filteredTasks thay vì tasks
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
                          {" "} - Progress: {task.progress_percentage}%
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
                        onClick={() => setOpenTaskId(openTaskId === task.id ? null : task.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {task.subTasks.length} <FontAwesomeIcon icon={faClipboard} />
                      </span>
                      <span
                        className="task-action-item"
                        onClick={() => openCommentPage(task.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {task.comments} <FontAwesomeIcon icon={faComment} />
                      </span>
                    </div>
                  </div>
                  {openTaskId === task.id && (
                    <>
                      <div className="divider active"></div>
                      <div className="task-subtasks active">
                        {task.subTasks.length === 0 ? (
                          <div className="no-subtask-message">No subtask</div>
                        ) : (
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
                                    if (task.assigned_to === currentUserId) {
                                      toggleSubTask(task.id, subTask.id);
                                    }
                                  }}
                                  style={{
                                    cursor: task.assigned_to === currentUserId ? "pointer" : "not-allowed",
                                    opacity: task.assigned_to === currentUserId ? 1 : 0.5,
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
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            {group.status === "to-do" && isTeamLead && (
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
        {showCreateTask && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <CreateTask
                onTaskCreated={handleTaskCreated}
                onCancel={handleCancel}
                selectedSprintId={selectedSprintId}
              />
            </div>
          </div>
        )}
        {showCommentPage && (
          <TaskCommentPage taskId={showCommentPage} onClose={closeCommentPage} />
        )}
      </div>
    </div>
  );
};

export default KanbanView;