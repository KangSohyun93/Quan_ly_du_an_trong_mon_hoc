// frontend/src/pages/UserManagerPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import UserTable from "./UserTable.js";
import Pagination from "../shared/Pagination/Pagination";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal/ConfirmDeleteModal";

import "./UserManagerPage.css";
import "../../assets/styles/global.css";
import { fetchAllUser } from "../../services/user-service.js";

const UserManagerPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // ✅ Lấy dữ liệu từ API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchAllUser();

        // ⚠️ Chuyển đổi is_active -> status
        const formattedUsers = data.map((user) => ({
          ...user,
          status: user.is_active === 1 ? "active" : "banned",
        }));

        setUsers(formattedUsers);
        setTotalUsers(formattedUsers.length);
        setTotalPages(Math.ceil(formattedUsers.length / rowsPerPage));
      } catch (err) {
        console.error("Failed to fetch users", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  // ✅ Cập nhật lại phân trang khi số dòng mỗi trang thay đổi
  useEffect(() => {
    setTotalPages(Math.ceil(users.length / rowsPerPage));
    setCurrentPage(1);
  }, [rowsPerPage, users]);

  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const handleRowsPerPageChange = (e) =>
    setRowsPerPage(parseInt(e.target.value));

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleRoleChange = (e) => setSelectedRole(e.target.value);
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleAddUser = () => navigate("/admin/user-manager/add");
  const handleEditUser = (userId) =>
    navigate(`/admin/user-manager/edit/${userId}`);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  const confirmDeleteUser = () => {
    setUsers((prev) => prev.filter((u) => u.user_id !== userToDelete.user_id));
    closeDeleteModal();
  };

  const formatDisplayDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-US") : "N/A";
  // ✅ Cắt danh sách user theo trang hiện tại
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

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
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="filter-dropdown"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Instructor">Instructor</option>
          <option value="Student">Student</option>
        </select>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="filter-dropdown"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
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
          min={startDate}
        />
        <button onClick={handleAddUser} className="add-user-button">
          + Add User
        </button>
      </div>

      <UserTable
        users={currentUsers}
        onEditUser={handleEditUser}
        onDeleteUser={openDeleteModal}
        formatDate={formatDisplayDate}
        loading={loading}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalUsers}
        itemsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleRowsPerPageChange}
      />

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
