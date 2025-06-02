import React from "react";
import placeholderMember from "../../../assets/images/placeholders/placeholder-member.jpg";
import InstructorClassCardMenu from "../ClassCardMenu/InstructorClassCardMenu";
import "./InstructorClassCard.css";
import { useNavigate } from "react-router-dom";

const InstructorClassCard = ({
  classId,
  className,
  groupCount,
  semester,
  avatarNumber,
  avatarColor,
  members,
  onClick,
  onEdit,
}) => {
  const navigate = useNavigate();
  const displayStudentCount = members.length || 0;
  const handleCardClick = () => {
    navigate(`/instructor/home/classes/${classId}`);
  };
  return (
    <div className="instructorclasscard-container" onClick={handleCardClick}>
      <div onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="instructorclasscard-header">
          <div
            className="instructorclasscard-avatar"
            style={{ backgroundColor: avatarColor }}
          >
            <div className="instructorclasscard-avatar-number">
              {avatarNumber}
            </div>
          </div>
          <div className="instructorclasscard-title">{className}</div>
        </div>
        <div className="instructorclasscard-content">
          <div className="instructorclasscard-description-text">
            Kỳ học: {semester || "Chưa xác định"} | Số nhóm: {groupCount || 0}
          </div>
          <div className="instructorclasscard-members">
            <div className="instructorclasscard-members-list">
              {members && members.length > 0 ? (
                <>
                  {members.slice(0, 5).map((member, index) => (
                    <div key={index} className="instructorclasscard-member">
                      <img
                        className="instructorclasscard-member-img"
                        src={member.avatar || placeholderMember}
                        alt={`Sinh viên ${index + 1}`}
                        onError={(e) => {
                          e.target.src = placeholderMember;
                        }}
                      />
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div className="instructorclasscard-more-members">
                      +{members.length - 5}
                    </div>
                  )}
                </>
              ) : (
                <span className="no-members">No student</span>
              )}
            </div>
            <div className="instructorclasscard-members-count">
              {displayStudentCount} students
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1001,
        }}
      >
        <InstructorClassCardMenu
          classId={classId}
          onGetLink={() =>
            alert(
              `Link for class ${classId}: http://example.com/class/${classId}`
            )
          }
          onDelete={() => {
            if (window.confirm(`Bạn có chắc muốn xóa lớp ${classId}?`)) {
              fetch(`http://localhost:5000/api/class/delete/${classId}`, {
                method: "DELETE",
              })
                .then((response) => {
                  if (response.ok) {
                    alert("Lớp đã được xóa");
                    window.location.reload();
                  } else {
                    throw new Error("Failed to delete class");
                  }
                })
                .catch((err) => alert(err.message));
            }
          }}
          onEdit={() => onEdit(classId)} // Để trống vì đã xử lý trong InstructorGroupPage
        />
      </div>
    </div>
  );
};

export default InstructorClassCard;
