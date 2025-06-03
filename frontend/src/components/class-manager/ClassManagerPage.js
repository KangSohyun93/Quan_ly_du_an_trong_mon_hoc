import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ClassTable from "./ClassTable"; // Đảm bảo bạn đã đổi tên file
import Pagination from "../shared/Pagination/Pagination";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal/ConfirmDeleteModal";

import "./ClassManagerPage.css";
import "../../assets/styles/global.css";

import { AdFetchClass } from "../../services/user-service"; // Đổi đúng path service API

const ClassManagerPage = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClasses, setTotalClasses] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await AdFetchClass(); // API gọi danh sách lớp học
        //console.log("Fetched classes:", data);
        setClasses(data);
        setTotalClasses(data.length);
        setTotalPages(Math.ceil(data.length / rowsPerPage));
      } catch (err) {
        console.error("Failed to fetch classes", err);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(classes.length / rowsPerPage));
    setCurrentPage(1);
  }, [rowsPerPage, classes]);

  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const handleRowsPerPageChange = (e) =>
    setRowsPerPage(parseInt(e.target.value));

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleAddClass = () => navigate("/admin/class-manager/add");
  const handleEditClass = (classId) =>
    navigate(`/admin/class-manager/edit/${classId}`);

  const openDeleteModal = (cls) => {
    setClassToDelete(cls);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  const confirmDeleteClass = () => {
    setClasses((prev) =>
      prev.filter((cls) => cls.classId !== classToDelete.classId)
    );
    closeDeleteModal();
  };

  const formatDisplayDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-US") : "N/A";

  // Lọc theo search term, nhớ kiểm tra tránh lỗi undefined
  const filteredClasses = classes.filter((cls) =>
    (cls.className ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirst, indexOfLast);

  return (
    <div className="class-manager-page">
      <div className="controls-bar">
        <input
          type="search"
          className="search-input"
          placeholder="Search class name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleAddClass} className="add-user-button">
          + Add Class
        </button>
      </div>

      <ClassTable
        classes={currentClasses}
        onEditClass={handleEditClass}
        onDeleteClass={openDeleteModal}
        formatDate={formatDisplayDate}
        loading={loading}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredClasses.length}
        itemsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleRowsPerPageChange}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteClass}
        itemName={classToDelete?.className}
        itemType="class"
        errorMessage={deleteError}
      />
    </div>
  );
};

export default ClassManagerPage;
