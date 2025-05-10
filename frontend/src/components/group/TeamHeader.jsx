import React from "react";
import '/TeamHeader.css';
import {ChevronDownIcon, UserCircleIcon} from "@heroicons/react/24/outline";

const TeamHeader = ({ teamName, projects, selectedProjectId, onProjectChange, members = [], leaderId}) => {
    const sortedMembers = [...members].sort((a, b) => {
        if (a.user_id === leaderId) return -1; // Leader first
        if (b.user_id === leaderId) return 1;
        return a.username.localeCompare(b.username); // Sort by username
    });

    const handleProjectSelectChange = (event) => {
        onProjectChange(event.target.value);
    }

    return (
        <div className="team-header">
            <div className="team-info">
                <h1 className="team-name">{teamName || 'Loading Project...'}</h1>
                {projects && projects.length > 1 && ( // Chỉ hiển thị select nếu có nhiều hơn 1 project
                    <div className="project-selector-wrapper">
                        <select
                            value={selectedProjectId || ''}
                            onChange={handleProjectSelectChange}
                            className="project-selector"
                        >
                            {projects.map(project => (
                                <option key={project.project_id} value={project.project_id}>
                                    {project.project_name}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon className="project-selector-icon" />
                    </div>
                )}
                 {projects && projects.length === 1 && ( // Hiển thị tên project nếu chỉ có 1
                    <span className="single-project-indicator">(Active Project)</span>
                 )}
            </div>

            <div className="team-members-avatar">
                {sortedMembers.map((member, index) => (
                    <div
                        key={member.user_id}
                        className={`avatar-container ${member.user_id === leaderId ? 'leader' : ''}`}
                        style={{ zIndex: sortedMembers.length - index }} // Để avatar chồng lên nhau đúng thứ tự
                        title={`${member.username}${member.user_id === leaderId ? ' (Leader)' : ''}`}
                    >
                        {member.avatar ? (
                            <img src={member.avatar} alt={member.username} className="avatar-image" />
                        ) : (
                            <UserCircleIcon className="avatar-placeholder" />
                        )}
                    </div>
                ))}
                {members.length === 0 && <span className="no-members-text">No members</span>}
            </div>
        </div>
    );

};

export default TeamHeader;