// services/user-service.js
export async function fetchUser() {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const response = await fetch("http://localhost:5000/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Lấy thông tin người dùng thất bại");
    }

    const userData = await response.json();
    // Xử lý avatar với fallback
    userData.avatar = userData.avatar || "/assets/images/default-user.jpg";
    return userData;
  } catch (error) {
    console.error("Lỗi trong fetchUser:", error.message);
    throw error;
  }
}

export async function fetchUserData(userId) {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token để phù hợp với backend
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Lấy thông tin người dùng thất bại");
    }

    const userData = await response.json();
    // Xử lý avatar với fallback
    userData.avatar = userData.avatar || "/assets/images/default-user.jpg";
    return userData;
  } catch (error) {
    console.error("Lỗi trong fetchUserData:", error.message);
    throw error;
  }
}

export async function fetchAllUser() {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const response = await fetch("http://localhost:5000/api/user/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token nếu backend yêu cầu
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Lấy danh sách người dùng thất bại");
    }

    const users = await response.json();
    // Xử lý avatar cho tất cả người dùng
    return users.map((user) => ({
      ...user,
      avatar: user.avatar || "/assets/images/default-user.jpg",
    }));
  } catch (error) {
    console.error("Lỗi trong fetchAllUser:", error.message);
    throw error;
  }
}

export async function AdFetchClass() {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const response = await fetch("http://localhost:5000/api/class/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token nếu backend yêu cầu
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lấy danh sách lớp học thất bại");
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi trong AdFetchClass:", error.message);
    throw error;
  }
}

export async function updateUser(userId, userData) {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Cập nhật thông tin người dùng thất bại");
    }

    const updatedUser = await response.json();
    updatedUser.avatar = updatedUser.avatar || "/assets/images/default-user.jpg";
    return updatedUser;
  } catch (error) {
    console.error("Lỗi trong updateUser:", error.message);
    throw error;
  }
}

export async function createUser(userData) {
  try {
    const response = await fetch("http://localhost:5000/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Tạo người dùng thất bại");
    }

    const newUser = await response.json();
    newUser.avatar = newUser.avatar || "/assets/images/default-user.jpg";
    return newUser;
  } catch (error) {
    console.error("Lỗi trong createUser:", error.message);
    throw error;
  }
}