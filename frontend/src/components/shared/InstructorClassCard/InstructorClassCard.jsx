import React from 'react';
import './InstructorClassCard.css'; // Tái sử dụng CSS từ ClassCard
import avatarMap from '../../../utils/avatarMap';
import placeholderMember from '../../../assets/images/placeholders/placeholder-member.jpg';

const InstructorClassCard = ({ className, groupCount, projectNames, memberCount, avatarNumber, avatarColor, members }) => {
  return (
    <div className="instructorclasscard-container">
      <div className="instructorclasscard-avatar">
        <div className="instructorclasscard-avatar-bg" style={{ backgroundColor: avatarColor }}></div>
        <div className="instructorclasscard-avatar-number">{avatarNumber}</div>
      </div>
      <div className="instructorclasscard-name-description">
        <div className="instructorclasscard-name">
          <div className="instructorclasscard-title">{className}</div>
        </div>
      </div>
      <div className="instructorclasscard-members">
        <div className="instructorclasscard-members-list">
          {members && members.length > 0 ? (
            members.slice(0, 5).map((member, index) => (
              <div key={index} className="instructorclasscard-member">
                <img
                  className="instructorclasscard-member-img"
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
        <div className="instructorclasscard-members-count">{memberCount} members</div>
      </div>
      <div className="instructorclasscard-more-icon">…</div>
    </div>
  );
};

export default InstructorClassCard;