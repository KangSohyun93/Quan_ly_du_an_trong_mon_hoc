import React from "react";
import {Link} from "react-router-dom";
import '../TeamSubheader.css';
import {ChevronDownIcon, UserCircleIcon} from "@heroicons/react/24/outline";

const TeamSubheader = ({sprints, selectedSprintId, onSprintChange, activeItem}) => {
    const handleSprintSelectChange = (event) => {
        onSprintChange(event.target.value);
    }

    const navItems = [
        { id: 'Introduce', label: 'Introduce', path: '/project/:projectId/introduce' }, // Cần projectId động
        { id: 'Dashboard', label: 'Dashboard', path: '/project/:projectId/dashboard' },
        { id: 'TeamTask', label: 'Team task', path: '/project/:projectId/team-task' }, // Giống "Team task" trong hình
        { id: 'MyTask', label: 'My task', path: '/project/:projectId/my-task' },
        { id: 'Roadmap', label: 'Roadmap', path: '/project/:projectId/roadmap' }, // Link hiện tại
        { id: 'Rate', label: 'Rate', path: '/project/:projectId/rate' },
    ]

    const currentSprint = sprints.find(s => s.sprint_id === selectedSprintId);
    const sprintDisplayName = currentSprint ? currentSprint.sprint_name : (sprints.length > 0 ? 'Select Sprint' : 'No Sprints Available');

    return (
        <div className="team-subheader">
        <div className="sprint-selector-container">
            <span className="sprint-label">Sprint:</span>
            {sprints && sprints.length > 0 ? (
                <div className="sprint-selector-wrapper">
                    <select
                        value={selectedSprintId || ''}
                        onChange={handleSprintSelectChange}
                        className="sprint-selector"
                        title={sprintDisplayName} // Hiển thị tên đầy đủ khi hover
                    >
                        {sprints.map(sprint => (
                            <option key={sprint.sprint_id} value={sprint.sprint_id}>
                                {sprint.sprint_name}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="sprint-selector-icon" />
                </div>
            ) : (
                <span className="no-sprints-text">No Sprints Available</span>
            )}
        </div>

        <nav className="subheader-nav">
            {navItems.map(item => (
                <Link
                    key={item.id}
                    // Tạm thời vô hiệu hóa link nếu đang ở trang đó hoặc path chưa hoàn chỉnh
                    to={activeItem === item.id ? '#' : item.path.replace(':projectId', selectedSprintId ? sprints.find(s=>s.sprint_id === selectedSprintId)?.project_id || 'current' : 'current') } // Cần projectId thực tế
                    className={`subheader-nav-item ${activeItem === item.id ? 'active' : ''}`}
                    onClick={(e) => activeItem === item.id && e.preventDefault()} // Ngăn reload nếu đã active
                >
                    {item.label}
                </Link>
            ))}
        </nav>

        <div className="subheader-actions">
            {/* Filter và Search không dùng ở đây theo yêu cầu */}
        </div>
    </div>
    );
};

export default TeamSubheader;