import React from "react";
import "./MemberItem.css"; // Import CSS cho MemberItem
import avatarDefault from "../../assets/images/avatar-default.svg";

function MemberItem({ name, role }) {
  return (
    <li className="member-item">
      <div className="avatar-container">
        <img src={avatarDefault} alt="User Avatar" className="avatar" />
      </div>
      <div className="member-details">
        <span className="member-name">{name}</span>
        <span className="member-role">{role}</span>
      </div>
    </li>
  );
}

export default MemberItem;
//
