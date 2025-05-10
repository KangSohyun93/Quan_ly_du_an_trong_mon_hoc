// frontend/src/components/user_manager/UserTable.js
import React from 'react';

const UserTable = ({ users, onEditUser, onDeleteUser, formatDate, loading }) => {
    if (loading && users.length === 0) {
        return <p className="loading-text table-feedback">Đang tải danh sách người dùng...</p>;
    }
    if (!loading && users.length === 0) {
        return <p className="no-data-text table-feedback">Không tìm thấy người dùng nào.</p>;
    }

    return (
        <div className="user-table-container">
            <table>
                <thead>
                    <tr>
                        <th>UserID</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && users.length > 0 && ( // Hiển thị khi đang load nhưng đã có data cũ
                        <tr><td colSpan="7" className="loading-text table-feedback">Đang cập nhật...</td></tr>
                    )}
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{String(user.user_id).padStart(3, '0')}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>
                                <span className={`status-badge ${user.is_active ? 'status-active' : 'status-banned'}`}>
                                    {user.is_active ? 'Active' : 'Banned'}
                                </span>
                            </td>
                            <td>{user.role}</td>
                            <td>{formatDate(user.created_at)}</td>
                            <td>
                                <button onClick={() => onEditUser(user.user_id)} className="action-icon edit-icon" title="Edit User">
                                    ✏️
                                </button>
                                <button onClick={() => onDeleteUser(user)} className="action-icon delete-icon" title="Delete User">
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;