const API_URL = "http://localhost:5000/api";
export const fetchPeerAssessments = async (projectId, assessorId, groupId) => {
  try {
    const response = await fetch(
      `${API_URL}/assessment/groups/${groupId}/projects/${projectId}/assessments/${assessorId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetchPeerAssessments:", error.message);
    throw error;
  }
};

export const savePeerAssessment = async (
  projectId,
  assessmentData,
  groupId
) => {
  try {
    const response = await fetch(
      `${API_URL}/assessment/groups/${groupId}/projects/${projectId}/assessments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentData),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in savePeerAssessment:", error.message);
    throw error;
  }
};

export const fetchMemberTaskStats = async (projectId, groupId) => {
  try {
    const response = await fetch(
      `${API_URL}/assessment/groups/${groupId}/projects/${projectId}/member-task-stats`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetchMemberTaskStats:", error.message);
    throw error;
  }
};
