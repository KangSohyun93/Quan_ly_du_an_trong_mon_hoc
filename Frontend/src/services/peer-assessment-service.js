// src/services/peer-assessment-service.js
export async function fetchPeerAssessments({ groupId, projectId, assessorId }) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/peerassessment/groups/${groupId}/projects/${projectId}/peerassessments/${assessorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần token: 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể lấy dữ liệu đánh giá");
    }
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function savePeerAssessment({ groupId, projectId, assessmentData }) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/peerassessment/groups/${groupId}/projects/${projectId}/peerassessments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần token: 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(assessmentData),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể lưu đánh giá");
    }
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function updatePeerAssessment({ groupId, projectId, assessmentId, assessmentData }) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/peerassessment/groups/${groupId}/projects/${projectId}/peerassessments/${assessmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần token: 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(assessmentData),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể cập nhật đánh giá");
    }
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function fetchMemberTaskStats({ groupId, projectId }) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/peerassessment/groups/${groupId}/projects/${projectId}/member-task-stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần token: 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể lấy thống kê nhiệm vụ của thành viên");
    }
    return await response.json();
  } catch (err) {
    throw err;
  }
}