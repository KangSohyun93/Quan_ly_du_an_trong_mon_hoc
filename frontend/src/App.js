// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserManagerPage from './pages/UserManagerPage';
import AdminLayout from './components/AdminLayout'; // Import AdminLayout
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage'; // Ví dụ
// import ConfigurationPage from './pages/ConfigurationPage'; // Ví dụ

function App() {
  // Giả sử có logic kiểm tra admin đã đăng nhập hay chưa
  const isAdminAuthenticated = true; // Thay bằng logic thật

  return (
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} /> */}

        {/* Các route sử dụng AdminLayout */}
        <Route
          path="/admin/*" // Bắt tất cả các path bắt đầu bằng /admin/
          element={
            isAdminAuthenticated ? (
              <AdminLayout>
                <Routes> {/* Routes lồng nhau cho các page bên trong layout */}
                  {/* <Route path="dashboard" element={<DashboardPage />} /> */}
                  <Route path="user-manager" element={<UserManagerPage />} />
                  {/* <Route path="configuration" element={<ConfigurationPage />} /> */}
                  {/* Route mặc định cho /admin, ví dụ chuyển đến dashboard */}
                  <Route path="*" element={<Navigate to="user-manager" replace />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace /> // Nếu chưa đăng nhập, chuyển về trang login
            )
          }
        />

        {/* Route mặc định của ứng dụng */}
        <Route path="*" element={
          isAdminAuthenticated ? <Navigate to="/admin/user-manager" replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
  );
}

export default App;