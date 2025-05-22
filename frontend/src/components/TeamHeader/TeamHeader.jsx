// import React, { useState } from 'react';
import placeholderMember from '../../assets/images/placeholders/placeholder-member.jpg';
import React, { useState } from 'react';
import AddSprintModal from './AddSprintModal';
import './TeamHeader.css';

const TeamHeader = ({ className, classCode, teamName, projectName, members, activeTab, sprints, selectedSprintId, onSprintChange, onTabChange, onUserChange }) => {
  const tabs = ['Introduce', 'Dashboard', 'Team task', 'My task', 'Roadmap', 'Rate'];
  const [showAddSprint, setShowAddSprint] = useState(false);

  const handleUserChange = (e) => {
    const userId = parseInt(e.target.value);
    onUserChange(userId === 0 ? null : userId); // Nếu chọn "All Users", truyền null
  };

  const handleSprintChange = (e) => {
    const sprintId = parseInt(e.target.value, 10);
    if (sprintId === -1) {
      // Trigger Add Sprint modal if "Add Sprint" option is selected
      setShowAddSprint(true);
    } else {
      // Handle regular sprint selection
      console.log("Selected sprint ID in TeamHeader:", sprintId);
      onSprintChange(sprintId); // Pass only the sprint_id
    }
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
                  src={member.username ? `/avatars/${member.username.toLowerCase()}.jpg` : placeholderMember}
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
                onChange={handleSprintChange}
              >
                <option value="" disabled>Chọn Sprint</option>
                {sprints.map((sprint, index) => (
                  <option key={sprint.sprint_id} value={sprint.sprint_id}>
                    {sprint.sprint_name || `Sprint ${sprint.sprint_number}`}
                  </option>
                ))}
                <option value="-1">Add Sprint</option> {/* Add Sprint option at the bottom */}
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

      {showAddSprint && (
        <AddSprintModal
          projectId={1} // Hard-coded project_id, consistent with your backend
          onClose={() => setShowAddSprint(false)}
          onSprintCreated={onSprintChange}
        />
      )}
    </div>
  );
};

export default TeamHeader;