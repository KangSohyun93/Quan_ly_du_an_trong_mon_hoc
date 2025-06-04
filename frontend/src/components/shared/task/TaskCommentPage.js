import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import "./TaskCommentPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import { fetchTaskDetails, addComment } from "../../../services/api-client";
import placeholderMember from "../../../assets/images/placeholders/placeholder-member.jpg";

const TaskCommentPage = ({ currentUserId, taskId, onClose }) => {
  const { members = [] } = useOutletContext(); // Lấy members từ context
  console.log("Members array:", members); // Log toàn bộ mảng members
  console.log("Members details:", JSON.stringify(members, null, 2)); // Log dạng chuỗi định dạng
  console.log("Rendering TaskCommentPage with props:", { currentUserId, taskId, members });

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");

  const loadTaskDetails = useCallback(async () => {
    console.log("Fetching task details for taskId:", taskId);
    setIsLoading(true);
    try {
      const data = await fetchTaskDetails(taskId);
      console.log("Fetched task data:", {
        task_id: data.task_id,
        title: data.title,
        assigned_to: data.assigned_to,
        comments: data.comments?.map(c => ({
          comment_id: c.comment_id,
          user_id: c.user_id,
          username: c.username,
        })),
      });
      const assignedUser = members.find((m) => m.id === data.assigned_to) || {};
      setTask({
        id: data.task_id,
        title: data.title,
        description: data.description || "No description",
        subTasks: (data.checklists || []).map((checklist) => ({
          id: checklist.checklist_id,
          text: checklist.item_description,
          completed: checklist.is_completed,
        })),
        assigned_to: {
          user_id: data.assigned_to,
          username: assignedUser.name,
          avatar: assignedUser.avatarUrl || placeholderMember,
        },
        comments: (data.comments || []).map((comment) => {
          const commentUser = members.find((m) => m.id === comment.user_id) || {};
          return {
            comment_id: comment.comment_id,
            user_id: comment.user_id,
            username: commentUser.name,
            avatar: commentUser.avatarUrl || placeholderMember,
            comment_text: comment.comment_text,
            created_at: new Date(comment.created_at).toLocaleString(),
          };
        }),
      });
      setError(null);
    } catch (error) {
      console.error("Failed to load task details:", error.message);
      setError(error.message);
      setTask(null);
    } finally {
      setIsLoading(false);
    }
  }, [taskId, members]);

  useEffect(() => {
    loadTaskDetails();
  }, [loadTaskDetails]);

  const handleSaveComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(taskId, currentUserId, newComment);
      setNewComment("");
      await loadTaskDetails();
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (isLoading) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content comment-page skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content comment-page">
          <p>Error loading task details: {error}</p>
          <button onClick={handleCancel} className="cancel-btn">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content comment-page">
        <div className="task-info">
          <div className="task-tags">
            <span className="tag backend">Backend</span>
            <span className="tag sql">SQL</span>
          </div>
          <h4 className="body_1">{task.title}</h4>
          <p className="task-description">{task.description}</p>
        </div>

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
                    className={`subtask-status ${subTask.completed ? "completed" : ""}`}
                  >
                    <FontAwesomeIcon
                      icon={subTask.completed ? fasCheckCircle : farCircle}
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

        <div className="divider active"></div>

        <div className="assigned-user">
          <img
            src={task.assigned_to.avatar}
            alt="avatar"
            className="task-avatar"
            onError={() =>
              console.log(
                `Failed to load avatar for assigned user ${task.assigned_to.username}: ${task.assigned_to.avatar}`
              )
            }
          />
          <span className="assigned-username">
            {task.assigned_to.username}
          </span>
        </div>

        <div className="comments-section">
          {task.comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            task.comments.map((comment) => (
              <div key={comment.comment_id} className="comment-block">
                <div className="comment-header">
                  <img
                    src={comment.avatar}
                    alt="avatar"
                    className="comment-avatar"
                    onError={() =>
                      console.log(
                        `Failed to load avatar for comment by ${comment.username}: ${comment.avatar}`
                      )
                    }
                  />
                  <span className="comment-username">{comment.username}</span>
                </div>
                <p className="comment-text">{comment.comment_text}</p>
                <span className="comment-timestamp">{comment.created_at}</span>
              </div>
            ))
          )}
        </div>

        <div className="add-comment-block">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="comment-input"
          />
          <div className="comment-actions">
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleSaveComment} className="save-btn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCommentPage;