const API_URL = 'http://localhost:5000/api';

const fetchGroupsByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/groups?user_id=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.warn('Dữ liệu trả về từ API không phải là mảng:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error in fetchGroupsByUserId:', error.message);
    throw error;
  }
};

const fetchGroupsByInstructorId = async (instructorId) => {
  try {
    const response = await fetch(`${API_URL}/groups/instructor?instructor_id=${instructorId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.warn('Dữ liệu trả về từ API không phải là mảng:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error in fetchGroupsByInstructorId:', error.message);
    throw error;
  }
};

const fetchProjectByClassId = async (userId, classId) => {
  try {
    const response = await fetch(`${API_URL}/groups/by-class?class_id=${classId}&user_id=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchProjectByClassId:', error.message);
    throw error;
  }
};

const fetchProjectById = async (projectId) => {
  try {
    const response = await fetch(`${API_URL}/groups/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchProjectById:', error.message);
    throw error;
  }
};

const fetchTasksBySprintId = async (sprintId) => {
  try {
    const response = await fetch(`${API_URL}/groups/projects/0/sprints/${sprintId}/tasks`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchTasksBySprintId:', error.message);
    throw error;
  }
};

const fetchGroupMembers = async (projectId) => {
  try {
    const response = await fetch(`${API_URL}/groups/projects/${projectId}/members`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchGroupMembers:', error.message);
    throw error;
  }
};

const fetchPeerAssessments = async (projectId, assessorId) => {
  try {
    const response = await fetch(`${API_URL}/groups/projects/${projectId}/assessments/${assessorId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchPeerAssessments:', error.message);
    throw error;
  }
};

const savePeerAssessment = async (projectId, assessmentData) => {
  try {
    const response = await fetch(`${API_URL}/groups/projects/${projectId}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessmentData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in savePeerAssessment:', error.message);
    throw error;
  }
};

const fetchMemberTaskStats = async (projectId) => {
  try {
    const response = await fetch(`${API_URL}/groups/projects/${projectId}/member-task-stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchMemberTaskStats:', error.message);
    throw error;
  }
};

export { fetchGroupsByUserId, fetchGroupsByInstructorId, fetchProjectByClassId, fetchProjectById, fetchTasksBySprintId, fetchGroupMembers, fetchPeerAssessments, savePeerAssessment, fetchMemberTaskStats };