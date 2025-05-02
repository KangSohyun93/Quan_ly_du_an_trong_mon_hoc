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
    body: JSON.stringify({ is_completed: isCompleted }),
  });
  if (!response.ok) {
    throw new Error("Failed to update checklist item");
  }
  return response.json();
};