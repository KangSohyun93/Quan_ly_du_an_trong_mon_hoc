// profile-service.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/user";

const validateToken = (token) => {
  if (!token) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }
  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      throw new Error("Token không hợp lệ: Thiếu id hoặc userId.");
    }
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    return { ...decoded, userId };
  } catch (error) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    throw new Error(`Token không hợp lệ: ${error.message}`);
  }
};

export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log("Token được sử dụng:", token);

  try {
    validateToken(token);
    const response = await axios.get(`${API_URL}/profile/${validateToken(token).userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Phản hồi từ fetchUserProfile:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy hồ sơ:", error.response || error.message);
    if (error.response?.status === 403) {
      throw new Error("Không có quyền truy cập (403). Vui lòng đăng nhập lại.");
    } else if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập không hợp lệ (401). Vui lòng đăng nhập lại.");
    } else if (error.response?.status === 404) {
      throw new Error("Không tìm thấy người dùng (404). Vui lòng kiểm tra database.");
    }
    throw new Error(error.response?.data?.message || "Lỗi khi lấy thông tin hồ sơ");
  }
};

export const updateUserProfile = async (data) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log("Token để cập nhật hồ sơ:", token);

  try {
    const decoded = validateToken(token);
    const userId = decoded.userId;

    const response = await axios.put(`${API_URL}/profile/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Phản hồi từ updateUserProfile:", response.data);
    return response.data.user; // Trả về dữ liệu user từ response
  } catch (error) {
    console.error("Lỗi khi cập nhật hồ sơ:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
  }
};

export const changePassword = async (passwordData) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log("Token để đổi mật khẩu:", token);

  try {
    const decoded = validateToken(token);
    const userId = decoded.userId;

    const response = await axios.post(`${API_URL}/${userId}/change-password`, passwordData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Phản hồi từ changePassword:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
  }
};