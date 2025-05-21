// frontend/src/pages/AddUserPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../components/shared/NotificationContext';
import '../assets/styles/AddUserPage.css'; // Sẽ tạo file CSS này
import '../assets/styles/global.css'; // Global styles

// Giả sử thông tin admin đăng nhập được lấy từ một nơi nào đó (ví dụ: context, localStorage sau khi login)
// Tạm thời hardcode để minh họa
const LOGGED_IN_ADMIN = {
    id: 1, // ID của admin, để tránh trường hợp tự tạo user trùng tên/email với chính mình nếu có logic đó
    username: 'AdminUser' // Tên admin để hiển thị "Created By"
};

const AddUserPage = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState({
        fullName: '', // Sẽ map sang username ở backend
        email: '',
        password: '',
        confirmPassword: '',
        role: '', // Giá trị mặc định cho role, ví dụ 'Student'
        // avatar: null, // Tạm thời bỏ qua upload avatar
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [availableRoles, setAvailableRoles] = useState([]);

    const todayDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    // Fetch available roles
    const fetchRoles = useCallback(async () => {
        try {
            const response = await axios.get('/api/users/roles');
            const roles = response.data.roles || [];
            setAvailableRoles(roles);
            if (roles.length > 0 && !formData.role) { // Set role mặc định nếu chưa có
                setFormData(prev => ({ ...prev, role: roles.includes('Student') ? 'Student' : roles[0] }));
            }
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            addNotification("Could not load user roles.", "error");
        }
    }, [addNotification, formData.role]); // Thêm formData.role vào dependency

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) { // Xóa lỗi khi người dùng bắt đầu nhập lại
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
        if (name === 'password' && errors.confirmPassword) {
             setErrors(prevErrors => ({ ...prevErrors, confirmPassword: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
        else if (formData.fullName.trim().length < 3) newErrors.fullName = "Full Name must be at least 3 characters.";

        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";

        if (!formData.password) newErrors.password = "Password is required.";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";

        if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required.";
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

        if (!formData.role) newErrors.role = "Permission (Role) is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            addNotification("Please correct the errors in the form.", "error");
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                username: formData.fullName.trim(), // Map fullName sang username
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role,
                // avatar: formData.avatar, // Nếu có xử lý avatar
            };
            await axios.post('/api/users', payload);
            addNotification("User created successfully!", 'success');
            navigate('/admin/user-manager');
        } catch (error) {
            console.error("Error creating user:", error);
            addNotification(error.response?.data?.message || "Failed to create user.", 'error');
            // Nếu lỗi là do username/email đã tồn tại, backend sẽ trả về message cụ thể
            // Ví dụ: if (error.response?.data?.field === 'username') setErrors(prev => ({...prev, fullName: error.response.data.message}))
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="add-user-page-container form-container">
            <div className="form-header">
                <h2>Add User</h2>
                <button onClick={() => navigate('/admin/user-manager')} className="button-back">
                    {/* < Back to User List */}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="user-form add-user-form-layout"> {/* Sử dụng class layout mới nếu cần */}
                 {/* Mockup hình ảnh không có cột trái như Edit, nên ta dàn form theo 1 cột */}
                 <div className="form-group">
                    <label htmlFor="fullName">Full name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label> {/* Sửa label cho khớp với User name bên phải */}
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="example@domain.com"
                    />
                     {/* Theo hình thì "User name" là email, "Full name" là tên đầy đủ. */}
                     {/* Backend đang dùng "username" cho tên đăng nhập, "email" cho email. */}
                     {/* Ở đây "Full name" (formData.fullName) sẽ map với "username" của backend. */}
                     {/* "User name" trên UI (formData.email) sẽ map với "email" của backend. */}
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                {/* Trường Phone No. không có trong DB, bỏ qua */}
                {/* <div className="form-group">
                    <label htmlFor="phone">Phone No.</label>
                    <input type="tel" id="phone" name="phone" className="form-control" />
                </div> */}


                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="role">Permission (Role)</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                    >
                        <option value="" disabled>Select a role</option>
                        {availableRoles.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="createdDate">Created Date</label>
                    <input
                        type="text"
                        id="createdDate"
                        name="createdDate"
                        value={todayDate}
                        readOnly
                        className="form-control-readonly"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="createdBy">Created By</label>
                    <input
                        type="text"
                        id="createdBy"
                        name="createdBy"
                        value={LOGGED_IN_ADMIN.username} // Lấy từ thông tin admin đăng nhập
                        readOnly
                        className="form-control-readonly"
                    />
                </div>

                {/* Phần Upload Photo tạm thời bỏ qua logic phức tạp, chỉ là placeholder nếu muốn hiển thị */}
                {/* <div className="form-group upload-photo-section">
                    <label>Upload Photo</label>
                    <div className="avatar-preview-container">
                        <img 
                            src={'https://via.placeholder.com/120/CCCCCC/808080?Text=Photo'} 
                            alt="Avatar Preview" 
                            className="avatar-preview"
                        />
                    </div>
                    <input type="file" id="avatar" name="avatar" className="form-control-file" />
                </div> */}


                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/user-manager')}
                        className="button-secondary"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="button-primary"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUserPage;