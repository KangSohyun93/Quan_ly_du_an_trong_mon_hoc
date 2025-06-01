// frontend/src/components/shared/Pagination.js
import React from "react";
import "./Pagination.css";
// Đường dẫn đến file CSS của bạn
const Pagination = ({
  currentPage,
  totalPages,
  totalItems, // totalUsers
  itemsPerPage, // rowsPerPage
  onPageChange,
  onItemsPerPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số lượng nút trang tối đa hiển thị (không tính ... và đầu/cuối)
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
      // Nếu tổng số trang nhỏ, hiển thị hết
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Luôn hiển thị trang 1

      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);

      if (currentPage - halfPagesToShow <= 2) {
        endPage = Math.min(totalPages - 1, 1 + maxPagesToShow - 1);
      }
      if (currentPage + halfPagesToShow >= totalPages - 1) {
        startPage = Math.max(2, totalPages - maxPagesToShow);
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages); // Luôn hiển thị trang cuối
    }
    return pageNumbers;
  };

  if (totalItems === 0) return null; // Không hiển thị gì nếu không có item

  return (
    <div className="pagination-controls">
      <div className="rows-per-page">
        <span>Rows per page:</span>
        <select value={itemsPerPage} onChange={onItemsPerPageChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>of {totalItems} rows</span>
      </div>
      <div className="page-navigator">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          «
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {getPageNumbers().map((number, index) =>
          typeof number === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(number)}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          ) : (
            <span key={index} className="page-ellipsis">
              {number}
            </span>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
