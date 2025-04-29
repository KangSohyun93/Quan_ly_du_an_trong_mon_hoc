import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatarMap from '../../../utils/avatarMap';
import placeholderMember from '../../../assets/images/placeholders/placeholder-member.jpg';
import './ClassCard.css';

const ClassCard = ({ classId, className, groupName, projectName, memberCount, avatarNumber, avatarColor, members }) => {
  const navigate = useNavigate();

  // Xử lý sự kiện nhấp vào ClassCard để chuyển hướng đến trang nhóm của lớp
  const handleClick = () => {
    const userId = 2; // Giả định userId hiện tại là 2 (student1), có thể lấy từ context hoặc state
    navigate(`/groups/${userId}/class/${classId}`);
  };

  return (
    <div className="classcard-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {/* Avatar lớp học */}
      <div className="classcard-avatar">
        <div className="classcard-avatar-bg" style={{ backgroundColor: avatarColor }}></div>
        <div className="classcard-avatar-number">{avatarNumber}</div>
      </div>

      {/* Tên lớp và thông tin nhóm/dự án */}
      <div className="classcard-name-description">
        <div className="classcard-name">
          <div className="classcard-title">{className}</div>
        </div>
        <div className="classcard-description">
          <div className="classcard-description-text">
            {groupName}: {projectName}
          </div>
        </div>
      </div>

      {/* Danh sách thành viên và số lượng */}
      <div className="classcard-members">
        <div className="classcard-members-list">
          {members && members.length > 0 ? (
            members.slice(0, 5).map((member, index) => (
              <div key={index} className="classcard-member">
                <img
                  className="classcard-member-img"
                  src={avatarMap[member.avatar] || placeholderMember}
                  alt={`Thành viên ${index + 1}`}
                  onError={(e) => {
                    e.target.src = placeholderMember;
                  }}
                />
              </div>
            ))
          ) : (
            <p>No member</p>
          )}
        </div>
        <div className="classcard-members-count">{memberCount} members</div>
      </div>

      {/* Icon "More" */}
      <div className="classcard-more-icon">…</div>
    </div>
  );
};

export default ClassCard;