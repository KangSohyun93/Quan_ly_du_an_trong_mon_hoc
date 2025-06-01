import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./EditClassPopup.css";

const EditClassPopup = ({ classId, initialData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    class_name: "",
    semester: "",
    secret_code: "",
    instructor_id: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        class_name: initialData.class_name || "",
        semester: initialData.semester || "",
        secret_code: initialData.secret_code || "",
        instructor_id: initialData.instructor_id || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "secret_code" && value.length > 10) {
      setError("Secret code must not exceed 10 characters");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      class_id: parseInt(classId, 10),
      class_name: formData.class_name,
      semester: formData.semester,
      secret_code: formData.secret_code,
    };

    if (isNaN(payload.class_id)) {
      setError("Class ID must be a valid number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/class/update/${classId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (onUpdate) {
        onUpdate({
          class_name: payload.class_name,
          semester: payload.semester,
          secret_code: payload.secret_code,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Error updating class:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ngăn click bên trong popup làm đóng popup
  const handleContentClick = (e) => e.stopPropagation();

  // Dùng React Portal để render popup ra ngoài body
  return ReactDOM.createPortal(
    <div className="edit-class-popup-overlay" onClick={onClose}>
      <div className="edit-class-popup-content" onClick={handleContentClick}>
        <h2>Edit Class</h2>
        {error && <p className="edit-class-popup-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="edit-class-popup-form-group">
            <label htmlFor="class_name">Class Name</label>
            <input
              type="text"
              id="class_name"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              placeholder="Enter class name"
              required
            />
          </div>
          <div className="edit-class-popup-form-group">
            <label htmlFor="semester">Semester</label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="Enter semester (e.g., 2025-1)"
              required
            />
          </div>
          <div className="edit-class-popup-form-group secret-code">
            <label htmlFor="secret_code">Secret Code</label>
            <input
              type="text"
              id="secret_code"
              name="secret_code"
              value={formData.secret_code}
              onChange={handleChange}
              placeholder="Enter secret code"
            />
          </div>
          <div className="edit-class-popup-actions">
            <button
              type="button"
              onClick={onClose}
              className="edit-class-popup-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="edit-class-popup-btn-submit"
            >
              {loading ? "Updating..." : "Update Class"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditClassPopup;
