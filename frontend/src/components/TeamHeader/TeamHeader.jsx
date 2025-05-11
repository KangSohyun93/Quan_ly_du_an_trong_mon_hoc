import React from 'react';
import placeholderMember from '../../assets/images/placeholders/placeholder-member.jpg';
import './TeamHeader.css';

const TeamHeader = ({ className, classCode, teamName, projectName, members, activeTab, sprints, selectedSprintId, onSprintChange, onTabChange, onUserChange }) => {
  const tabs = ['Introduce', 'Dashboard', 'Team task', 'My task', 'Roadmap', 'Rate'];

  const handleUserChange = (e) => {
    const userId = parseInt(e.target.value);
    onUserChange(userId === 0 ? null : userId); // Nếu chọn "All Users", truyền null
  };

  return (
    <div className="team-header">
      <div className="team-header-top">
        <div className="team-info">
          <p>{teamName} : {projectName}</p>
          <p>{className} || {classCode}</p>
        </div>
        <div className="team-members">
          {members && members.length > 0 ? (
            members.slice(0, 3).map((member, index) => (
              <div key={index} className="team-member">
                <img
                  src={member.avatar || placeholderMember}
                  alt={`Member ${index + 1}`}
                  className="member-avatar"
                  onError={(e) => {
                    e.target.src = placeholderMember;
                  }}
                />
              </div>
            ))
          ) : (
            <p>No members</p>
          )}
          {members.length > 3 && (
            <div className="more-members">+{members.length - 3}</div>
          )}
        </div>
      </div>

      <div className="team-header-tabs">
        <div className="tabs-container">
          {sprints && sprints.length > 0 && (
            <div className="sprint-select">
              <select
                value={selectedSprintId || ''}
                onChange={(e) => {
                  const sprintId = parseInt(e.target.value, 10);
                  const selectedSprint = sprints.find((sprint) => sprint.sprint_id === sprintId);
                  if (selectedSprint) {
                    console.log("Selected sprint in TeamHeader:", selectedSprint);
                    onSprintChange(selectedSprint);
                  }
                }}
              >
                <option value="" disabled>Chọn Sprint</option>
                {sprints.map((sprint, index) => (
                  <option key={sprint.sprint_id} value={sprint.sprint_id}>
                    {sprint.sprint_name || `Sprint ${sprint.sprint_number}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="tabs">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => onTabChange(tab)}
              >
                <span className={`icon ${tab.toLowerCase().replace(' ', '-')}-icon`}></span>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="teamheader-actions">
          {/* Thay thế nút Filter bằng dropdown lọc user */}
          <select onChange={handleUserChange} className="filter-btn">
            <option value="0">All Users</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.username}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TeamHeader;