// frontend/src/components/task/CreateTask.js
import React, { useState, useEffect } from "react";
import { fetchProjects, createTask } from "../../services/api-client";
import "./CreateTask.css";

const CreateTask = ({ onTaskCreated, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subTasks, setSubTasks] = useState([""]); // Array to hold subtask descriptions
  const [projects, setProjects] = useState([]); // List of projects fetched from backend

  // Fetch projects when component mounts
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
        if (data.length > 0) {
          setProjectId(data[0].project_id); // Default to the first project
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    loadProjects();
  }, []);

  // Handle adding a new subtask input field
  const addSubTask = () => {
    setSubTasks([...subTasks, ""]);
  };

  // Handle removing a subtask input field
  const removeSubTask = (index) => {
    const newSubTasks = subTasks.filter((_, i) => i !== index);
    setSubTasks(newSubTasks);
  };

  // Handle subtask input change
  const handleSubTaskChange = (index, value) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index] = value;
    setSubTasks(newSubTasks);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title,
        description,
        project_id: projectId,
        due_date: dueDate,
        status: "To-Do", // Default status
        subtasks: subTasks.filter((subtask) => subtask.trim() !== ""), // Filter out empty subtasks
      };

      await createTask(taskData);
      alert("Task created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setProjectId(projects[0]?.project_id || "");
      setDueDate("");
      setSubTasks([""]);
      // Call the callback to refresh the task list
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  // Handle cancel action
  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="create-task-container">
      <h2>Create New Task</h2>
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
          <label htmlFor="project">Project:</label>
          <select
            id="project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            {projects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_name}
              </option>
            ))}
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
          <button type="button" onClick={addSubTask} className="add-subtask-btn">
            Add Subtask
          </button>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Create Task
          </button>
          <button type="button" onClick={handleCancelClick} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;