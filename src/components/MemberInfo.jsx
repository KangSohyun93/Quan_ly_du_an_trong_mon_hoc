import React, { useState } from 'react';
import '../css/memberinfo.css';

const MemberInfo = ({ members, sprintData }) => {
    const [selectedMember, setSelectedMember] = useState(members[0]); // Mặc định chọn PM (Alice)

    const handleMemberChange = (event) => {
        const selected = members.find((member) => member.name === event.target.value);
        setSelectedMember(selected);
    };

    const totalCompleted = selectedMember.completed;
    const totalLate = sprintData[selectedMember.name].reduce((sum, sprint) => sum + sprint.late, 0);

    return (
        <div className="member-info-container">
            <div className="member-info-header">
                <div className="member-details">
                    <img src={selectedMember.avatar} alt={selectedMember.name} className="member-info-avatar" />
                    <div className="member-text">
                        <h3 className="member-info-name">{selectedMember.name}</h3>
                        <p className="member-info-role">{selectedMember.role}</p>
                    </div>
                </div>
                <select
                    value={selectedMember.name}
                    onChange={handleMemberChange}
                    className="member-select"
                >
                    {members.map((member) => (
                        <option key={member.name} value={member.name}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="member-stats" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <h4 className="stats-title">Task Statistics</h4>
                <p className="stats-item">
                    Total Tasks Completed: <span>{totalCompleted}/{selectedMember.total}</span>
                </p>
                {sprintData[selectedMember.name].map((sprint) => (
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