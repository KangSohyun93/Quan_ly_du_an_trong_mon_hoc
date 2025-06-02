export const generateSprintPerformanceChartConfig = (sprints) => { 
    if (!sprints || sprints.length === 0) {
        return {
            data: { labels: [], datasets: [] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Sprint Performance Over Time' } } }
        };
    }
    const data = {
        labels: sprints.map((sprint) => `Sprint ${sprint.sprint}`),
        datasets: [
            { label: 'Completed', data: sprints.map((sprint) => sprint.completed), backgroundColor: '#4CAF50', borderRadius: 6 },
            { label: 'Late', data: sprints.map((sprint) => sprint.late), backgroundColor: '#F44336', borderRadius: 6 },
        ],
    };
    const options = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top', labels: { color: '#4B5563', font: { family: 'Inter, sans-serif' } } },
            title: {
                display: true, text: 'Sprint Performance Over Time',
                font: { size: 18, family: 'Inter, sans-serif', weight: '600' },
                color: '#1F2937', padding: { bottom: 20 }
            },
            tooltip: {
                enabled: true, backgroundColor: '#1F2937', titleColor: '#FFFFFF', bodyColor: '#FFFFFF',
                borderColor: '#4B5563', borderWidth: 1,
                titleFont: { size: 14, family: 'Inter, sans-serif', weight: 'bold' },
                bodyFont: { size: 13, family: 'Inter, sans-serif' }, padding: 10,
                callbacks: {
                    label: (context) => {
                        const sprintDetail = sprints[context.dataIndex];
                        if (!sprintDetail) return '';
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}: ${value} / ${sprintDetail.total} tasks`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Sprint', font: { family: 'Inter, sans-serif', weight: '500' }, color: '#4B5563' },
                ticks: { color: '#4B5563', font: { family: 'Inter, sans-serif' } }
            },
            y: {
                min: 0,
                ticks: { stepSize: 5, color: '#4B5563', font: { family: 'Inter, sans-serif' }, precision: 0 },
                grid: { borderDash: [4, 4], color: '#E5E7EB' },
                title: { display: true, text: 'Number of Tasks', font: { family: 'Inter, sans-serif', weight: '500' }, color: '#4B5563' },
            },
        },
    };
    return { data, options };
};