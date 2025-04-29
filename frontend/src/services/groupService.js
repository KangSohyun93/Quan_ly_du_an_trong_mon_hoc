/* frontend/src/services/groupService.js */
export const fetchGroupsByUserId = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/groups?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách nhóm');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhóm:', error);
    throw error;
  }
};

export const fetchProjectById = async (projectId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/groups/projects/${projectId}`);
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin dự án');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin dự án:', error);
    throw error;
  }
};

export const fetchTasksBySprintId = async (sprintId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/groups/tasks?sprint_id=${sprintId}`);
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách task');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách task:', error);
    throw error;
  }
};

export const fetchProjectByClassId = async (classId, userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/groups/projects/by-class?class_id=${classId}&user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin dự án');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin dự án theo classId:', error);
    throw error;
  }
};