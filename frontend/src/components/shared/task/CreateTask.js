// frontend/src/components/task/CreateTask.js
import React, { useState, useEffect } from "react";
import { createTask } from "../../../services/api-client";
import "./CreateTask.css";

const CreateTask = ({ onTaskCreated, onCancel, selectedSprintId, members }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subTasks, setSubTasks] = useState([""]);
  const [error, setError] = useState(null);
  //console.log("Members:", members);
  useEffect(() => {
    if (members && members.length > 0) {
      setAssignedTo(members[0].id); // Gán mặc định người đầu tiên
    } else {
      setError("No members available for assignment.");
    }
  }, [members]);

  const addSubTask = () => {
    setSubTasks([...subTasks, ""]);
  };

  const removeSubTask = (index) => {
    const newSubTasks = subTasks.filter((_, i) => i !== index);
    setSubTasks(newSubTasks);
  };

  const handleSubTaskChange = (index, value) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index] = value;
    setSubTasks(newSubTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title,
        description,
        assigned_to: parseInt(assignedTo),
        due_date: dueDate,
        status: "To-Do",
        subtasks: subTasks.filter((subtask) => subtask.trim() !== ""),
        sprint_id: selectedSprintId || 1,
      };

      await createTask(taskData);
      alert("Task created successfully!");
      setTitle("");
      setDescription("");
      setAssignedTo(members[0]?.id || "");
      setDueDate("");
      setSubTasks([""]);
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <div className="modal-backdrop">
      <div className="create-task-container">
        <h2>Create New Task</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To:</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
              disabled={members.length === 0}
            >
              {members.length === 0 ? (
                <option value="">No members available</option>
              ) : (
                members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Deadline:</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Subtasks:</label>
            {subTasks.map((subTask, index) => (
              <div key={index} className="subtask-input">
                <input
                  type="text"
                  value={subTask}
                  onChange={(e) => handleSubTaskChange(index, e.target.value)}
                  placeholder={`Subtask ${index + 1}`}
                />
                {subTasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubTask(index)}
                    className="remove-subtask-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubTask}
              className="add-subtask-btn"
            >
              Add Subtask
            </button>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              Create Task
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
