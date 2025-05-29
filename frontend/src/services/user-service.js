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
