import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/shared/SideBar/Sidebar';
import { fetchUserProfile, updateUserProfile, changePassword } from '../services/profileService';
import './css/Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ password: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ password: '', newPassword: '', confirmPassword: '' }); // State cho lỗi từng trường
  const [error, setError] = useState(null); // Lỗi chung
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchUserProfile(userId);
        setProfile(data);
        setEditedProfile(data);
      } catch (err) {
        setError(`Không thể tải thông tin cá nhân: ${err.message}. Vui lòng kiểm tra backend và database.`);
        console.error('Error fetching profile:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setPreviewImage(null);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setPreviewImage(null);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', editedProfile.username || '');
      if (editedProfile.avatarFile) {
        formData.append('avatar', editedProfile.avatarFile);
      }

      await updateUserProfile(userId, formData);
      const updatedProfile = await fetchUserProfile(userId);
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
      setPreviewImage(null);
      alert('Thông tin đã được cập nhật thành công!');
    } catch (err) {
      setError(`Lỗi khi cập nhật thông tin: ${err.response?.data?.error || err.message}`);
      console.error('Error updating profile:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setEditedProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProfile((prev) => ({ ...prev, avatarFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Kiểm tra lỗi ngay khi nhập
    let newErrors = { ...errors };
    if (name === 'password' && !value) {
      newErrors.password = 'Vui lòng nhập mật khẩu hiện tại.';
    } else if (name === 'password' && value) {
      newErrors.password = '';
    }

    if (name === 'newPassword' && !value) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    } else if (name === 'newPassword' && value.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    } else if (name === 'newPassword' && value.length >= 6) {
      newErrors.newPassword = '';
    }

    if (name === 'confirmPassword' && !value) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (name === 'confirmPassword' && value !== passwordData.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    } else if (name === 'confirmPassword' && value === passwordData.newPassword) {
      newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
  };

  const handlePasswordSubmit = async () => {
    // Kiểm tra lỗi tổng quát trước khi gửi
    let newErrors = { ...errors };
    if (!passwordData.password) newErrors.password = 'Vui lòng nhập mật khẩu hiện tại.';
    if (!passwordData.newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    if (!passwordData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    if (passwordData.confirmPassword !== passwordData.newPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await changePassword(userId, passwordData);
      setShowPasswordModal(false);
      setPasswordData({ password: '', newPassword: '', confirmPassword: '' });
      setErrors({ password: '', newPassword: '', confirmPassword: '' }); // Xóa lỗi sau khi thành công
      alert('Mật khẩu đã được đổi thành công!');
      setError(null); // Xóa lỗi chung
    } catch (err) {
      setError('Lỗi khi đổi mật khẩu: ' + err.message);
      console.error('Error changing password:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="profile-error-message">{error}</div>;
  if (loading || !profile) return <div className="profile-loading">Đang tải...</div>;

  const avatarSrc = profile.avatar || '/assets/images/default-avatar.jpg';

  return (
    <div className="profile-profile-page">
      <Sidebar userId={userId} />
      <div className="profile-content-container">
        <div className="profile-content">
          <div className="profile-header">
            <img
              src={avatarSrc}
              alt={profile.username || 'User'}
              className="profile-avatar-small"
            />
            <div className="profile-info">
              <h2>{profile.username}</h2>
              <p>{profile.email}</p>
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-section left-column">
              <div>
                <label>Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editedProfile.username || ''}
                    onChange={handleChange}
                    className="profile-edit-input"
                  />
                ) : (
                  <p>{profile.username || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label>Email</label>
                <p>{profile.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="detail-section right-column">
              <label>Avatar</label>
              {isEditing ? (
                <div>
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleAvatarChange}
                    className="profile-edit-input"
                    accept="image/*"
                  />
                  <div className="profile-avatar-preview-container">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="profile-avatar-preview"
                      />
                    ) : (
                      <img
                        src={avatarSrc}
                        alt="Current Avatar"
                        className="profile-avatar-preview"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="profile-avatar-preview"
                />
              )}
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="profile-cancel-button" onClick={handleCancel}>Cancel</button>
                <button className="profile-done-button" onClick={handleSave}>Done</button>
              </>
            ) : (
              <>
                <button className="profile-edit-button" onClick={handleEdit}>Edit</button>
                <button className="profile-change-password-button" onClick={() => setShowPasswordModal(true)}>Change Password</button>
              </>
            )}
          </div>
        </div>
        {showPasswordModal && (
          <div className="profile-modal">
            <div className="profile-modal-content">
              <h3>Change your password</h3>
              <div className="profile-modal-section">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                {errors.password && <p className="profile-error-message">{errors.password}</p>}
              </div>
              <div className="profile-modal-section">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                {errors.newPassword && <p className="profile-error-message">{errors.newPassword}</p>}
              </div>
              <div className="profile-modal-section">
                <label>Confirm</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && <p className="profile-error-message">{errors.confirmPassword}</p>}
              </div>
              <div className="profile-modal-actions">
                <button className="profile-set-password-button" onClick={handlePasswordSubmit}>Set Password</button>
                <button className="profile-cancel-modal-button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;