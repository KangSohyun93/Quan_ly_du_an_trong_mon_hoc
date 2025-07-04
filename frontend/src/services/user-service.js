export async function fetchUser(credentials) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/user", {
      // Sửa URL backend
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lấy thông tin người dùng thất bại");
    }

    return await response.json(); // Thường trả về { token, user }
  } catch (error) {
    throw error;
  }
}
export async function fetchUserData(userId) {
  try {
    const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
      // Sửa URL backend
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lấy thông tin người dùng thất bại");
    }

    return await response.json(); // Thường trả về { token, user }
  } catch (error) {
    throw error;
  }
}
export async function fetchAllUser(credentials) {
  try {
    const response = await fetch("http://localhost:5000/api/user/all", {
      // Sửa URL backend
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lấy thông tin người dùng thất bại");
    }

    return await response.json(); // Thường trả về { token, user }
  } catch (error) {
    throw error;
  }
}
export async function AdFetchClass() {
  try {
    const response = await fetch("http://localhost:5000/api/class/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lấy danh sách lớp học thất bại");
    }

    return await response.json(); // Trả về danh sách lớp học
  } catch (error) {
    throw error;
  }
}
export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
      // Sửa URL backend
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Cập nhật thông tin người dùng thất bại"
      );
    }

    return await response.json(); // Trả về thông tin người dùng đã cập nhật
  } catch (error) {
    throw error;
  }
}
export async function createUser(userData) {
  try {
    const response = await fetch("http://localhost:5000/api/user", {
      // Sửa URL backend
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

    return await response.json(); // Trả về thông tin người dùng đã tạo
  } catch (error) {
    throw error;
  }
}
