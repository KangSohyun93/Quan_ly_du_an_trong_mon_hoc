import React from "react";
import AdminSidebar from "./AdminSidebar";
import './AdminLayout.css'; // Import CSS file for styling

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
