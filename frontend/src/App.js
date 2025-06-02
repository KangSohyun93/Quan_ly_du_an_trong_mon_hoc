import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard';

import './App.css';

function App() {
  return (
    <Router>
      <div className="sidebar-page"> {/* Giữ nguyên class name nếu CSS của bạn dùng nó */}
        <Sidebar />
        <Routes>
          {/* Định nghĩa các Route của bạn ở đây */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Thêm các Route khác nếu có, ví dụ:
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
