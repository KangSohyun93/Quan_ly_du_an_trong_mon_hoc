// frontend/src/pages/UserManagerPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Vẫn giữ nếu cần cho Add/Edit

import UserTable from '../components/user_manager/UserTable';
import Pagination from '../components/shared/Pagination';
import ConfirmDeleteModal from '../components/shared/ConfirmDeleteModal';

import '../assets/styles/UserManagerPage.css'; // Giả sử bạn có file CSS riêng cho trang này
import '../assets/styles/global.css';

const UserManagerPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null); // Lỗi khi fetch
    const [deleteError, setDeleteError] = useState(null); // Lỗi khi xóa (trong modal)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // State cho filter date
    const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
    const [endDate, setEndDate] = useState('');     // YYYY-MM-DD

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // const navigate = useNavigate();

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            if (currentPage !== 1) setCurrentPage(1); // Reset về trang 1 khi search mới
            else fetchUsers(); // Nếu đã ở trang 1, fetch luôn
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    // Fetch users function
    const fetchUsers = useCallback(async (page = currentPage) => {
        setLoading(true);
        setFetchError(null);
        try {
            const params = {
                page,
                limit: rowsPerPage,
                search: debouncedSearchTerm,
                role: selectedRole,
                status: selectedStatus,
                startDate: startDate, // Thêm startDate
                endDate: endDate,   // Thêm endDate
            };
            Object.keys(params).forEach(key => (params[key] === '' || params[key] === null || params[key] === undefined) && delete params[key]);

            const response = await axios.get('/api/users', { params });
            setUsers(response.data.users);
            setTotalPages(response.data.pagination.totalPages);
            setTotalUsers(response.data.pagination.totalUsers);
            setCurrentPage(response.data.pagination.currentPage); // Cập nhật currentPage từ response
        } catch (err) {
            setFetchError(err.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu người dùng.");
            console.error("Lỗi fetchUsers:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, rowsPerPage, debouncedSearchTerm, selectedRole, selectedStatus, startDate, endDate]); // Thêm startDate, endDate vào dependencies

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearchTerm, selectedRole, selectedStatus, startDate, endDate, rowsPerPage, currentPage]); // Bỏ fetchUsers, thêm dependencies trực tiếp

    const handlePageChange = (newPage) => {
        if (newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value);
        if (newRowsPerPage !== rowsPerPage) {
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1); // Reset về trang 1
        }
    };

    // Handlers cho filter
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleRoleChange = (e) => { setSelectedRole(e.target.value); setCurrentPage(1); };
    const handleStatusChange = (e) => { setSelectedStatus(e.target.value); setCurrentPage(1); };
    const handleStartDateChange = (e) => { setStartDate(e.target.value); setCurrentPage(1); };
    const handleEndDateChange = (e) => { setEndDate(e.target.value); setCurrentPage(1); };


    const handleAddUser = () => alert("Chức năng Add User sẽ được chuyển đến trang riêng.");
    const handleEditUser = (userId) => alert(`Chức năng Edit User cho ID: ${userId} sẽ được chuyển đến trang riêng.`);

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteError(null); // Reset lỗi xóa cũ
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => setShowDeleteModal(false);

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setDeleteError(null);
        try {
            await axios.delete(`/api/users/${userToDelete.user_id}`);
            closeDeleteModal();
            fetchUsers(users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage); // Fetch lại, nếu xóa item cuối của trang thì lùi trang
            alert(`Người dùng ${userToDelete.username} đã được xóa.`);
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Lỗi khi xóa người dùng.");
            console.error("Lỗi confirmDeleteUser:", err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD cho input date
    };
    const formatDisplayDate = (dateString) => { // Dùng cho hiển thị trong bảng
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };


    return (
        <div className="user-manager-page">
            <div className="controls-bar">
                <input
                    type="search"
                    className="search-input"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={selectedRole} onChange={handleRoleChange} className="filter-dropdown">
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Student">Student</option>
                </select>
                <select value={selectedStatus} onChange={handleStatusChange} className="filter-dropdown">
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                </select>
                {/* Date Filters */}
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="filter-dropdown date-filter"
                    title="Start Date"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="filter-dropdown date-filter"
                    title="End Date"
                    min={startDate} // End date không được trước start date
                />
                <button onClick={handleAddUser} className="add-user-button">+ Add User</button>
            </div>

            {fetchError && <p className="error-text feedback-message">Lỗi: {fetchError}</p>}

            <UserTable
                users={users}
                onEditUser={handleEditUser}
                onDeleteUser={openDeleteModal}
                formatDate={formatDisplayDate} // Truyền hàm format cho hiển thị
                loading={loading}
            />

            {!loading && totalUsers > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalUsers}
                    itemsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleRowsPerPageChange}
                />
            )}

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteUser}
                itemName={userToDelete?.username}
                itemType="user"
                errorMessage={deleteError}
            />
        </div>
    );
};

export default UserManagerPage;