// frontend/src/components/shared/ConfirmDeleteModal.js
import React from "react";
import "./ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName, // Ví dụ: userToDelete.username
  itemType = "item", // Ví dụ: "user"
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h4>Confirm Delete</h4>
        <p>
          Are you sure you want to delete this {itemType}
          {itemName && <strong>: {itemName}</strong>}?
        </p>
        {errorMessage && (
          <p className="error-text feedback-message modal-error">
            {errorMessage}
          </p>
        )}
        <div className="modal-actions">
          <button onClick={onClose} className="button-secondary">
            No, Cancel
          </button>
          <button onClick={onConfirm} className="button-danger">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
