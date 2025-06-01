import React, { useState } from "react";
import placeholderMember from "../../../assets/images/placeholders/placeholder-member.jpg";
import AddSprintModal from "./AddSprintModal";
import "./TeamHeader.css";

const TeamHeader = ({
  role = "student",
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

  const tabsStudent = [
    "Introduce",
    "Dashboard",
    "Team task",
    "My task",
    "Rate",
  ];
  const tabsInstructor = ["Introduce", "Dashboard"];

  const tabsWithSprint = ["dashboard", "team-task", "my-task"];
  const tabsWithUserFilter = ["team-task", "rate"];

  const activeTabSlug = activeTab.toLowerCase();

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

  const renderTabs = () => {
    const tabs = role === "Instructor" ? tabsInstructor : tabsStudent;

    return (
      <div className="tabs">
        {tabs.map((tab) => {
          const slug = tab.toLowerCase().replace(/\s+/g, "-");
          return (
            <button
              key={slug}
              className={`tab ${activeTabSlug === slug ? "active" : ""}`}
              onClick={() => onTabChange(tab)}
            >
              {role === "Instructor" ? (
                tab
              ) : (
                <>
                  <span className={`icon ${slug}-icon`} /> {tab}
                </>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="team-header">
      {/* Common Header Top */}
      <div className="team-header-top">
        <div className="team-info">
          <p>
            {teamName} : {projectName}
          </p>
          <p>
            {className} || {classCode}
          </p>
        </div>

        {/* Only show member avatars for student */}
        {members && (
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
        )}
      </div>

      {/* Tab Area */}
      <div
        className={`team-header-tabs ${
          role === "Instructor" ? "instructor" : ""
        }`}
      >
        <div className="tabs-container">
          {/* Sprint Selector (student only) */}
          {role !== "Instructor" &&
            tabsWithSprint.includes(activeTabSlug) &&
            sprints?.length > 0 && (
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

          {/* Dynamic Tabs */}
          {renderTabs()}
        </div>

        {/* User Filter (student only) */}
        {role !== "Instructor" &&
          tabsWithUserFilter.includes(activeTabSlug) && (
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
