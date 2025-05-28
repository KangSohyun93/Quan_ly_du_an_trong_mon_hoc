import React, { useState } from "react";
import placeholderMember from "../../../assets/images/placeholders/placeholder-member.jpg";
import AddSprintModal from "./AddSprintModal";
import "./TeamHeader.css";

const TeamHeader = ({
  className,
  classCode,
  teamName,
  projectName,
  projectId,
  members,
  activeTab,
  sprints,
  selectedSprintId,
  onSprintChange,
  onTabChange,
  onUserChange,
}) => {
  const [showAddSprint, setShowAddSprint] = useState(false);

  const tabs = [
    "Introduce",
    "Dashboard",
    "Team task",
    "My task",
    "Roadmap",
    "Rate",
  ];

  const tabsWithSprint = ["dashboard", "team-task", "my-task", "roadmap"];
  const tabsWithUserFilter = ["team-task", "rate"];

  const activeTabSlug = activeTab.toLowerCase(); // normalize

  const handleSprintChange = (e) => {
    const sprintId = parseInt(e.target.value, 10);
    if (sprintId === -1) {
      setShowAddSprint(true);
    } else {
      onSprintChange(sprintId);
    }
  };

  const handleUserChange = (e) => {
    const userId = parseInt(e.target.value, 10);
    onUserChange(userId === 0 ? null : userId);
  };
  //console.log("Members:", members);
  return (
    <div className="team-header">
      {/* Top Info */}
      <div className="team-header-top">
        <div className="team-info">
          <p>
            {teamName} : {projectName}
          </p>
          <p>
            {className} || {classCode}
          </p>
        </div>

        <div className="team-members">
          {members && members.length > 0 ? (
            members.slice(0, 3).map((member, index) => (
              <div key={index} className="team-member">
                <img
                  src={member.avatarUrl || placeholderMember}
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

      {/* Tab Bar */}
      <div className="team-header-tabs">
        <div className="tabs-container">
          {/* Sprint Selector */}
          {tabsWithSprint.includes(activeTabSlug) && sprints?.length > 0 && (
            <div className="sprint-select">
              <select
                value={selectedSprintId ?? ""}
                onChange={handleSprintChange}
              >
                <option value="" disabled>
                  Chọn Sprint
                </option>
                {sprints.map((sprint) => (
                  <option key={sprint.sprint_id} value={sprint.sprint_id}>
                    {sprint.sprint_name || `Sprint ${sprint.sprint_number}`}
                  </option>
                ))}
                <option value="-1">+ Thêm Sprint</option>
              </select>
            </div>
          )}

          {/* Tab Buttons */}
          <div className="tabs">
            {tabs.map((tab, index) => {
              const slug = tab.toLowerCase().replace(/\s+/g, "-");
              return (
                <button
                  key={index}
                  className={`tab ${activeTabSlug === slug ? "active" : ""}`}
                  onClick={() => onTabChange(tab)}
                >
                  <span className={`icon ${slug}-icon`} />
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Filter */}
        {tabsWithUserFilter.includes(activeTabSlug) && (
          <div className="teamheader-actions">
            <select
              onChange={handleUserChange}
              className="filter-btn"
              defaultValue="0"
            >
              <option value="0">All Users</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Add Sprint Modal */}
      {showAddSprint && (
        <AddSprintModal
          projectId={projectId}
          onClose={() => setShowAddSprint(false)}
          onSprintCreated={(newSprintId) => {
            setShowAddSprint(false);
            onSprintChange(newSprintId);
          }}
        />
      )}
    </div>
  );
};

export default TeamHeader;
