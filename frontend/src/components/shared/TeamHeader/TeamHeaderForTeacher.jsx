import React from 'react';
import './TeamHeaderForTeacher.css';

const TeamHeaderForTeacher = ({ className, classCode, teamName, projectName, activeTab, sprints, selectedSprintId, onSprintChange, onTabChange }) => {
  const tabs = ['Group', 'Introduce', 'Dashboard'];

  return (
    <div className="team-header">
      <div className="team-header-top">
        <div className="team-info">
          <p>{teamName} : {projectName}</p>
          <p>{className} || {classCode}</p>
        </div>
      </div>

      <div className="team-header-tabs">
        <div className="tabs-container">
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
          {sprints && sprints.length > 0 && (
            <div className="sprint-select">
              <select
                value={selectedSprintId || ''}
                onChange={(e) => {
                  const selectedSprint = sprints.find((sprint) => sprint.sprint_id === e.target.value);
                  if (selectedSprint) onSprintChange(selectedSprint);
                }}
              >
                <option value="" disabled>Chọn Sprint</option>
                {sprints.map((sprint, index) => (
                  <option key={index} value={sprint.sprint_id}>
                    Sprint {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="teamheader-actions">
          <button className="action-btn action-btn-search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
          <button className="action-btn action-btn-comment">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="yellow"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Leave comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamHeaderForTeacher;