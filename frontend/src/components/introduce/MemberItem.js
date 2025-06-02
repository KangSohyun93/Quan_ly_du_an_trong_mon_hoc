import React from "react";
import "./MemberItem.css"; // Import CSS cho MemberItem

function MemberItem({ name, role, image }) {
  return (
    <li className="member-item">
      <div className="avatar-container">
        <img
          src={image}
          alt="User Avatar"
          className="avatar"
          onError={(e) => {
            e.target.src = "/assets/images/default-user.jpg"; // Fallback khi ảnh không tải được
          }}
        />
      </div>
      <div className="member-details">
        <span className="member-name">{name}</span>
        <span className="member-role">{role}</span>
      </div>
    </li>
  );
}

export default MemberItem;