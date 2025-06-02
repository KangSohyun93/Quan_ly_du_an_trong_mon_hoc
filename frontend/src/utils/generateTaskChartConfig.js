// src/utils/generateTaskChartConfig.js
export const generateTaskChartConfig = (taskSummary) => {
    if (!taskSummary) {
        return {
            data: { labels: [], datasets: [] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Task Completion Status' } }, cutout: '60%' }
        };
    }

    const { completed = 0, inProgress = 0, toDo = 0, lateCompleted = 0, overdueIncomplete = 0 } = taskSummary;
    const totalTasks = completed + inProgress + toDo + lateCompleted + overdueIncomplete;

    const chartDataValuesOriginal = [completed, inProgress, lateCompleted, toDo, overdueIncomplete];
    const chartLabelsOriginal = ['Completed', 'In Progress', 'Late Completion', 'To Do', 'Overdue & Incomplete'];
    const backgroundColorsOriginal = ['#4CAF50', '#FFC107', '#FF9800', '#D3D3D3', '#F44336'];

    const activeData = [];
    const activeLabels = [];
    const activeBackgroundColors = [];

    chartDataValuesOriginal.forEach((value, index) => {
        if (value > 0) {
            activeData.push(value);
            activeLabels.push(chartLabelsOriginal[index]);
            activeBackgroundColors.push(backgroundColorsOriginal[index]);
        }
    });

    const dataForChart = {
        labels: activeLabels,
        datasets: [{
            label: 'Task Status',
            data: activeData,
            backgroundColor: activeBackgroundColors,
            borderColor: activeBackgroundColors.map(color => color.replace(')', ', 0.7)').replace('rgb', 'rgba')),
            borderWidth: 1,
            hoverOffset: 8,
        }]
    };

    const options = {
        responsive: true, maintainAspectRatio: false, cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom', labels: { padding: 15, font: { family: 'Inter, sans-serif', size: 12 }, color: '#4B5563' }
            },
            title: {
                display: true, text: 'Task Completion Status',
                font: { size: 18, family: 'Inter, sans-serif', weight: '600' }, color: '#1F2937', padding: { bottom: 15 }
            },
            tooltip: {
                enabled: true, backgroundColor: '#1F2937', titleFont: { family: 'Inter, sans-serif', size: 14, weight: 'bold' },
                bodyFont: { family: 'Inter, sans-serif', size: 13 }, titleColor: '#FFFFFF', bodyColor: '#FFFFFF', padding: 10,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const percentage = totalTasks > 0 ? ((value / totalTasks) * 100).toFixed(1) : 0;
                        return `${label}: ${value} / ${totalTasks} tasks (${percentage}%)`;
                    },
                },
            },
            // datalabels plugin config (nếu bạn dùng ChartDataLabels trực tiếp)
            // Nếu bạn đăng ký ChartDataLabels globally, config này có thể không cần ở đây.
            // Nếu không, bạn cần import và register ChartDataLabels
            // import ChartDataLabels from 'chartjs-plugin-datalabels';
            // ChartJS.register(ChartDataLabels);
            datalabels: {
                display: (context) => context.dataset.data[context.dataIndex] > 0 && totalTasks > 0,
                formatter: (value) => {
                    const percentage = totalTasks > 0 ? ((value / totalTasks) * 100).toFixed(0) : 0;
                    return `${percentage}%`;
                },
                color: '#ffffff', font: { weight: 'bold', size: 12, family: 'Inter, sans-serif' },
                anchor: 'center', align: 'center', textStrokeColor: 'black', textStrokeWidth: 0.5,
            },
        },
    };
    return { dataForChart, options, totalTasks }; // Trả về cả totalTasks để dùng trong component
};