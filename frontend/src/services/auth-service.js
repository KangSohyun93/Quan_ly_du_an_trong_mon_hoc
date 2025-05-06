// src/services/auth-service.js

// Gọi API đăng nhập
export async function loginUser(credentials) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {  // Sửa URL backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Đăng nhập thất bại');
    }

    return await response.json(); // Thường trả về { token, user }
  } catch (error) {
    throw error;
  }
}

// Gọi API đăng ký
export async function registerUser(userData) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {  // Sửa URL backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Đăng ký thất bại');
    }

    return await response.json(); // Thường trả về { message: 'Đăng ký thành công' } hoặc { token, user }
  } catch (error) {
    throw error;
  }
}
