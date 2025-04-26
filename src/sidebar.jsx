import React, { useState } from 'react';
import './css/sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedItem, setSelectedItem] = useState(false); // Mặc định "Thông báo" được chọn

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="sidebar flex">
            {/* Sidebar */}
            <div
                className={`bg-white h-screen border-r transition-all ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}
            >
                <div className="p-4">
                    {/* Logo and Toggle Button */}
                    <div className="flex items-center justify-between">
                        <img src="/assets/images/worktrace-logo.svg" alt="WorkTrace Logo" className="logo" />
                        <button
                            onClick={toggleSidebar}
                            className="open_close_sidebar"
                        >
                            <i className={isOpen ? 'fas fa-chevron-left' : 'fas fa-chevron-right'}></i>
                        </button>
                    </div>

                    {/* User Info */}
                    <a className="user-ava-name flex items-center mt-6">
                        <img
                            src="/assets/images/avatar-default.svg"
                            alt="User Avatar"
                            className="avatar mr-3"
                        />
                        <span className="user-name text-gray-700">Your name</span>
                    </a>

                    <div className="line"></div>

                    {/* Menu Items */}
                    <div className="sidebar-content mt-6">
                        <a
                            href="#"
                            className={`sidebar-item flex items-center p-2 text-gray-700 rounded ${selectedItem === 'Teams' ? 'bg-blue-100' : ''}`}
                            onClick={() => handleItemClick('Teams')}
                        >
                            <i class="icon mr-3 fa-solid fa-people-group"></i>
                            <p>Teams</p>
                        </a>
                        <a
                            href="#"
                            className={`sidebar-item flex items-center p-2 text-gray-700 rounded ${selectedItem === 'Thông báo' ? 'bg-blue-100' : ''}`}
                            onClick={() => handleItemClick('Thông báo')}
                        >
                            <i class="icon mr-3 fa-solid fa-bell"></i>
                            <p>Thông báo</p>
                        </a>
                    </div>

                    {/* Logout */}
                    {isOpen && (
                        <div className="logout absolute bottom-4 left-4">
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-700 rounded"
                            >
                                <i class="icon mr-3 fa-solid fa-right-from-bracket"></i>
                                <p>Log out</p>
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button for when sidebar is closed */}
            {!isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="open_close_sidebar fixed top-4 left-4 z-10"
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            )}
        </div>
    );
};

export default Sidebar;