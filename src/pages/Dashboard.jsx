import React from 'react';
import StatCard from '../components/StatCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import RecentCommits from '../components/RecentCommits';
import TaskDoneChart from '../components/TaskChart';
import CompletionPieChart from '../components/CompletionPieChart';
import ProgressScatterChart from '../components/ProgressScatterChart';
import MemberCompletionChart from '../components/MemberCompletionChart';
import '../css/dashboard.css';

const avatars = [
    '/assets/images/classes/class1/group1/avatars/member1.svg',
    '/assets/images/classes/class1/group1/avatars/member2.svg',
    '/assets/images/classes/class1/group1/avatars/member3.svg',
];

const Dashboard = () => {
    return (
        <section className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1 className="project-name">Team name</h1>
                        <select className="project-select">
                            <option value="">Change project</option>
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
                                style={{ zIndex: index + 1 }} // zIndex tăng dần để avatar sau nằm trên
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
                            <i class="fa-solid fa-house"></i>
                            <button className="dashboard-btn">Introduce</button>
                        </div>
                        <div className="dashboard-btn-container dashboard-btn-active">
                            <i class="fa-solid fa-chart-line"></i>
                            <button className="dashboard-btn">Dashboard</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i class="fa-solid fa-list-check"></i>
                            <button className="dashboard-btn">Team task</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i class="fa-solid fa-list"></i>
                            <button className="dashboard-btn">My task</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i class="fa-solid fa-calendar-day"></i>
                            <button className="dashboard-btn">Roadmap</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i class="rate-icon fa-solid fa-star"></i>
                            <button className="dashboard-btn">Rate</button>
                        </div>
                    </div>
                    <div className="control-section">
                        <div className="dashboard-btn-container">
                            <i class="filter-icon fa-solid fa-filter"></i>
                            <select name="" id="" className="filter">
                                <option value="">Filter</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="dashboard-stats-container">
                    <div className="dashboard-stats">
                        <StatCard title="All Task" value="30" background="bg-violet" />
                        <StatCard title="Task Sprint" value="30" background="bg-blue" />
                        <StatCard title="Commit" value="30" background="bg-violet" />
                        <StatCard title="Done" value="30" background="bg-blue" />
                    </div>
                    <div className="dashboard-charts">
                        {/* <div className="col-1"> */}
                            <MemberCompletionChart />
                        {/* </div> */}
                        <LineChart />
                        <BarChart />
                        <RecentCommits />
                        <TaskDoneChart />
                        <CompletionPieChart />
                        <ProgressScatterChart />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;