import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle as fasCheckCircle,
  faClipboard,
  faComment,
  faClock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import { fetchTasks, updateChecklistItem } from "../../../services/api-client";
import CreateTask from "./CreateTask";
import TaskCommentPage from "./TaskCommentPage";
import { filterTasksByUser } from "./UserFilter";
import { useOutletContext } from "react-router-dom";
import "./KanbanView.css";

const KanbanView = (sprints) => {
  const {
    activeTab,
    members,
    isTeamLead,
    currentUserId,
    projectId,
    selectedUserId,
    selectedSprintId,
  } = useOutletContext();
  // console.log("selectedUserId:", selectedUserId);
  // console.log("selectedSprintId", selectedSprintId);
  // console.log("activeTab", activeTab);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCommentPage, setShowCommentPage] = useState(null);

  const statusMap = {
    "to-do": "to-do",
    todo: "to-do",
    "in-progress": "in-progress",
    done: "done",
    completed: "done",
  };
  const loadTasks = async () => {
    if (!projectId || selectedSprintId === null) return;

    try {
      const isTeamTask = activeTab === "team-task";
      // tạo biến có thể thay đổi:
      let selectedUserIdToUse = isTeamTask ? selectedUserId || null : userId;
      const mode = isTeamTask
        ? !selectedUserIdToUse
          ? "all"
          : "user"
        : "user";
      const data = await fetchTasks(
        mode,
        projectId,
        selectedSprintId,
        selectedUserIdToUse
      );
      const currentDate = new Date();

      // Không cần lọc lại sprint nữa vì backend đã lọc rồi
      const mapped = data.map((task) => {
        const user = members?.find((m) => m.user_id === task.assigned_to) || {};
        const normalizedStatus = (task.status || "").toLowerCase();
        const finalStatus = statusMap[normalizedStatus] || "to-do";

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
          tags: ["SQL", "Backend"], // bạn có thể chỉnh thành dynamic nếu có
          avatar: `/avatars/${user.username?.toLowerCase() || "default"}.jpg`,
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
            finalStatus !== "done",
          progress_percentage: task.progress_percentage || 0,
          assigned_to: task.assigned_to,
          sprint_id: task.sprint_id,
          due_date: task.due_date ? new Date(task.due_date) : null,
        };
      });

      const sorted = mapped.sort(
        (a, b) =>
          (a.due_date ? a.due_date.getTime() : 0) -
          (b.due_date ? b.due_date.getTime() : 0)
      );

      setTasks(sorted);
      const filteredByUser = filterTasksByUser(sorted, selectedUserId);
      setFilteredTasks(filteredByUser);
      updateReportData(filteredByUser);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  const updateReportData = (tasks) => {
    const counts = { "to-do": 0, "in-progress": 0, done: 0 };
    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    setReportData([
      { id: 1, name: "To-Do", status: "to-do", count: counts["to-do"] },
      {
        id: 2,
        name: "In-progress",
        status: "in-progress",
        count: counts["in-progress"],
      },
      { id: 3, name: "Done", status: "done", count: counts["done"] },
    ]);
  };

  useEffect(() => {
    if (
      Array.isArray(members) &&
      members.length > 0 &&
      selectedSprintId !== null &&
      selectedSprintId !== undefined &&
      projectId &&
      activeTab !== undefined // thêm điều kiện để đảm bảo tab đã sẵn sàng
    ) {
      loadTasks();
    }
  }, [activeTab, selectedSprintId, selectedUserId, members, projectId]);

  const toggleSubTask = async (taskId, subTaskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const sub = task.subTasks.find((s) => s.id === subTaskId);
      if (!sub) return;

      await updateChecklistItem(subTaskId, !sub.completed);
      await loadTasks();
    } catch (err) {
      console.error("Toggle error:", err);
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
                    <h4>{task.title}</h4>
                    <div>
                      {task.date}{" "}
                      {task.time && (
                        <span>
                          <FontAwesomeIcon icon={faClock} /> {task.time}
                        </span>
                      )}
                      <span> - Progress: {task.progress_percentage}%</span>
                    </div>
                  </div>

                  <div className="task-info">
                    <img
                      src={task.avatar}
                      alt="avatar"
                      className="task-avatar"
                    />
                    <div>
                      <span
                        onClick={() =>
                          setOpenTaskId(openTaskId === task.id ? null : task.id)
                        }
                      >
                        {task.subTasks.length}{" "}
                        <FontAwesomeIcon icon={faClipboard} />
                      </span>
                      <span onClick={() => setShowCommentPage(task.id)}>
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
                            onClick={() => {
                              if (
                                task.assigned_to === currentUserId &&
                                isTeamLead
                              ) {
                                toggleSubTask(task.id, s.id);
                              }
                            }}
                            style={{
                              cursor: isTeamLead ? "pointer" : "not-allowed",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={s.completed ? fasCheckCircle : farCircle}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {group.status === "to-do" && isTeamLead && (
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
            onClose={() => {
              setShowCreateTask(false);
              loadTasks();
            }}
            selectedSprintId={selectedSprintId}
          />
        )}

        {showCommentPage && (
          <TaskCommentPage
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
