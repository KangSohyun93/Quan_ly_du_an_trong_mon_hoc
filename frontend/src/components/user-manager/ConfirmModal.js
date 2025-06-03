
import React from "react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Yes, Proceed",
  cancelText = "No, Cancel",
  confirmButtonClass = "button-primary", 
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h4>{title}</h4>
        <p>{message}</p>
        {errorMessage && (
          <p className="error-text feedback-message modal-error">
            {errorMessage}
          </p>
        )}
        <div className="modal-actions">
          <button onClick={onClose} className="button-secondary">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={confirmButtonClass}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
