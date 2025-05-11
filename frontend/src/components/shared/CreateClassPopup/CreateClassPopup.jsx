import React, { useState, useEffect } from 'react';
import './CreateClassPopup.css';

const CreateClassPopup = ({ onClose, onCreate, instructorId }) => {
  const [formData, setFormData] = useState({
    classId: '',
    className: '',
    semester: '',
    code: '',
    instructorId: instructorId || '', // Nhận instructorId từ props
  });
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState(null);

  // Tạo danh sách học kỳ dựa trên năm hiện tại (2025)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];
    const semesterOptions = [];

    years.forEach(year => {
      semesterOptions.push(`${year}.1`);
      semesterOptions.push(`${year}.2`);
      semesterOptions.push(`${year}.3`);
    });

    setSemesters(semesterOptions);
    setFormData(prev => ({ ...prev, semester: `${currentYear}.1` }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Kiểm tra độ dài code không vượt quá 10 ký tự
    if (name === 'code' && value.length > 10) {
      setError('Secret code must not exceed 10 characters');
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Xóa lỗi khi người dùng nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Chuyển classId sang số nguyên
    const classIdAsInt = parseInt(formData.classId, 10);
    if (isNaN(classIdAsInt)) {
      setError('Class ID must be a valid number');
      return;
    }

    // Chuẩn bị dữ liệu gửi đến backend với tên trường khớp với database
    const payload = {
      class_id: classIdAsInt,
      class_name: formData.className,
      semester: formData.semester,
      secret_code: formData.code,
      instructor_id: parseInt(formData.instructorId, 10),
    };

    try {
      const response = await fetch('http://localhost:5000/api/classes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create class');
      }

      if (onCreate) {
        onCreate({
          classId: payload.class_id,
          className: payload.class_name,
          semester: payload.semester,
          code: payload.secret_code,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message);
      console.error('Error creating class:', err);
    }
  };

  return (
    <div className="CreateClassPopup-overlay">
      <div className="CreateClassPopup-popup">
        <h2 className="CreateClassPopup-title">Create Class</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="CreateClassPopup-form-group">
            <label className="CreateClassPopup-label">ID Class</label>
            <input
              type="text"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              placeholder="Enter ID class"
              className="CreateClassPopup-input"
              required
            />
          </div>
          <div className="CreateClassPopup-form-group">
            <label className="CreateClassPopup-label">Name Class</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              placeholder="Enter name class"
              className="CreateClassPopup-input"
              required
            />
          </div>
          <div className="CreateClassPopup-form-group">
            <label className="CreateClassPopup-label">Học kỳ</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="CreateClassPopup-input"
              required
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
          <div className="CreateClassPopup-form-group">
            <label className="CreateClassPopup-label">Code (If you don't input, it will random)</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter code"
              className="CreateClassPopup-input"
            />
          </div>
          <button type="submit" className="CreateClassPopup-button">Create</button>
        </form>
        <button onClick={onClose} className="CreateClassPopup-close-button">×</button>
      </div>
    </div>
  );
};

export default CreateClassPopup;