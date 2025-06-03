import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/user-service"; // Gọi API qua service
import "./AddUserPage.css";
import "../../assets/styles/global.css";

const LOGGED_IN_ADMIN = {
  id: 1,
  username: "AdminUser",
};

const AVAILABLE_ROLES = ["Student", "Instructor"]; // Danh sách role cố định

const AddUserPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student", // Mặc định là Student
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const todayDate = new Date().toLocaleDateString("en-CA");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (name === "password" && errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full Name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.role) {
      newErrors.role = "Role is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        username: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      await createUser(payload);
      navigate("/admin/user-manager");
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="add-user-page-container form-container">
      <div className="form-header">
        <h2>Add User</h2>
        <button
          onClick={() => navigate("/admin/user-manager")}
          className="button-back"
        ></button>
      </div>

      <form onSubmit={handleSubmit} className="user-form add-user-form-layout">
        <div className="form-group">
          <label htmlFor="fullName">Full name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
          />
          {errors.fullName && (
            <div className="invalid-feedback">{errors.fullName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="role">Permission (Role)</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className={`form-control ${errors.role ? "is-invalid" : ""}`}
          >
            {AVAILABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.role && <div className="invalid-feedback">{errors.role}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="createdDate">Created Date</label>
          <input
            type="text"
            id="createdDate"
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
            value={LOGGED_IN_ADMIN.username}
            readOnly
            className="form-control-readonly"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/admin/user-manager")}
            className="button-secondary"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button type="submit" className="button-primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;
