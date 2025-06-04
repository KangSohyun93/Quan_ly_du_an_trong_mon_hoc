const API_URL = "http://localhost:5000/api/peerassessment";

const getToken = () => {
  const token = sessionStorage.getItem("token");
  console.log("DEBUG: sessionStorage token =", token); // Debug
  return token;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.message || "Lỗi không xác định";
    throw new Error(errorMessage);
  }
  return data;
};

export const fetchInstructorEvaluations = async ({ groupId, projectId }) => {
  const token = getToken();
  if (!token) {
    console.error("No token found in sessionStorage");
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  const response = await fetch(
    `${API_URL}/groups/${groupId}/projects/${projectId}/instructor-evaluations`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
};

export const saveInstructorEvaluation = async ({
  groupId,
  projectId,
  evaluationData,
}) => {
  const token = getToken();
  if (!token) {
    console.error("No token found in sessionStorage");
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  const response = await fetch(
    `${API_URL}/groups/${groupId}/projects/${projectId}/instructor-evaluations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(evaluationData),
    }
  );

  return handleResponse(response);
};

export const updateInstructorEvaluation = async ({
  groupId,
  projectId,
  evaluationId,
  evaluationData,
}) => {
  const token = getToken();
  if (!token) {
    console.error("No token found in sessionStorage");
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  const response = await fetch(
    `${API_URL}/groups/${groupId}/projects/${projectId}/instructor-evaluations/${evaluationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(evaluationData),
    }
  );

  return handleResponse(response);
};

export async function fetchPeerAssessments({ groupId, projectId, assessorId }) {
  const token = getToken();
  if (!token) {
    console.error("No token found in sessionStorage");
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  const response = await fetch(
    `${API_URL}/groups/${groupId}/projects/${projectId}/peerassessments/${assessorId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}

export async function savePeerAssessment({ groupId, projectId, assessmentData }) {
  const token = getToken();
  if (!token) {
    console.error("No token found in sessionStorage");
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  const response = await fetch(
    `${API_URL}/groups/${groupId}/projects/${projectId}/peerassessments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(assessmentData),
    }
  );

  return handleResponse(response);
}

export async function updatePeerAssessment({
  groupId,
  projectId,
  assessmentId,
  assessmentData,
}) {
  const token = getToken();
  if (!token) {
    console.error("No token found in sessionStorage");
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  const response = await fetch(
    `${API_URL}/groups/${groupId}/projects/${projectId}/peerassessments/${assessmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(assessmentData),
    }
  );

  return handleResponse(response);
}

export async function fetchMemberTaskStats({ groupId, projectId }) {
  const token = getToken();
  if (!token) {
    console.error("No token found in sessionStorage");
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  const response = await fetch(
    `${API_URL}/groups/${groupId}/projects/${projectId}/member-task-stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}