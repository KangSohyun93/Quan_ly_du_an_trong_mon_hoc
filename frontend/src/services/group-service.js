// src/services/group-service.js

export async function fetchGroupData(groupId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/group/${groupId}/introduce`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần token: 'Authorization': `Bearer ${token}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể lấy dữ liệu nhóm");
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}
