import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import "./EditUserPage.css";
import "../../assets/styles/global.css";
import defaultAvatar from "../../assets/images/avatar-default.svg";
import { fetchUserData, updateUser } from "../../services/user-service";

const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const mockRoles = ["Admin", "Instructor", "Student"];

  // Lấy user hiện tại từ localStorage (key "currentUserId"), parse thành số
  const CURRENT_ADMIN_ID = parseInt(localStorage.getItem("user"), 10).id;

  const [user, setUser] = useState(null);
  const [initialUser, setInitialUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchUserData(userId);
      setUser(userData);
      setInitialUser(userData);
      setAvailableRoles(mockRoles);
    };
    loadUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const canSaveChanges = () => {
    if (!user || !initialUser) return false;
    return (
      user.role !== initialUser.role || user.is_active !== initialUser.is_active
    );
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!canSaveChanges()) {
      return;
    }
    setIsSaving(true);
    try {
      const updatedUser = await updateUser(userId, user); // gọi API
      setInitialUser(updatedUser); // cập nhật bản gốc theo dữ liệu từ server
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Có lỗi khi lưu thông tin người dùng.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlockUnblockToggle = () => {
    if (parseInt(userId, 10) === CURRENT_ADMIN_ID) {
      return;
    }
    setConfirmModalProps({
      title: user.is_active ? "Confirm Block User" : "Confirm Unblock User",
      message: `Are you sure you want to ${
        user.is_active ? "block" : "unblock"
      } the user "${user.username}"?`,
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
      const updatedData = {
        ...user,
        is_active: user.is_active ? 0 : 1, // 🔁 chuyển boolean -> số
      };

      const updatedUser = await updateUser(userId, updatedData);

      // Cập nhật UI theo dữ liệu trả về từ server
      setUser(updatedUser);
      setInitialUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Có lỗi khi cập nhật trạng thái người dùng.");
    } finally {
      setIsBlocking(false);
    }
  };

  if (!user) {
    return <div className="loading-container">Loading user details...</div>;
  }

  const isSelf = parseInt(userId, 10) === CURRENT_ADMIN_ID;

  return (
    <div className="edit-user-page-container form-container">
      <div className="form-header">
        <h2>User Detail</h2>
        <button
          onClick={() => navigate("/admin/user-manager")}
          className="button-back"
        >
          &lt; Back
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
            <h3>{user.username}</h3>
            <p
              className={`status-badge ${
                user.is_active ? "status-active" : "status-blocked"
              }`}
            >
              {user.is_active ? "Active" : "Blocked"}
            </p>
            <p>Email: {user.email}</p>
            <p>
              Create at: {new Date(user.created_at).toLocaleDateString("en-GB")}
            </p>
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
                readOnly
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
                readOnly
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
                disabled={isSelf || isSaving || isBlocking}
              >
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {isSelf && (
                <small className="form-text text-muted">
                  You cannot change your own role.
                </small>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/admin/user-manager")}
                className="button-secondary"
                disabled={isSaving || isBlocking}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockUnblockToggle}
                className={`button ${
                  user.is_active ? "button-danger" : "button-success"
                }`}
                disabled={isSelf || isSaving || isBlocking}
              >
                {isBlocking
                  ? "Processing..."
                  : user.is_active
                  ? "Block User"
                  : "Unblock User"}
              </button>
              <button
                type="submit"
                className="button-primary"
                disabled={!canSaveChanges() || isSaving || isBlocking}
              >
                {isSaving ? "Saving..." : "Save Changes"}
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
