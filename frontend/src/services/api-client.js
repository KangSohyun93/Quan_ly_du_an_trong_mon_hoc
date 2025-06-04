const API_BASE_URL = "http://localhost:5000";

export const fetchTasks = async (
  mode,
  projectId,
  sprintId,
  selectedUserId = null
) => {
  const token = sessionStorage.getItem("token");

  const url = new URL(`${API_BASE_URL}/api/tasks`);
  const params = new URLSearchParams();

  if (mode) params.append("mode", mode);
  if (projectId) params.append("projectId", projectId);
  if (sprintId != null) params.append("sprintId", sprintId);
  if (selectedUserId != null) params.append("selectedUserId", selectedUserId);

  url.search = params.toString();

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status}`);
  }

  return response.json();
};

export const fetchTaskDetails = async (taskId) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok)
    throw new Error(`Failed to fetch task details: ${response.status}`);
  return response.json();
};

export const addComment = async (taskId, userId, commentText) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/tasks/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      task_id: taskId,
      user_id: userId,
      comment_text: commentText,
    }),
  });
  if (!response.ok)
    throw new Error(`Failed to add comment: ${response.status}`);
  return response.json();
};

export const updateChecklistItem = async (checklistId, isCompleted, itemDescription, isTeamLead) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/api/tasks/checklists/${checklistId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Is-Team-Lead": isTeamLead.toString(),
      },
      body: JSON.stringify({ 
        is_completed: isCompleted,
        item_description: itemDescription
      }),
    }
  );
  if (!response.ok)
    throw new Error(`Failed to update checklist item: ${response.status}`);
  return response.json();
};

export const deleteChecklistItem = async (checklistId, isTeamLead) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/api/tasks/checklists/${checklistId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Is-Team-Lead": isTeamLead.toString(),
      },
    }
  );
  if (!response.ok)
    throw new Error(`Failed to delete checklist item: ${response.status}`);
  return response.json();
};

export const updateTask = async (taskId, data, isTeamLead) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Is-Team-Lead": isTeamLead.toString(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok)
    throw new Error(`Failed to update task: ${response.status}`);
  return response.json();
};

export const deleteTask = async (taskId, isTeamLead) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Is-Team-Lead": isTeamLead.toString(),
    },
  });
  if (!response.ok)
    throw new Error(`Failed to delete task: ${response.status}`);
  return response.json();
};

export const fetchSprints = async (projectId) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/api/tasks/sprints?projectId=${projectId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok)
    throw new Error(`Failed to fetch sprints: ${response.status}`);
  return response.json();
};

export const createTask = async (taskData) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok)
    throw new Error(`Failed to create task: ${response.status}`);
  return response.json();
};

export const createSprint = async (sprintData) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/tasks/sprints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sprintData),
  });
  if (!response.ok)
    throw new Error(`Failed to create sprint: ${response.status}`);
  return response.json();
};

export const fetchGroupMembersByProject = async () => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/api/tasks/group-members-by-project`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok)
    throw new Error(`Failed to fetch group members: ${response.status}`);
  const data = await response.json();
  console.log("Group members fetched from API:", data);
  return data;
};
