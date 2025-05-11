// frontend/src/components/task/TaskCommentPage.js
import React, { useState, useEffect, useCallback } from "react";
import "./TaskCommentPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import { fetchTaskDetails, addComment } from "../../services/api-client";

const TaskCommentPage = ({ taskId, onClose }) => {
  console.log("Rendering TaskCommentPage with taskId:", taskId);
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const currentUserId = 1; // Hard-coded user_id for testing

  // Fetch task details, subtasks, and comments
  const loadTaskDetails = useCallback(async () => {
    console.log("Fetching task details for taskId:", taskId);
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTaskDetails(taskId);
      console.log("Fetched data:", data);
      setTask({
        id: data.task_id,
        title: data.title,
        description: data.description || "No description",
        subTasks: data.checklists.map((checklist) => ({
          id: checklist.checklist_id,
          text: checklist.item_description,
          completed: checklist.is_completed,
        })),
        assigned_to: {
          user_id: data.assigned_to,
          username: data.assigned_username,
          avatar: `https://i.pravatar.cc/24?img=${data.assigned_to}`,
        },
        comments: data.comments.map((comment) => ({
          comment_id: comment.comment_id,
          user_id: comment.user_id,
          username: comment.username,
          avatar: `https://i.pravatar.cc/24?img=${comment.user_id}`,
          comment_text: comment.comment_text,
          created_at: new Date(comment.created_at).toLocaleString(),
        })),
      });
    } catch (error) {
      console.error("Failed to load task details:", error.message);
      setError(error.message);
      setTask(null);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTaskDetails();
  }, [loadTaskDetails]);

  useEffect(() => {
    console.log("Task state updated to:", task);
  }, [task]);

  // Handle adding a new comment
  const handleSaveComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(taskId, currentUserId, newComment);
      setNewComment("");
      loadTaskDetails(); // Refresh comments
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  // Handle cancel (close the comment page)
  const handleCancel = () => {
    onClose();
  };

  if (isLoading) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content comment-page">
          <p>Loading...</p>
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
        {/* Task Info */}
        <div className="task-info">
          <div className="task-tags">
            <span className="tag backend">Backend</span>
            <span className="tag sql">SQL</span>
          </div>
          <h4 className="body_1">{task.title}</h4>
          <p className="task-description">{task.description}</p>
        </div>

        {/* Divider */}
        <div className="divider active"></div>

        {/* Subtasks */}
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
        {/* Divider */}
        <div className="divider active"></div>
        {/* Assigned User */}
        <div className="assigned-user">
          <img
            src={task.assigned_to.avatar}
            alt="avatar"
            className="task-avatar"
          />
          <span className="assigned-username">
            {task.assigned_to.username || "Unassigned"}
          </span>
        </div>

        {/* Comments Section */}
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
                  />
                  <span className="comment-username">{comment.username}</span>
                </div>
                <p className="comment-text">{comment.comment_text}</p>
                <span className="comment-timestamp">{comment.created_at}</span>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Block */}
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