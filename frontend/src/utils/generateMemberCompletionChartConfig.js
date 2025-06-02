export const generateMemberCompletionChartConfig = (members) => {
    if (!members || members.length === 0) {
        return {
            data: { labels: [], datasets: [] },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Member Task Status Distribution' } } }
        };
    }

    const data = {
        labels: members.map(member => member.name),
        datasets: [
            { label: 'Completed', data: members.map(member => member.completed), backgroundColor: '#4CAF50' },
            { label: 'In Progress', data: members.map(member => member.inProgress), backgroundColor: '#FFC107' },
            { label: 'Late Completion', data: members.map(member => member.lateCompletion), backgroundColor: '#FF9800' },
            { label: 'To Do', data: members.map(member => member.toDo), backgroundColor: '#D3D3D3' },
            { label: 'Overdue & Incomplete', data: members.map(member => member.overdueIncomplete), backgroundColor: '#F44336' },
        ].map(ds => ({ ...ds, borderRadius: 4, barPercentage: 0.7, categoryPercentage: 0.8 })), // Thêm styling chung cho dataset
    };

    const yTickColors = members.map(member => member.role === 'PM' ? '#007bff' : '#4B5563');

    const options = {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top', labels: { font: { family: 'Inter, sans-serif' }, color: '#4B5563' } },
            title: {
                display: true, text: 'Member Task Status Distribution', align: 'start',
                font: { size: 18, weight: 'bold', family: 'Inter, sans-serif' }, color: '#1F2937', padding: { bottom: 20 },
            },
            tooltip: {
                enabled: true, backgroundColor: '#1F2937', borderColor: '#4B5563', borderWidth: 1,
                titleFont: { size: 14, family: 'Inter, sans-serif', weight: 'bold' },
                bodyFont: { size: 13, family: 'Inter, sans-serif' },
                titleColor: '#ffffff', bodyColor: '#ffffff',
                callbacks: {
                    title: (tooltipItems) => {
                        if (tooltipItems.length > 0) {
                            const memberIndex = tooltipItems[0].dataIndex;
                            return (memberIndex >= 0 && memberIndex < members.length) ? members[memberIndex].name : '';
                        }
                        return '';
                    },
                    label: (context) => {
                        const memberIndex = context.dataIndex;
                        if (memberIndex < 0 || memberIndex >= members.length) return '';
                        const member = members[memberIndex];
                        const datasetLabel = context.dataset.label;
                        const value = context.raw;
                        const percentage = (member.total && member.total > 0) ? ((value / member.total) * 100).toFixed(1) : 0;
                        return `${datasetLabel}: ${value} / ${member.total} (${percentage}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true, ticks: { precision: 0, font: { family: 'Inter, sans-serif' }, color: '#4B5563', stepSize: 1 },
                grid: { display: false },
                title: { display: true, text: 'Number of Tasks', font: { family: 'Inter, sans-serif', weight: '500' }, color: '#4B5563' }
            },
            y: {
                stacked: true, grid: { display: false },
                ticks: { font: { family: 'Inter, sans-serif', size: 14 }, color: yTickColors },
            },
        },
        animation: { duration: 500, easing: 'easeOutCubic' },
    };
    return { data, options };
};