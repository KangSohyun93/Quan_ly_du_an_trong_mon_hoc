import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ClassTable from "./ClassTable";
import Pagination from "../shared/Pagination/Pagination";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal/ConfirmDeleteModal";
import EditClassPopup from "../shared/EditClassPopup/EditClassPopup"; // Import popup

import "./ClassManagerPage.css";
import "../../assets/styles/global.css";

import { AdFetchClass } from "../../services/user-service";

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

  // Thêm state cho popup chỉnh sửa
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await AdFetchClass();
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

  // Sửa handleEditClass để mở popup thay vì điều hướng
  const handleEditClass = (cls) => {
    setClassToEdit(cls); // Lưu dữ liệu lớp học cần chỉnh sửa
    setShowEditPopup(true); // Hiển thị popup
  };

  const handleUpdateClass = (updatedData) => {
    // Cập nhật dữ liệu lớp học trong danh sách
    setClasses((prev) =>
      prev.map((cls) =>
        cls.classId === classToEdit.classId
          ? { ...cls, ...updatedData }
          : cls
      )
    );
    setShowEditPopup(false); // Đóng popup sau khi cập nhật
    setClassToEdit(null); // Xóa dữ liệu lớp học đang chỉnh sửa
  };

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

      {/* Hiển thị popup chỉnh sửa */}
      {showEditPopup && classToEdit && (
        <EditClassPopup
          classId={classToEdit.classId}
          initialData={{
            class_name: classToEdit.className,
            semester: classToEdit.semester,
            secret_code: classToEdit.secretCode || "",
            instructor_id: classToEdit.instructorId || "",
          }}
          onClose={() => {
            setShowEditPopup(false);
            setClassToEdit(null);
          }}
          onUpdate={handleUpdateClass}
        />
      )}
    </div>
  );
};

export default ClassManagerPage;