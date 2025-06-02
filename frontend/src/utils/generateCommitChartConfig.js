// src/utils/generateCommitChartConfig.js
export const generateCommitChartConfig = (weeklyActivity, selectedUser, projectUsers) => {
    // ... (Copy toàn bộ logic từ hàm chartDataOptionsUnchanged của bạn vào đây)
    // ... (Hàm này sẽ nhận weeklyActivity, selectedUser, projectUsers và trả về { chartData, chartOptions })
    const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);
    const datasetLabel = selectedUser === 'all'
        ? 'Total Commits per Week'
        : `Commits by ${projectUsers.find(u => u.user_id === currentSelectedUserIdNum)?.username || 'Selected User'} per Week`;

    const chartData = {
        labels: weeklyActivity.map(item => item.label),
        datasets: [
            {
                label: datasetLabel,
                data: weeklyActivity.map(item => item.total),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.1,
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false, },
        plugins: {
            legend: { display: true, position: 'top', labels: { font: { family: 'Inter, sans-serif' } } },
            title: { display: true, text: 'Weekly Commit Activity', font: { size: 16, family: 'Inter, sans-serif', weight: 'bold' }, color: '#1F2937', padding: { bottom: 15 } },
            tooltip: {
                enabled: true, backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { family: 'Inter, sans-serif', weight: 'bold' }, bodyFont: { family: 'Inter, sans-serif' },
                callbacks: {
                    title: function (tooltipItems) { return tooltipItems.length > 0 ? `Week: ${tooltipItems[0].label}` : ''; },
                    label: function (context) {
                        let labelText = context.dataset.label || '';
                        if (labelText) { labelText = labelText.replace(' per Week', ''); labelText += ': '; }
                        if (context.parsed.y !== null) labelText += context.parsed.y;
                        return labelText;
                    },
                    afterBody: function (tooltipItems) {
                        if (selectedUser === 'all' && weeklyActivity.length > 0 && tooltipItems.length > 0) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            if (weeklyActivity[dataIndex]) {
                                const weekData = weeklyActivity[dataIndex];
                                const userDetailsInWeek = weekData.usersDetail;
                                let lines = [];
                                if (Object.keys(userDetailsInWeek).length > 0 && weekData.total > 0) {
                                    lines.push("\nBreakdown:");
                                    const sortedUserIds = Object.keys(userDetailsInWeek).sort((a, b) => userDetailsInWeek[a].username.localeCompare(userDetailsInWeek[b].username));
                                    sortedUserIds.forEach(userIdKey => {
                                        const userData = userDetailsInWeek[userIdKey];
                                        if (userData.count > 0) lines.push(`  ${userData.username}: ${userData.count}`);
                                    });
                                }
                                return lines.length > 1 ? lines : [];
                            }
                        }
                        return [];
                    }
                },
            },
        },
        scales: {
            x: { type: 'category', title: { display: true, text: 'Week (Start Date - End Date)', font: { family: 'Inter, sans-serif', weight: '600' }, }, ticks: { font: { family: 'Inter, sans-serif', size: 10 }, autoSkip: true, maxRotation: 30, minRotation: 0, padding: 5, } },
            y: { min: 0, title: { display: true, text: 'Number of Commits', font: { family: 'Inter, sans-serif', weight: '600' }, }, ticks: { precision: 0, font: { family: 'Inter, sans-serif' }, }, grid: { borderDash: [3, 3], color: 'rgba(200, 200, 200, 0.3)' }, },
        },
    };
    if (weeklyActivity.length > 0) {
        const dataForStepSize = weeklyActivity.map(item => item.total);
        const maxTotalCommits = Math.max(...dataForStepSize, 0);
        let step = 1;
        if (maxTotalCommits > 10) step = Math.ceil(maxTotalCommits / 10);
        else if (maxTotalCommits > 5) step = 2;
        chartOptions.scales.y.ticks.stepSize = step || 1;
    }
    return { chartData, chartOptions };
};