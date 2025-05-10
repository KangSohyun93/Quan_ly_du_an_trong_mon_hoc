// frontend/src/components/layout/AdminSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';
import { CgLogOut } from "react-icons/cg";

// Import logo SVG
import WorkTraceLogo from '../assets/images/worktrace-logo.svg'; // Đường dẫn tới logo

// Import icons từ react-icons
import { MdDashboard, MdSettings } from 'react-icons/md'; // Material Design Icons
import { FaUsers, FaSignOutAlt } from 'react-icons/fa';    // Font Awesome Icons

const AdminSidebar = () => {
    const location = useLocation();

    // Thông tin admin, có thể lấy từ context hoặc props nếu cần
    const adminInfo = {
        avatar: 'https://m.yodycdn.com/blog/meme-meo-cute-yody-vn-80.jpg', // Link ảnh avatar mẫu
        name: 'Admin'
    };

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