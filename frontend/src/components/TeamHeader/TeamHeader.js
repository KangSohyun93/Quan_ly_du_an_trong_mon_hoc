import React, { useState, useEffect } from "react";
import "./TeamHeader.css";
import avatarMap from "../../utils/avatarMap";
import placeholderMember from "../../assets/images/placeholders/placeholder-member.jpg";

const TeamHeader = ({
  teamName = "Name team",
  members = [],
  activeTab = "Team task",
  sprints = [],
  onSprintChange,
}) => {
  const tabs = [
    { name: "Introduce", icon: "📋" },
    { name: "Dashboard", icon: "📊" },
    { name: "Team task", icon: "📝" },
    { name: "My task", icon: "📋" },
    { name: "Roadmap", icon: "🗺️" },
    { name: "Rate", icon: "⭐" },
  ];

  const [selectedSprint, setSelectedSprint] = useState(
    sprints.length > 0 ? sprints[0] : null
  );

  useEffect(() => {
    if (sprints.length > 0 && !selectedSprint) {
      const sprint1 =
        sprints.find((sprint) => sprint.sprint_number === 1) || sprints[0];
      setSelectedSprint(sprint1);
      onSprintChange?.(sprint1);
    }
  }, [sprints, selectedSprint, onSprintChange]);

  const handleSprintChange = (e) => {
    const sprintName = e.target.value;
    const sprint = sprints.find((s) => s.sprint_name === sprintName);
    setSelectedSprint(sprint);
    onSprintChange?.(sprint);
  };

  return (
    <div className="team-header">
      <div className="team-header-left">
        <div className="team-name">{teamName}</div>
        <div className="team-dropdown">
          Change project
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>

      <div className="team-members">
        {members && members.length > 0 ? (
          members.slice(0, 3).map((member, index) => (
            <div key={index} className="team-member">
              <img
                className="team-member-img"
                src={avatarMap[member.avatar] || placeholderMember}
                alt={`Member ${index + 1}`}
                onError={(e) => {
                  e.target.src = placeholderMember;
                }}
              />
            </div>
          ))
        ) : (
          <p>No members</p>
        )}
      </div>

      <div className="team-header-right">
        <div className="team-tabs">
          <select
            className="sprint-label"
            value={selectedSprint?.sprint_name || ""}
            onChange={handleSprintChange}
          >
            {sprints.length > 0 ? (
              sprints.map((sprint) => (
                <option key={sprint.sprint_id} value={sprint.sprint_name}>
                  {sprint.sprint_name}
                </option>
              ))
            ) : (
              <option value="Sprint 4">Sprint 4</option>
            )}
          </select>
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={`team-tab ${activeTab === tab.name ? "active" : ""}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.name}
            </div>
          ))}
        </div>
        <div className="team-actions">
          <button className="filter-btn">Filter ▼</button>
          <button className="search-btn">Search 🔍</button>
        </div>
      </div>
    </div>
  );
};

export default TeamHeader;
