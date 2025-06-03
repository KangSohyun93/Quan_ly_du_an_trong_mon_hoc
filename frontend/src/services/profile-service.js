const API_URL = "http://localhost:5000/api/user";

export const fetchUserProfile = async () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  try {
    const res = await fetch(`${API_URL}/profile/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw res;

    const data = await res.json();
    return data;
  } catch (err) {
    const message = await extractErrorMessage(err);
    throw new Error(message);
  }
};

export const updateUserProfile = async (data) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  try {
    const res = await fetch(`${API_URL}/profile/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Không cần set Content-Type nếu dùng FormData — trình duyệt tự động thêm multipart boundary
      },
      body: data,
    });

    if (!res.ok) throw res;

    const responseData = await res.json();
    return responseData.user;
  } catch (err) {
    const message = await extractErrorMessage(err);
    throw new Error(message);
  }
};

export const changePassword = async (passwordData) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  try {
    const res = await fetch(`${API_URL}/${userId}/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    if (!res.ok) throw res;

    return await res.json();
  } catch (err) {
    const message = await extractErrorMessage(err);
    throw new Error(message);
  }
};

// Helper để trích xuất lỗi từ Response object hoặc Error object
async function extractErrorMessage(err) {
  if (err instanceof Response) {
    try {
      const errorData = await err.json();
      return errorData.message || `Lỗi HTTP ${err.status}`;
    } catch {
      return `Lỗi HTTP ${err.status}`;
    }
  }
  return err.message || "Đã xảy ra lỗi";
}
