// src/utils/generateTaskChartConfig.test.js
import { generateTaskChartConfig } from './generateTaskChartConfig';

describe('generateTaskChartConfig', () => {
    const mockTaskSummary = {
        completed: 10,
        inProgress: 5,
        toDo: 2,
        lateCompleted: 1,
        overdueIncomplete: 0, // Giá trị 0 sẽ bị loại bỏ
    };

    it('should generate correct doughnut chart config', () => {
        const { dataForChart, options, totalTasks } = generateTaskChartConfig(mockTaskSummary);

        // Kiểm tra tổng số task
        expect(totalTasks).toBe(18);

        // Kiểm tra rằng dataset không chứa mục có giá trị 0
        expect(dataForChart.labels).toEqual(['Completed', 'In Progress', 'Late Completion', 'To Do']);
        expect(dataForChart.datasets[0].data).toEqual([10, 5, 1, 2]);

        // Kiểm tra options
        expect(options.cutout).toBe('60%');
        expect(options.plugins.title.text).toBe('Task Completion Status');
    });

    it('should handle null task summary', () => {
        const { dataForChart, totalTasks } = generateTaskChartConfig(null);
        expect(dataForChart.labels).toEqual([]);
        expect(dataForChart.datasets).toEqual([]);
        expect(totalTasks).toBeUndefined();
    });
});