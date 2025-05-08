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
  const data = await response.json();
  return data.map((task) => ({
    task_id: task.task_id,
    title: task.title,
    due_date: task.due_date,
    status: task.status,
    checklists: task.checklists,
    comment_count: task.comment_count,
    progress_percentage: task.progress_percentage, // Add progress_percentage
    assigned_to: task.assigned_to || task.task_id, // Fallback to task_id if assigned_to is null
  }));
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

export const updateTaskStatus = async (taskId, status, progressPercentage = null) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // Add authentication headers if needed
    },
    body: JSON.stringify({
      status: status.toUpperCase(), // Convert to uppercase for backend
      progress_percentage: progressPercentage, // Include progress_percentage
    }),
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