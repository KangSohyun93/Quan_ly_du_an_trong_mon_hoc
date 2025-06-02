import React from "react";
import "./GroupInClass.css";
import { useNavigate } from "react-router-dom";

// Hàm tính toán khoảng thời gian
const timeAgo = (dateString) => {
  if (!dateString) return "Chưa cập nhật";

  const now = new Date(); // Hiện tại là 06:21 PM +07, 15/05/2025
  const updatedAt = new Date(dateString);
  const diffInMs = now - updatedAt;
  const diffInSeconds = Math.floor(diffInMs / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Now";
};

const GroupInClass = ({ group, userId, classId }) => {
  const navigate = useNavigate();
  const members = group.members || [];
  const avatarImages = members
    .slice(0, 4)
    .map((member, index) => (
      <img
        key={index}
        src={member.avatar || "/uploads/default.jpg"}
        alt={`Avatar ${index + 1}`}
        className="group-in-class-member-avatar"
      />
    ));
  const lastUpdated = group.lastUpdated
    ? timeAgo(group.lastUpdated)
    : "Chưa cập nhật";
  const isCompleted =
    group.status === "Completed" || group.status === "completed";

  //console.log('Group data in GroupInClass:', group);

  return (
    <div
      className="group-in-class-card"
      onClick={() =>
        navigate(
          `/instructor/home/classes/${classId}/group/${group.groupId}/introduce`
        )
      }
      style={{ cursor: "pointer" }}
    >
      <div className="group-in-class-info">
        <div className="group-in-class-details">
          <h3 className="group-in-class-name">
            {group.groupName || "Group Name"}
          </h3>
          <p className="group-in-class-description">
            {group.description || "Description here."}
          </p>
        </div>
        <div className="group-in-class-status">
          {isCompleted ? (
            <span className="group-in-class-completed">✔ Completed</span>
          ) : (
            <span className="group-in-class-ongoing">⏳ Ongoing</span>
          )}
        </div>
      </div>
      <div className="group-in-class-meta">
        <div className="group-in-class-files">
          <span className="group-in-class-file-icon">★</span>
          <span>{`Updated ${lastUpdated}`}</span>
        </div>
        <div className="group-in-class-members">
          {avatarImages}
          <span className="group-in-class-member-count">
            {members.length || 0} members
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupInClass;
