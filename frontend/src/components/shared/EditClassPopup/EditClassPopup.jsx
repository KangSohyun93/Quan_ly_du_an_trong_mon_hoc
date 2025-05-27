import React, { useState, useEffect } from 'react';
import './EditClassPopup.css';

const EditClassPopup = ({ classId, initialData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    class_name: '',
    semester: '',
    secret_code: '',
    instructor_id: '', // Thêm instructor_id để khớp với backend
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Khởi tạo dữ liệu ban đầu từ initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        class_name: initialData.class_name || '',
        semester: initialData.semester || '',
        secret_code: initialData.secret_code || '',
        instructor_id: initialData.instructor_id || '', // Đảm bảo instructor_id được điền
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Kiểm tra độ dài code không vượt quá 10 ký tự
    if (name === 'secret_code' && value.length > 10) {
      setError('Secret code must not exceed 10 characters');
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Xóa lỗi khi người dùng nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Chuẩn bị dữ liệu gửi đến backend với tên trường khớp với database
    const payload = {
      class_id: parseInt(classId, 10), // Chuyển classId thành số nguyên
      class_name: formData.class_name,
      semester: formData.semester,
      secret_code: formData.secret_code,
      instructor_id: parseInt(formData.instructor_id, 10), // Đảm bảo là số nguyên
    };

    // Kiểm tra định dạng
    if (isNaN(payload.class_id)) {
      setError('Class ID must be a valid number');
      setLoading(false);
      return;
    }
    if (isNaN(payload.instructor_id)) {
      setError('Instructor ID must be a valid number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update class');
      }

      if (onUpdate) {
        onUpdate({
          class_name: payload.class_name,
          semester: payload.semester,
          secret_code: payload.secret_code,
          instructor_id: payload.instructor_id,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message);
      console.error('Error updating class:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="edit-class-popup-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="edit-class-popup-content"
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '400px',
          maxWidth: '90%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '20px', textAlign: 'center' }}>
          Edit Class
        </h2>
        {error && (
          <p style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="class_name"
              style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
            >
              Class Name
            </label>
            <input
              type="text"
              id="class_name"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              placeholder="Enter class name"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="semester"
              style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
            >
              Semester
            </label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="Enter semester (e.g., 2025-1)"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="secret_code"
              style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
            >
              Secret Code
            </label>
            <input
              type="text"
              id="secret_code"
              name="secret_code"
              value={formData.secret_code}
              onChange={handleChange}
              placeholder="Enter secret code"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="instructor_id"
              style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
            >
              Instructor ID
            </label>
            <input
              type="text"
              id="instructor_id"
              name="instructor_id"
              value={formData.instructor_id}
              onChange={handleChange}
              placeholder="Enter instructor ID"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: loading ? '#ccc' : '#4a90e2',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              {loading ? 'Updating...' : 'Update Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClassPopup;