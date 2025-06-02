export const generateLateTasksChartConfig = (members, sprintData) => {
    if (!members || members.length === 0) {
        return {
            data: { labels: [], datasets: [] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Late Tasks by Member' } } }
        };
    }

    const lateTasks = members.map(member =>
        sprintData[member.name]?.reduce((sum, sprint) => sum + (sprint.late || 0), 0) || 0
    );

    const data = {
        labels: members.map((member) => member.name),
        datasets: [
            {
                label: 'Late Tasks',
                data: lateTasks,
                backgroundColor: '#F44336',
                borderRadius: 6,
                barThickness: 30,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { color: '#4B5563', font: { family: 'Inter, sans-serif' } }
            },
            title: {
                display: true,
                text: 'Late Tasks by Member',
                font: { size: 18, family: 'Inter, sans-serif', weight: '600' },
                color: '#1F2937',
                padding: { bottom: 20 }
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
                borderColor: '#4B5563',
                borderWidth: 1,
                titleFont: { size: 14, family: 'Inter, sans-serif', weight: 'bold' },
                bodyFont: { size: 13, family: 'Inter, sans-serif' },
                padding: 10,
                callbacks: {
                    title: (tooltipItems) => tooltipItems.length > 0 ? tooltipItems[0].label : '',
                    label: (context) => `Total Late: ${context.raw}`,
                    afterBody: (tooltipItems) => {
                        if (!tooltipItems || tooltipItems.length === 0) return [];
                        const dataIndex = tooltipItems[0].dataIndex;
                        if (dataIndex < 0 || dataIndex >= members.length) return []; // Kiểm tra index hợp lệ

                        const member = members[dataIndex];
                        if (!member || !sprintData[member.name]) return [];

                        const details = sprintData[member.name].map(sprint =>
                            sprint.late > 0 ? `  Sprint ${sprint.sprint}: ${sprint.late} late` : null
                        ).filter(detail => detail !== null);

                        return details.length > 0 ? ["\nDetails by Sprint:", ...details] : [];
                    }
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Member', font: { family: 'Inter, sans-serif', weight: '500' }, color: '#4B5563' },
                ticks: { color: '#4B5563', font: { family: 'Inter, sans-serif' } }
            },
            y: {
                min: 0,
                ticks: { stepSize: 1, color: '#4B5563', font: { family: 'Inter, sans-serif' }, precision: 0 },
                grid: { borderDash: [4, 4], color: '#E5E7EB' },
                title: { display: true, text: 'Number of Late Tasks', font: { family: 'Inter, sans-serif', weight: '500' }, color: '#4B5563' },
            },
        },
    };

    return { data, options };
};