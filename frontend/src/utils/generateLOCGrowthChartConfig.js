// src/utils/generateLOCGrowthChartConfig.js
export const generateLOCGrowthChartConfig = (weeklyLOCActivity, selectedUser, projectUsers) => {
    const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);
    const selectedUserName = projectUsers.find(u => u.user_id === currentSelectedUserIdNum)?.username;

    const chartData = {
        labels: weeklyLOCActivity.map(item => item.label),
        datasets: [
            {
                label: selectedUser === 'all' ? 'Total Lines Added' : `Lines Added by ${selectedUserName || 'User'}`,
                data: weeklyLOCActivity.map(item => item.linesAdded),
                borderColor: 'rgb(76, 175, 80)', backgroundColor: 'rgba(76, 175, 80, 0.7)',
                yAxisID: 'y-added', tension: 0.1, pointRadius: 3,
            },
            {
                label: selectedUser === 'all' ? 'Total Lines Removed' : `Lines Removed by ${selectedUserName || 'User'}`,
                data: weeklyLOCActivity.map(item => item.linesRemoved),
                borderColor: 'rgb(244, 67, 54)', backgroundColor: 'rgba(244, 67, 54, 0.7)',
                yAxisID: 'y-removed', tension: 0.1, pointRadius: 3,
            },
        ],
    };

    const chartOptions = {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        stacked: false,
        plugins: {
            title: { display: true, text: 'Weekly Lines of Code Changed', font: { size: 16 } },
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => weeklyLOCActivity[tooltipItems[0].dataIndex]?.label || '',
                    beforeBody: (tooltipItems) => {
                        const dataIndex = tooltipItems[0].dataIndex;
                        const weekData = weeklyLOCActivity[dataIndex];
                        if (!weekData) return [];
                        if (selectedUser === 'all') return [`Total Added: ${weekData.linesAdded}`, `Total Removed: ${weekData.linesRemoved}`];
                        return [];
                    },
                    label: (context) => {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) label += context.parsed.y;
                        return label;
                    },
                    afterBody: (tooltipItems) => {
                        const dataIndex = tooltipItems[0].dataIndex;
                        const weekData = weeklyLOCActivity[dataIndex];
                        if (!weekData || selectedUser !== 'all' || Object.keys(weekData.usersDetail).length === 0) return [];
                        const lines = ['\nBreakdown:'];
                        const sortedUserIds = Object.keys(weekData.usersDetail).sort((a, b) => weekData.usersDetail[a].username.localeCompare(weekData.usersDetail[b].username));
                        sortedUserIds.forEach(userIdStr => {
                            const userStats = weekData.usersDetail[userIdStr];
                            if (userStats.added > 0 || userStats.removed > 0) lines.push(`  ${userStats.username}: +${userStats.added} / -${userStats.removed}`);
                        });
                        return lines.length > 1 ? lines : [];
                    },
                },
            },
        },
        scales: {
            x: { title: { display: true, text: 'Week' } },
            'y-added': { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Lines Added', fontColor: 'rgb(75, 192, 100)' }, grid: { drawOnChartArea: true }, ticks: { precision: 0 }, min: 0, },
            'y-removed': { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Lines Removed', fontColor: 'rgb(255, 99, 132)' }, grid: { drawOnChartArea: false }, ticks: { precision: 0 }, min: 0, },
        },
    };
    if (weeklyLOCActivity.length > 0) {
        const maxAdded = Math.max(...weeklyLOCActivity.map(item => item.linesAdded), 0);
        const maxRemoved = Math.max(...weeklyLOCActivity.map(item => item.linesRemoved), 0);
        chartOptions.scales['y-added'].ticks.stepSize = Math.max(1, Math.ceil(maxAdded / 10) || 1); // Đảm bảo step > 0
        chartOptions.scales['y-removed'].ticks.stepSize = Math.max(1, Math.ceil(maxRemoved / 10) || 1); // Đảm bảo step > 0
    }
    return { chartData, chartOptions };
};