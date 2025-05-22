import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import axios from 'axios';
import '../css/commitactivitychart.css';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

const CommitActivityChart = ({ projectId }) => {
    const [commitData, setCommitData] = useState([]);
    const [selectedMember, setSelectedMember] = useState('all');
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('[CommitActivityChart] projectId prop:', projectId); // LOG 1: projectId đầu vào

        if (!projectId) {
            setCommitData([]);
            setMembers([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setCommitData([]);
        setMembers([]);

        const fetchCommits = async () => {
            try {
                console.log(`[CommitActivityChart] Fetching commits for projectId: ${projectId}`); // LOG 2: Bắt đầu fetch
                const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/commits`);
                const commits = response.data;
                console.log('[CommitActivityChart] Commits received from backend:', commits); // LOG 3: Dữ liệu backend trả về

                if (!commits || commits.length === 0) {
                    console.log('[CommitActivityChart] No commits found or empty array received.'); // LOG 4: Không có commit
                    setLoading(false);
                    return;
                }
                
                const uniqueMembers = [...new Set(commits.map(commit => commit.author_email))];
                setMembers(uniqueMembers);
                console.log('[CommitActivityChart] Unique members:', uniqueMembers); // LOG 5: Thành viên

                const commitsByWeek = {};
                commits.forEach(commit => {
                    if (selectedMember === 'all' || commit.author_email === selectedMember) {
                        const date = new Date(commit.date);
                        const dayNum = date.getUTCDay() || 7;
                        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
                        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
                        const weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
                        const week = `${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
                        
                        if (!commitsByWeek[week]) {
                            commitsByWeek[week] = { total: 0, members: {} };
                        }
                        commitsByWeek[week].total += 1;
                        if (selectedMember === 'all') {
                           commitsByWeek[week].members[commit.author_email] = (commitsByWeek[week].members[commit.author_email] || 0) + 1;
                        }
                    }
                });
                console.log('[CommitActivityChart] Commits grouped by week (before filtering by selectedMember):', JSON.parse(JSON.stringify(commitsByWeek))); // LOG 6
                
                let filteredCommits = [];
                if (selectedMember !== 'all') {
                    for (const weekKey in commitsByWeek) {
                        let memberCommitCountInWeek = 0;
                        commits.forEach(c => { // Lặp lại qua commits gốc để đếm cho member được chọn
                            if (c.author_email === selectedMember) {
                                const date = new Date(c.date);
                                const dayNum = date.getUTCDay() || 7;
                                date.setUTCDate(date.getUTCDate() + 4 - dayNum);
                                const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
                                const weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
                                if (`${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}` === weekKey) {
                                    memberCommitCountInWeek++;
                                }
                            }
                        });

                        if (memberCommitCountInWeek > 0) {
                            filteredCommits.push({
                                week: weekKey,
                                total: memberCommitCountInWeek,
                                members: { [selectedMember]: memberCommitCountInWeek }
                            });
                        }
                     }
                } else {
                    filteredCommits = Object.keys(commitsByWeek).map(week => ({
                        week,
                        total: commitsByWeek[week].total,
                        members: commitsByWeek[week].members,
                    }));
                }
                console.log('[CommitActivityChart] Filtered commits (after considering selectedMember):', filteredCommits); // LOG 7


                const formattedData = filteredCommits
                    .sort((a, b) => a.week.localeCompare(b.week))
                    .slice(-5); 
                console.log('[CommitActivityChart] Formatted data for chart (last 5 weeks):', formattedData); // LOG 8

                setCommitData(formattedData);
                setLoading(false);
            } catch (error) {
                console.error('[CommitActivityChart] Error fetching commit data:', error); // LOG 9: Lỗi
                setError('Không thể tải dữ liệu commit.');
                setCommitData([]);
                setMembers([]);
                setLoading(false);
            }
        };
        fetchCommits();
    }, [projectId, selectedMember]);

    // ... (phần còn lại của component không đổi)
    const chartData = {
        labels: commitData.map(item => item.week),
        datasets: [
            {
                label: selectedMember === 'all' ? 'Tổng số commit' : `Commit của ${selectedMember.split('@')[0]}`,
                data: commitData.map(item => item.total),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            title: {
                display: true,
                text: 'Hoạt động commit (5 tuần gần nhất)',
                font: { size: 16, family: 'Inter, sans-serif' },
                color: '#1F2937',
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => {
                        if (!commitData[context.dataIndex]) return '';
                        const weekData = commitData[context.dataIndex];
                        const lines = [`Tổng commit trong tuần: ${weekData.total}`];
                        if (selectedMember === 'all' && weekData.members && Object.keys(weekData.members).length > 0) {
                            Object.entries(weekData.members).forEach(([email, count]) => {
                                lines.push(`${email.split('@')[0]}: ${count}`);
                            });
                        } else if (selectedMember !== 'all' && weekData.members && weekData.members[selectedMember]) {
                             lines.push(`${selectedMember.split('@')[0]}: ${weekData.members[selectedMember]}`);
                        }
                        return lines;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Thời gian (Tuần)', font: { family: 'Inter, sans-serif' } },
            },
            y: {
                min: 0,
                ticks: { 
                    precision: 0, 
                    callback: function(value) { if (Number.isInteger(value)) { return value; } },
                },
                grid: { borderDash: [5, 5] },
                title: { display: true, text: 'Số commit', font: { family: 'Inter, sans-serif' } },
            },
        },
    };
    
    if (commitData.length > 0) {
        const maxTotal = Math.max(...commitData.map(item => item.total), 0);
        chartOptions.scales.y.ticks.stepSize = maxTotal > 0 && maxTotal < 5 ? 1 : Math.ceil(maxTotal / 5) || 1;
    }

    let content;
    if (loading) {
        content = <p>Đang tải dữ liệu commit...</p>;
    } else if (error) {
        content = <p className="error">{error}</p>;
    } else if (commitData.length === 0 && projectId) { // Chỉ hiện "không có dữ liệu" nếu đã có projectId
        content = <p>Không có dữ liệu commit cho lựa chọn này.</p>;
    } else if (!projectId) {
        content = <p>Vui lòng chọn một dự án để xem hoạt động commit.</p>;
    }
    else {
        content = <Line data={chartData} options={chartOptions} />;
    }

    return (
        <div className="commitactivity-chart-container">
            <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                style={{ marginBottom: '10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                disabled={loading || (members.length === 0 && selectedMember === 'all') || !projectId}
            >
                <option value="all">Tất cả thành viên</option>
                {members.map(member => (
                    <option key={member} value={member}>{member.split('@')[0]}</option>
                ))}
            </select>
            {content}
        </div>
    );
};
export default CommitActivityChart;