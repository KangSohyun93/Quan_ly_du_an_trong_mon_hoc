// src/utils/generateLOCGrowthChartConfig.test.js
import { generateLOCGrowthChartConfig } from './generateLOCGrowthChartConfig';

describe('generateLOCGrowthChartConfig', () => {
    const mockWeeklyLOCActivity = [
        { week: '2023-W40', label: 'Week 40', linesAdded: 100, linesRemoved: 50, usersDetail: { '1': { username: 'userA', added: 100, removed: 50 } } },
        { week: '2023-W41', label: 'Week 41', linesAdded: 200, linesRemoved: 20, usersDetail: { '1': { username: 'userA', added: 150, removed: 10 }, '2': { username: 'userB', added: 50, removed: 10 } } },
    ];
    const mockProjectUsers = [{ user_id: 1, username: 'userA' }, { user_id: 2, username: 'userB' }];

    it('should generate correct config for "all" users', () => {
        const { chartData } = generateLOCGrowthChartConfig(mockWeeklyLOCActivity, 'all', mockProjectUsers);

        expect(chartData.labels).toEqual(['Week 40', 'Week 41']);
        expect(chartData.datasets[0].label).toBe('Total Lines Added');
        expect(chartData.datasets[0].data).toEqual([100, 200]);
        expect(chartData.datasets[1].label).toBe('Total Lines Removed');
        expect(chartData.datasets[1].data).toEqual([50, 20]);
    });

    it('should generate correct config for a selected user', () => {
        const { chartData } = generateLOCGrowthChartConfig(mockWeeklyLOCActivity, '1', mockProjectUsers);

        // Chỉ đổi label, data vẫn là của cả nhóm theo logic code gốc
        expect(chartData.datasets[0].label).toBe('Lines Added by userA');
        expect(chartData.datasets[1].label).toBe('Lines Removed by userA');
        expect(chartData.datasets[0].data).toEqual([100, 200]);
        expect(chartData.datasets[1].data).toEqual([50, 20]);
    });

    it('should handle empty activity data', () => {
        const { chartData } = generateLOCGrowthChartConfig([], 'all', []);
        expect(chartData.labels).toEqual([]);
        expect(chartData.datasets[0].data).toEqual([]);
        expect(chartData.datasets[1].data).toEqual([]);
    });
});