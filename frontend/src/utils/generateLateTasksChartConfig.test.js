// src/utils/generateLateTasksChartConfig.test.js
import { generateLateTasksChartConfig } from './generateLateTasksChartConfig';

describe('generateLateTasksChartConfig', () => {
    const mockMembers = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
    ];
    const mockSprintData = {
        'Alice': [{ sprint: 1, late: 2 }, { sprint: 2, late: 1 }],
        'Bob': [{ sprint: 1, late: 0 }, { sprint: 2, late: 3 }],
    };

    it('should generate correct chart data and options with valid inputs', () => {
        const { data, options } = generateLateTasksChartConfig(mockMembers, mockSprintData);

        // Kiểm tra labels của chart phải là tên của members
        expect(data.labels).toEqual(['Alice', 'Bob']);

        // Kiểm tra dataset
        expect(data.datasets).toHaveLength(1);
        expect(data.datasets[0].label).toBe('Late Tasks');

        // Kiểm tra dữ liệu (Alice có 2+1=3 late, Bob có 0+3=3 late)
        expect(data.datasets[0].data).toEqual([3, 3]);

        // Kiểm tra một vài options quan trọng
        expect(options.plugins.title.text).toBe('Late Tasks by Member');
        expect(options.scales.y.ticks.stepSize).toBe(1);
    });

    it('should handle empty members array', () => {
        const { data, options } = generateLateTasksChartConfig([], mockSprintData);
        expect(data.labels).toEqual([]);
        expect(data.datasets).toEqual([]);
        expect(options.plugins.title.text).toBe('Late Tasks by Member'); // Vẫn có title
    });

    it('should handle members with no sprint data', () => {
        const membersWithNoData = [{ id: 3, name: 'Charlie' }];
        const { data } = generateLateTasksChartConfig(membersWithNoData, mockSprintData);

        // Charlie không có trong sprintData, nên số task late là 0
        expect(data.datasets[0].data).toEqual([0]);
    });
});