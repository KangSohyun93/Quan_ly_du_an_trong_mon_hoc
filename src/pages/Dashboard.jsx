// import React from 'react';
// import StatCard from '../components/StatCard';
// import MemberCompletionChart from '../components/MemberCompletionChart';
// import LineChart from '../components/LineChart';
// import CommitActivityChart from '../components/CommitActivityChart';
// import LOCGrowthChart from '../components/LOCGrowthChart';
// import PeerReviewChart from '../components/PeerReviewChart';
// import TaskChart from '../components/TaskChart';
// import PRSizeChart from '../components/PRSizeChart';
// import BarChart from '../components/BarChart';
// import ContributorContributionChart from '../components/ContributorContributionChart';
// import SprintPerformanceChart from '../components/SprintPerformanceChart';
// import '../css/dashboard.css';

// const avatars = [
//     '/assets/images/classes/class1/group1/avatars/member1.svg',
//     '/assets/images/classes/class1/group1/avatars/member2.svg',
//     '/assets/images/classes/class1/group1/avatars/member3.svg',
// ];

// const Dashboard = () => {
//     return (
//         <section className="dashboard-container">
//             <div className="dashboard-content">
//                 <div className="dashboard-header">
//                     <div className="dashboard-title">
//                         <h1 className="project-name">Team name</h1>
//                         <select className="project-select">
//                             <option value="">Change project</option>
//                         </select>
//                     </div>
//                     <div className="vertical-line"></div>
//                     <div className="project-members">
//                         {avatars.map((avatar, index) => (
//                             <img
//                                 key={index}
//                                 src={avatar}
//                                 alt={`Avatar ${index + 1}`}
//                                 className="member-avatar"
//                                 style={{ zIndex: index + 1 }}
//                             />
//                         ))}
//                     </div>
//                 </div>
//                 <div className="dashboard-controls">
//                     <div className="tab-section">
//                         <select className="sprint-select">
//                             <option>Sprint 4</option>
//                         </select>
//                         <div className="vertical-line"></div>
//                         <div className="dashboard-btn-container">
//                             <i className="fa-solid fa-house"></i>
//                             <button className="dashboard-btn">Introduce</button>
//                         </div>
//                         <div className="dashboard-btn-container dashboard-btn-active">
//                             <i className="fa-solid fa-chart-line"></i>
//                             <button className="dashboard-btn">Dashboard</button>
//                         </div>
//                         <div className="dashboard-btn-container">
//                             <i className="fa-solid fa-list-check"></i>
//                             <button className="dashboard-btn">Team task</button>
//                         </div>
//                         <div className="dashboard-btn-container">
//                             <i className="fa-solid fa-list"></i>
//                             <button className="dashboard-btn">My task</button>
//                         </div>
//                         <div className="dashboard-btn-container">
//                             <i className="fa-solid fa-calendar-day"></i>
//                             <button className="dashboard-btn">Roadmap</button>
//                         </div>
//                         <div className="dashboard-btn-container">
//                             <i className="rate-icon fa-solid fa-star"></i>
//                             <button className="dashboard-btn">Rate</button>
//                         </div>
//                     </div>
//                     <div className="control-section">
//                         <div className="dashboard-btn-container">
//                             <i className="filter-icon fa-solid fa-filter"></i>
//                             <select name="" id="" className="filter">
//                                 <option value="">Filter</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="dashboard-stats-container">
//                     <div className="dashboard-stats">
//                         <StatCard title="Tổng nhiệm vụ" value="190" background="bg-violet" />
//                         <StatCard title="Nhiệm vụ Sprint" value="77" background="bg-blue" />
//                         <StatCard title="Hoàn thành" value="153" background="bg-violet" />
//                         <StatCard title="Trễ hạn" value="12" background="bg-blue" />
//                         <StatCard title="Tổng Commit" value="1200" background="bg-violet" />
//                         <StatCard title="Tổng LOC" value="150000" background="bg-blue" />
//                         <StatCard title="PR Đã Merge" value="45" background="bg-violet" />
//                     </div>
//                     <div className="dashboard-charts">
//                         <MemberCompletionChart />
//                         <LineChart />
//                         <CommitActivityChart />
//                         <LOCGrowthChart />
//                         <PeerReviewChart />
//                         <TaskChart />
//                         <PRSizeChart />
//                         <BarChart />
//                         <ContributorContributionChart />
//                         <SprintPerformanceChart />
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import MemberCompletionChart from '../components/MemberCompletionChart';
import LineChart from '../components/LineChart';
import CommitActivityChart from '../components/CommitActivityChart';
import LOCGrowthChart from '../components/LOCGrowthChart';
import PeerReviewChart from '../components/PeerReviewChart';
import TaskChart from '../components/TaskChart';
import PRSizeChart from '../components/PRSizeChart';
import BarChart from '../components/BarChart';
import ContributorContributionChart from '../components/ContributorContributionChart';
import SprintPerformanceChart from '../components/SprintPerformanceChart';
import '../css/dashboard.css';

const avatars = [
    '/assets/images/classes/class1/group1/avatars/member1.svg',
    '/assets/images/classes/class1/group1/avatars/member2.svg',
    '/assets/images/classes/class1/group1/avatars/member3.svg',
];

const Dashboard = () => {
    const [groupId, setGroupId] = useState(1);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/groups');
                setGroups(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
        fetchGroups();
    }, []);

    return (
        <section className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1 className="project-name">Team name</h1>
                        <select
                            className="project-select"
                            value={groupId}
                            onChange={(e) => setGroupId(Number(e.target.value))}
                        >
                            {groups.map(group => (
                                <option key={group.group_id} value={group.group_id}>
                                    {group.group_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="project-members">
                        {avatars.map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className="member-avatar"
                                style={{ zIndex: index + 1 }}
                            />
                        ))}
                    </div>
                </div>
                <div className="dashboard-controls">
                    <div className="tab-section">
                        <select className="sprint-select">
                            <option>Sprint 4</option>
                        </select>
                        <div className="vertical-line"></div>
                        <div className="dashboard-btn-container">
                            <i className="fa-solid fa-house"></i>
                            <button className="dashboard-btn">Introduce</button>
                        </div>
                        <div className="dashboard-btn-container dashboard-btn-active">
                            <i className="fa-solid fa-chart-line"></i>
                            <button className="dashboard-btn">Dashboard</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i className="fa-solid fa-list-check"></i>
                            <button className="dashboard-btn">Team task</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i className="fa-solid fa-list"></i>
                            <button className="dashboard-btn">My task</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i className="fa-solid fa-calendar-day"></i>
                            <button className="dashboard-btn">Roadmap</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i className="rate-icon fa-solid fa-star"></i>
                            <button className="dashboard-btn">Rate</button>
                        </div>
                    </div>
                    <div className="control-section">
                        <div className="dashboard-btn-container">
                            <i className="filter-icon fa-solid fa-filter"></i>
                            <select name="" id="" className="filter">
                                <option value="">Filter</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="dashboard-stats-container">
                    <div className="dashboard-stats">
                        <StatCard title="Tổng nhiệm vụ" value="190" background="bg-violet" />
                        <StatCard title="Nhiệm vụ Sprint" value="77" background="bg-blue" />
                        <StatCard title="Hoàn thành" value="153" background="bg-violet" />
                        <StatCard title="Trễ hạn" value="12" background="bg-blue" />
                        <StatCard title="Tổng Commit" value="1200" background="bg-violet" />
                        <StatCard title="Tổng LOC" value="150000" background="bg-blue" />
                        <StatCard title="PR Đã Merge" value="45" background="bg-violet" />
                    </div>
                    <div className="dashboard-charts">
                        <MemberCompletionChart groupId={groupId} />
                        <LineChart />
                        <CommitActivityChart />
                        <LOCGrowthChart />
                        <PeerReviewChart />
                        <TaskChart />
                        <PRSizeChart />
                        <BarChart />
                        <ContributorContributionChart />
                        <SprintPerformanceChart />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;