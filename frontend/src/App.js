// frontend/src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagerPage from './pages/UserManagerPage';
import AdminLayout from './components/AdminLayout'; // Import AdminLayout
import { NotificationProvider } from './components/shared/NotificationContext'; // Thêm dòng này
import NotificationDisplay from './components/shared/NotificationDisplay';
import AddUserPage from './pages/AddUserPage'; // Sẽ tạo file này
import EditUserPage from './pages/EditUserPage'; // Sẽ tạo file này 
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage'; // Ví dụ
// import ConfigurationPage from './pages/ConfigurationPage'; // Ví dụ
const DashboardPage = () => <div>Admin Dashboard Content (Placeholder)</div>;
const ConfigurationPage = () => <div>Admin Configuration Content (Placeholder)</div>;
const LoginPage = () => <div>Login Page Content (Placeholder - sẽ làm sau)</div>;
function App() {
  // Giả sử có logic kiểm tra admin đã đăng nhập hay chưa
  const isAdminAuthenticated = true; // Thay bằng logic thật

  return (

    <NotificationProvider>
      
        <NotificationDisplay /> {/* Hiển thị component thông báo ở đây, bên trong Router */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Các route sử dụng AdminLayout */}
          <Route
            path="/admin/*" // Bắt tất cả các path bắt đầu bằng /admin/
            element={
              isAdminAuthenticated ? (
                <AdminLayout>
                  <Routes> {/* Routes lồng nhau cho các page bên trong layout */}
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="user-manager" element={<UserManagerPage />} />
                    <Route path="configuration" element={<ConfigurationPage />} />
                    {/* Route mặc định cho /admin, ví dụ chuyển đến dashboard */}
                    {/* Sửa lại route mặc định cho /admin để trỏ đến dashboard hoặc user-manager */}
                    <Route index element={<Navigate to="dashboard" replace />} /> 
                    {/* Hoặc <Route index element={<Navigate to="user-manager" replace />} /> */}
                     <Route path="user-manager/add" element={<AddUserPage />} />
                  <Route path="user-manager/edit/:userId" element={<EditUserPage />} />
                  <Route path="configuration" element={<ConfigurationPage />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                  {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> Fallback cho các route con không khớp */}
                  </Routes>
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace /> // Nếu chưa đăng nhập, chuyển về trang login
              )
            }
          />

          {/* Route mặc định của ứng dụng */}
          {/* Sửa lại logic Navigate ở đây cho rõ ràng hơn */}
          <Route 
            path="/" 
            element={
              isAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          {/* Route bắt lỗi 404 chung cho toàn ứng dụng */}
          <Route path="*" element={<div>404 Page Not Found - Main Level</div>} />

        </Routes>
    </NotificationProvider>
  );
}

export default App;