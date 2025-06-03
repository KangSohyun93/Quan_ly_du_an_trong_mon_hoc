// Profile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar/Sidebar";
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
} from "../../services/profile-service";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
        const data = await fetchUserProfile();
        console.log("Dữ liệu profile:", data);
        setProfile(data);
        setEditedProfile({
          ...data,
          github_email: data.github_email || "",
          github_username: data.github_username || "",
          avatar: data.avatar || "/assets/images/default-user.jpg",
        });
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi lấy hồ sơ:", err.message);
        if (
          err.message.includes("hết hạn") ||
          err.message.includes("không hợp lệ")
        ) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      formData.append("username", editedProfile.username || "");
      formData.append("github_email", editedProfile.github_email || "");
      formData.append("github_username", editedProfile.github_username || "");
      if (editedProfile.avatarFile) {
        formData.append("avatar", editedProfile.avatarFile);
      }

      console.log("Dữ liệu gửi đi:", [...formData.entries()]);
      const updatedData = await updateUserProfile(formData);
      setProfile(updatedData);
      setEditedProfile({
        ...updatedData,
        github_email: updatedData.github_email || "",
        github_username: updatedData.github_username || "",
        avatar: updatedData.avatar || "/assets/images/default-user.jpg",
      });
      setIsEditing(false);
      setPreviewImage(null);
      alert("Thông tin đã được cập nhật thành công!");
    } catch (err) {
      setError(err.message);
      console.error("Lỗi khi cập nhật hồ sơ:", err.message);
      if (
        err.message.includes("hết hạn") ||
        err.message.includes("không hợp lệ")
      ) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setEditedProfile((prev) => ({ ...prev, avatarFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Vui lòng chọn file ảnh hợp lệ.");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };
    if (name === "oldPassword" && !value) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại.";
    } else {
      newErrors.oldPassword = "";
    }

    if (name === "newPassword" && !value) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (name === "newPassword" && value.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    } else {
      newErrors.newPassword = "";
    }

    if (name === "confirmPassword" && !value) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (
      name === "confirmPassword" &&
      value !== passwordData.newPassword
    ) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
  };

  const handlePasswordSubmit = async () => {
    let newErrors = { ...errors };
    if (!passwordData.oldPassword)
      newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại.";
    if (!passwordData.newPassword)
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }
    if (!passwordData.confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    if (
      passwordData.confirmPassword &&
      passwordData.confirmPassword !== passwordData.newPassword
    ) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({ oldPassword: "", newPassword: "", confirmPassword: "" });
      alert("Mật khẩu đã được đổi thành công!");
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Lỗi khi đổi mật khẩu:", err.message);
      if (
        err.message.includes("hết hạn") ||
        err.message.includes("không hợp lệ")
      ) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  if (error) {
    return (
      <div
        className="profile-error-message"
        style={{ padding: "20px", color: "red" }}
      >
        {error}
        {(error.includes("403") ||
          error.includes("401") ||
          error.includes("hết hạn") ||
          error.includes("không hợp lệ")) && (
          <button
            className="profile-logout-button"
            onClick={handleLogout}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Đăng nhập lại
          </button>
        )}
      </div>
    );
  }

  if (loading)
    return (
      <div className="profile-loading" style={{ padding: "20px" }}>
        Đang tải...
      </div>
    );
  if (!profile)
    return (
      <div
        className="profile-error-message"
        style={{ padding: "20px", color: "red" }}
      >
        Không có dữ liệu hồ sơ!
      </div>
    );

  const avatarSrc = profile.avatar
    ? profile.avatar
    : "/assets/images/default-user.jpg";
  console.log("Avatar source:", avatarSrc);
  return (
    <div className="profile-wrapper">
      <Sidebar />
      <div className="profile-content-container">
        <div className="profile-content">
          <div className="profile-header">
            <img
              src={avatarSrc}
              alt={profile.username || "User"}
              className="profile-avatar-small"
              onError={(e) => {
                e.target.src = "/assets/images/default-user.jpg";
              }}
            />
            <div className="profile-info">
              <h2>{profile.username || "Không xác định"}</h2>
              <p>{profile.email || "Not provided"}</p>
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
                    value={editedProfile.username || ""}
                    onChange={handleChange}
                    className="profile-edit-input"
                  />
                ) : (
                  <p>{profile.username || "Not provided"}</p>
                )}
              </div>
              <div>
                <label>Email</label>
                <p>{profile.email || "Not provided"}</p>
              </div>
              <div>
                <label>GitHub Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="github_email"
                    value={editedProfile.github_email || ""}
                    onChange={handleChange}
                    className="profile-edit-input"
                  />
                ) : (
                  <p>{editedProfile.github_email || "Not provided"}</p>
                )}
              </div>
              <div>
                <label>GitHub Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="github_username"
                    value={editedProfile.github_username || ""}
                    onChange={handleChange}
                    className="profile-edit-input"
                  />
                ) : (
                  <p>{editedProfile.github_username || "Not provided"}</p>
                )}
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
                        onError={(e) => {
                          e.target.src = "/assets/images/default-user.jpg";
                        }}
                      />
                    ) : (
                      <img
                        src={avatarSrc}
                        alt="Current Avatar"
                        className="profile-avatar-preview"
                        onError={(e) => {
                          e.target.src = "/assets/images/default-user.jpg";
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="profile-avatar-preview"
                  onError={(e) => {
                    e.target.src = "/assets/images/default-user.jpg";
                  }}
                />
              )}
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button
                  className="profile-cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button className="profile-done-button" onClick={handleSave}>
                  Done
                </button>
              </>
            ) : (
              <>
                <button className="profile-edit-button" onClick={handleEdit}>
                  Edit
                </button>
                <button
                  className="profile-change-password-button"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>
        {showPasswordModal && (
          <div className="profile-modal">
            <div className="profile-modal-content">
              <h3>Change your password</h3>
              <div className="profile-modal-section">
                <label>Old Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                {errors.oldPassword && (
                  <p className="profile-error-message">{errors.oldPassword}</p>
                )}
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
                {errors.newPassword && (
                  <p className="profile-error-message">{errors.newPassword}</p>
                )}
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
                {errors.confirmPassword && (
                  <p className="profile-error-message">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="profile-modal-actions">
                <button
                  className="profile-set-password-button"
                  onClick={handlePasswordSubmit}
                >
                  Set Password
                </button>
                <button
                  className="profile-cancel-modal-button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
