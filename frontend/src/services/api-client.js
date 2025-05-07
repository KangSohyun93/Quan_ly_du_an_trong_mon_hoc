// frontend/src/services/api-client.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"; // Adjust based on your backend URL

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add authentication headers if needed (e.g., JWT token)
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

export const updateChecklistItem = async (checklistId, isCompleted) => {
  const response = await fetch(`${API_BASE_URL}/api/task-checklists/${checklistId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // Add authentication headers if needed
    },
    body: JSON.stringify({ is_completed: isCompleted }), // Sending boolean
  });
  if (!response.ok) {
    throw new Error("Failed to update checklist item");
  }
  return response.json();
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // Add authentication headers if needed
    },
    body: JSON.stringify({ status: status.toUpperCase() }), // Convert to uppercase for backend (To-Do, In-Progress, Done)
  });
  if (!response.ok) {
    throw new Error("Failed to update task status");
  }
  return response.json();
};

export const fetchProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add authentication headers if needed
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add authentication headers if needed
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
};