// Gọi API class_search_join
export async function getInfoClass() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Không có token, yêu cầu đăng nhập");
  }
  try {
    const response = await fetch(
      "http://localhost:5000/api/class/get-info-class",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không lấy được dữ liệu");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function getClassByGv() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Không có token, yêu cầu đăng nhập");
  }
  try {
    const response = await fetch(`http://localhost:5000/api/class/instructor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không lấy được dữ liệu");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function SearchClass({ searchText }) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Không có token, yêu cầu đăng nhập");
  }
  try {
    const response = await fetch(
      `http://localhost:5000/api/class/search?searchText=${searchText}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không lấy được dữ liệu");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function JoinClass({ joinCode }) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Không có token, yêu cầu đăng nhập");
  }
  try {
    const response = await fetch("http://localhost:5000/api/class/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: joinCode }), // Truyền dữ liệu chỉ có joinCode
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không lấy được dữ liệu");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function ImportClass(formData, classId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/class/${classId}/import`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không lấy được dữ liệu");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function CreateClass(formData) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Không có token, yêu cầu đăng nhập");
  }
  try {
    const response = await fetch("http://localhost:5000/api/class/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không tạo được lớp học");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
