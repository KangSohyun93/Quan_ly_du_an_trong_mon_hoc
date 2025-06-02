import React, { useState, useEffect } from 'react';
import './memberinfo.css';

const MemberInfo = ({ members, sprintData }) => {
    const getInitialMember = () => {
        if (!members || members.length === 0) return null;
        return members.find(m => m.role === 'PM') || members[0];
    };

    const [selectedMember, setSelectedMember] = useState(getInitialMember());

    useEffect(() => {
        const currentSelectedMemberStillExists = selectedMember && members.some(m => m.name === selectedMember.name);
        if (!currentSelectedMemberStillExists || (!selectedMember && members && members.length > 0)) {
            setSelectedMember(getInitialMember());
        } else if (!members || members.length === 0) {
            setSelectedMember(null);
        }
    }, [members, selectedMember]); // Re-run if members list changes or selectedMember becomes invalid

    const handleMemberChange = (event) => {
        const memberName = event.target.value;
        const selected = members.find((member) => member.name === memberName);
        setSelectedMember(selected);
    };

    if (!selectedMember) {
        return <div className="member-info-container placeholder">Select a member to view details.</div>;
    }

    // Ensure sprintData for the selected member exists, default to empty array if not
    const memberSpecificSprintData = sprintData[selectedMember.name] || [];
    const totalCompleted = selectedMember.completed;
    const totalLate = memberSpecificSprintData.reduce((sum, sprint) => sum + sprint.late, 0);

    return (
        <div className="member-info-container">
            <div className="member-info-header">
                <div className="member-details">
                    <img
                        src={selectedMember.avatar || '/assets/images/default-avatar.png'} // Provide a default path
                        alt={selectedMember.name}
                        className="member-info-avatar"
                    />
                    <div className="member-text">
                        <h3 className="member-info-name">{selectedMember.name}</h3>
                        <p className="member-info-role">{selectedMember.role}</p>
                    </div>
                </div>
                <select
                    value={selectedMember.name}
                    onChange={handleMemberChange}
                    className="member-select"
                    disabled={!members || members.length <= 1}
                >
                    {members.map((member) => (
                        <option key={member.name} value={member.name}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="member-stats">
                <h4 className="stats-title">Task Statistics</h4> {/* English title */}
                <p className="stats-item">
                    Total Tasks Completed: <span>{totalCompleted}/{selectedMember.total}</span>
                </p>
                {memberSpecificSprintData.map((sprint) => (
                    <p key={sprint.sprint} className="stats-item">
                        Sprint {sprint.sprint}: <span>{sprint.completed}/{sprint.total} (Late: {sprint.late})</span>
                    </p>
                ))}
                <p className="stats-item">
                    Total Late Tasks: <span>{totalLate}</span>
                </p>
                <p className="stats-item">
                    Join Date: <span>{selectedMember.joinDate}</span>
                </p>
                <p className="stats-item">
                    Work Days: <span>{selectedMember.workDays} days</span>
                </p>
            </div>
        </div>
    );
};

export default MemberInfo;