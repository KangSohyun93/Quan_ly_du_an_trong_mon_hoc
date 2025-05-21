import React, {useState, useEffect, useCallback, use} from "react";
import { useParams, useNavigate, parsePath } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../components/shared/NotificationContext";
import ConfirmModal from "../components/shared/ConfirmModal";
import "../assets/styles/EditUserPage.css"; // Sẽ tạo file CSS này
import '../assets/styles/global.css';
import defaultAvatar from '../assets/images/avatar-default.svg'; // Đường dẫn đến ảnh avatar mặc định

const EditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [user, setUser] = useState({
        username: '',
        email: '',
        role: '', // Giá trị mặc định hợp lệ
        is_active: true,
        avatar: null,
        created_at: ''
    }
    );
    const [initialUser, setInitialUser] = useState(null); // Lưu trạng thái ban đầu để so sánh
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false); // State cho việc block/unblock

    const [availableRoles, setAvailableRoles] = useState([]);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalProps, setConfirmModalProps] = useState({});

    const CURRENT_ADMIN_ID = 34; 

    const fetchUserDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/users/${userId}`);
            console.log("API response:", response.data);
            const userData = response.data;
            const normalizedUser = {
                user_id: userData.user_id,
                username: userData.username || '',
                email: userData.email || '',
                role: userData.role || 'Student', // Giá trị mặc định hợp lệ
                is_active: userData.is_active !== undefined ? userData.is_active : true,
                avatar: userData.avatar || null, // Đảm bảo avatar không undefined
                created_at: userData.created_at || ''
            };
            setUser(response.data);
            setInitialUser(response.data); // Lưu trạng thái ban đầu
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            addNotification(error.response?.data?.message || "Failed to load user data.", 'error');
            navigate('/admin/user-manager'); //Quay lai  
        } finally {
            setLoading(false);
        }
    }, [userId, navigate, addNotification]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await axios.get('/api/users/roles');
            setAvailableRoles(response.data.roles || []);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            addNotification(error.response?.data?.message || "Failed to load roles.", 'error');
        }
    }, [addNotification]);

    useEffect(() => {
        fetchUserDetails();
        fetchRoles();
    }, [fetchUserDetails, fetchRoles]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const canSaveChanges = () => {
        if (!user || !initialUser) return false;
        // Chỉ kiểm tra role và is_active vì chỉ 2 trường này được sửa
        return user.role !== initialUser.role || user.is_active !== initialUser.is_active;
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!canSaveChanges()) {
            addNotification("No changes detected.", 'info');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                role : user.role,
                is_active: user.is_active,
            };

            const response = await axios.put(`/api/users/${userId}`, payload);
            addNotification("User details updated successfully!", 'success');
            setInitialUser(response.data.user); // Cập nhật initialUser sau khi lưu thành công
            setUser(response.data.user); // Cập nhật user state với dữ liệu mới nhất từ server
            // navigate('/admin/user-manager'); // Có thể không cần navigate ngay
        } catch (error){
            console.error("Error updating user:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBlockUnblockToggle = () => {
        if (parseInt(userId) === CURRENT_ADMIN_ID) {
            addNotification("You cannot block your own account.", "error");
            return;
        }
        setConfirmModalProps({
            title: user.is_active ? "Confirm Block User" : "Confirm Unblock User",
            message: `Are you sure you want to ${user.is_active ? 'block' : 'unblock'} the user "${user.username}"?`,
            onConfirm: confirmBlockUnblock,
            confirmText: user.is_active ? "Yes, Block" : "Yes, Unblock",
            confirmButtonClass: user.is_active ? "button-danger" : "button-success",
        });
            setShowConfirmModal(true);
    };

    const confirmBlockUnblock = async () => {
        setIsBlocking(true);
        setShowConfirmModal(false);
        try {
            const new_is_active = !user.is_active;
            console.log("Toggling user status:", new_is_active);
            const payload = {
                role: user.role,
                is_active: !user.is_active,
            };
            const response = await axios.put(`/api/users/${userId}`, payload);
            console.log("API response:", response.data);
            const updatedUser = response.data.user;
            setUser(updatedUser);
            setInitialUser(updatedUser); // Cập nhật trạng thái ban đầu
            addNotification(`User "${updatedUser.username}" has been ${new_is_active ? 'unblocked' : 'blocked'}.`, 'success');
        } catch (error) {
                console.error("Error blocking/unblocking user:", error); 
                addNotification(error.response?.data?.message || "Failed to update user status.", 'error');
            } finally {
                setIsBlocking(false);
            }
        };

    if (loading) {
        return <div className="loading-container">Loading user details...</div>;
    }
    if (!user) {
        return <div className="error-container">User not found or failed to load.</div>;
    }
    
    const isSelf = parseInt(userId) === CURRENT_ADMIN_ID;
    
    return (
        <div className="edit-user-page-container form-container">
            <div className="form-header">
                <h2>User Detail</h2>
                <button onClick={() => navigate('/admin/user-manager')} className="button-back">
                    {/* < Back to User List></Back> */}
                </button>
            </div>

            <form onSubmit={handleSaveChanges} className="user-form">
                <div className="form-layout">
                    <div className="profile-section">
                        <img
                            src={user.avatar || defaultAvatar}
                            alt={user.username}
                            className="user-avatar-large"
                        />
                        <h3>{user.username}</h3> {/* Hiển thị username thay cho Full name */}
                        <p className={`status-badge ${user.is_active ? 'status-active' : 'status-blocked'}`}>
                            {user.is_active ? 'Active' : 'Blocked'}
                        </p>
                        <p>Email: {user.email}</p>
                        {/* Các thông tin khác có thể hiển thị nếu cần */}
                        <p>Joined Date: {new Date(user.created_at).toLocaleDateString('en-GB')}</p>
                    </div>

                    <div className="details-section">
                        <h4>Profile Settings</h4>
                        <div className="form-group">
                            <label htmlFor="username">Full Name (Username)</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                readOnly // Username không cho sửa ở đây
                                className="form-control-readonly"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                readOnly // Email không cho sửa
                                className="form-control-readonly"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Permission (Role)</label>
                            <select
                                id="role"
                                name="role"
                                value={user.role}
                                onChange={handleInputChange}
                                className="form-control"
                                disabled={isSelf || isSaving || isBlocking} // Không cho sửa role của chính mình
                            >
                                {availableRoles.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                             {isSelf && <small className="form-text text-muted">You cannot change your own role.</small>}
                        </div>

                        {/* Trường Phone No. không có trong DB, bỏ qua */}
                        {/* Trường Created By không có trong DB Users, bỏ qua */}
                        {/* Trường Created Date đã hiển thị ở profile-section */}

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/user-manager')}
                                className="button-secondary"
                                disabled={isSaving || isBlocking}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBlockUnblockToggle}
                                className={`button ${user.is_active ? 'button-danger' : 'button-success'}`}
                                disabled={isSelf || isSaving || isBlocking} // Không cho tự block/unblock
                            >
                                {isBlocking ? 'Processing...' : (user.is_active ? 'Block User' : 'Unblock User')}
                            </button>
                            <button
                                type="submit"
                                className="button-primary"
                                disabled={!canSaveChanges() || isSaving || isBlocking}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title={confirmModalProps.title}
                message={confirmModalProps.message}
                onConfirm={confirmModalProps.onConfirm}
                confirmText={confirmModalProps.confirmText}
                confirmButtonClass={confirmModalProps.confirmButtonClass}
            />
        </div>
    );
};   

export default EditUserPage;