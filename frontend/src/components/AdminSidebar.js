// frontend/src/components/layout/AdminSidebar.js
import React, {useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminSidebar.css';
import { CgLogOut } from "react-icons/cg";

// Import logo SVG
import WorkTraceLogo from '../assets/images/worktrace-logo.svg'; // Đường dẫn tới logo
import defaultAvatar from '../assets/images/avatar-default.svg'; // Đường dẫn tới ảnh avatar mặc định
// Import icons từ react-icons
import { MdDashboard, MdSettings } from 'react-icons/md'; // Material Design Icons
import { FaUsers} from 'react-icons/fa';    // Font Awesome Icons

const AdminSidebar = () => {
    const location = useLocation();

    // Thông tin admin, có thể lấy từ context hoặc props nếu cần
    const [adminInfo, setAdminInfo] = useState({ // State để lưu thông tin admin
        avatar: defaultAvatar, // Ảnh placeholder
        name: 'Admin',
        role: 'Admin' // Role mặc định
    });
    const [loadingAdmin, setLoadingAdmin] = useState(true);

    const ADMIN_USER_ID = '034'; // ID admin giả định

    useEffect(() => {
        const fetchAdminDetails = async () => {
            setLoadingAdmin(true);
            try {
                // Thay thế bằng logic lấy adminId thật sau này
                const response = await axios.get(`/api/users/${ADMIN_USER_ID}`);
                const adminData = response.data;
                if (adminData && adminData.role === 'Admin') { // Chỉ cập nhật nếu user là Admin
                    setAdminInfo({
                        avatar: adminData.avatar || defaultAvatar, // Avatar từ DB hoặc fallback
                        name: adminData.username, // Tên từ DB
                        role: adminData.role // Role từ DB
                    });
                } else {
                    // Nếu user không phải Admin hoặc không tìm thấy, giữ thông tin mặc định hoặc xử lý khác
                    console.warn(`User with ID ${ADMIN_USER_ID} is not an Admin or not found.`);
                }
            } catch (error) {
                console.error('Failed to fetch admin details:', error);
                // Giữ thông tin mặc định nếu có lỗi
            } finally {
                setLoadingAdmin(false);
            }
        };

        fetchAdminDetails();
    }, [ADMIN_USER_ID]); // Chạy khi ADMIN_USER_ID thay đổi (mặc dù ở đây nó là hằng số)    

    const menuItems = [
        { path: '/admin/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
        { path: '/admin/user-manager', icon: <FaUsers />, label: 'User manager' },
        { path: '/admin/configuration', icon: <MdSettings />, label: 'Configuration' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <img src={WorkTraceLogo} alt="WorkTrace Logo" className="sidebar-logo-brand" />
                {/* Tên WorkTrace có thể không cần nếu logo đã bao gồm chữ */}
            </div>
            <div className="admin-profile">
                <img src={adminInfo.avatar} alt={adminInfo.name} className="admin-avatar" />
                <span className="admin-name">{adminInfo.name}</span>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map(item => (
                        <li key={item.path} className={location.pathname.startsWith(item.path) ? 'active' : ''}>
                            <Link to={item.path}>
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <Link to="/logout" className="logout-link"> {/* Giả sử có trang /logout */}
                    <span className="nav-icon"><CgLogOut /></span>
                    <span className="nav-label">Log out</span>
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;