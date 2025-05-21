// frontend/src/services/api-client.js
const API_BASE_URL = "http://localhost:5000"; // Adjust based on your backend server

// Fetch all tasks
export const fetchTasks = async (mode = "user") => {
  const response = await fetch(`${API_BASE_URL}/api/tasks?mode=${mode}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.status}`);
  return response.json();
};

// Fetch task details with comments and subtasks
export const fetchTaskDetails = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch task details: ${response.status}`);
  return response.json();
};

// Add a comment to a task
export const addComment = async (taskId, userId, commentText) => {
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task_id: taskId, user_id: userId, comment_text: commentText }),
  });
  if (!response.ok) throw new Error(`Failed to add comment: ${response.status}`);
  return response.json();
};

// Update a checklist item
export const updateChecklistItem = async (checklistId, isCompleted) => {
  const response = await fetch(`${API_BASE_URL}/api/checklists/${checklistId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_completed: isCompleted }),
  });
  if (!response.ok) throw new Error(`Failed to update checklist item: ${response.status}`);
  return response.json();
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(`Failed to update task status: ${response.status}`);
  return response.json();
};

// Fetch all projects
export const fetchProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
  return response.json();
};

// Fetch all sprints
export const fetchSprints = async () => {
  const response = await fetch(`${API_BASE_URL}/api/sprints`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch sprints: ${response.status}`);
  return response.json();
};

// Create a new task with subtasks
export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error(`Failed to create task: ${response.status}`);
  return response.json();
};

// Create a new sprint
export const createSprint = async (sprintData) => {
  const response = await fetch(`${API_BASE_URL}/api/sprints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sprintData),
  });
  if (!response.ok) throw new Error(`Failed to create sprint: ${response.status}`);
  return response.json();
};

// Fetch group members by project
export const fetchGroupMembersByProject = async () => {
  const response = await fetch(`${API_BASE_URL}/api/group-members-by-project`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch group members: ${response.status}`);
  const data = await response.json();
  console.log("Group members fetched from API:", data);
  return data;
};