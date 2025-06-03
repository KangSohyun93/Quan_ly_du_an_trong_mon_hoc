import React from "react";
import placeholderMember from "../../../assets/images/placeholders/placeholder-member.jpg";
import "./ClassCard.css";
import ClassCardMenu from "../ClassCardMenu/ClassCardMenu"; // Import component menu
import { useNavigate } from "react-router-dom";

const ClassCard = ({
  hasJoin,
  userId,
  classId,
  className,
  groupName,
  groupId,
  projectName,
  projectId,
  semester,
  memberCount,
  avatarNumber,
  avatarColor,
  members,
}) => {
  // Log để kiểm tra dữ liệu truyền vào
  //console.log("ClassCard props:", { classId, className, memberCount, members });

  // Sử dụng members.length nếu members tồn tại, nếu không thì dùng memberCount hoặc 0
  const navigate = useNavigate();
  const displayMemberCount =
    members && members.length > 0 ? members.length : memberCount || 0;

  const handleCardClick = () => {
    const role = JSON.parse(localStorage.getItem("user"))?.role;
    if (hasJoin) {
      if (role === "Student") {
        if (groupId)
          navigate(`/home/classes/${classId}/group/${groupId}/introduce`);
        else {
          alert("Bạn chưa có nhóm trong lớp này.");
        }
      } else if (role === "Instructor") {
        navigate(`/home/classes/${classId}/group/${groupId}`);
      }
    } else {
      alert("Bạn chưa tham gia lớp này.");
    }
  };
  const handleGetLink = () => {
    const link = `http://localhost:3000/userID/${userId}/classes/${classId}/projects/${projectId}/introduce`;
    navigator.clipboard.writeText(link);
    alert(`Đã sao chép link: ${link}`);
  };
  return (
    <div className="classcard-container" onClick={handleCardClick}>
      <div
        className="classcard-avatar"
        style={{ backgroundColor: avatarColor }}
      >
        <div className="classcard-avatar-number">{avatarNumber+1}</div>
      </div>
      <div className="classcard-content">
        <div className="classcard-name-description">
          <div className="classcard-title">{className}</div>
          {projectId ? (
            <div className="classcard-description-text">
              {groupName}: {projectName}
            </div>
          ) : (
            <div className="classcard-description-text">Học kỳ: {semester}</div>
          )}
        </div>
        <div className="classcard-members">
          <div className="classcard-members-list">
            {members && members.length > 0 ? (
              members.slice(0, 4).map((member, index) => (
                <div key={index} className="classcard-member">
                  <img
                    className="classcard-member-img"
                    src={member.avatar || placeholderMember} // Sử dụng đường dẫn trực tiếp từ database
                    alt={`Thành viên ${index + 1}`}
                    onError={(e) => {
                      e.target.src = placeholderMember;
                    }}
                  />
                </div>
              ))
            ) : (
              <span className="no-members">No member</span>
            )}
          </div>
          <div className="classcard-members-count">
            {displayMemberCount} members
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <ClassCardMenu classId={classId} onGetLink={handleGetLink} />
      </div>
    </div>
  );
};

export default ClassCard;
