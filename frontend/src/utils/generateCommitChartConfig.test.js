// src/utils/generateCommitChartConfig.test.js
import { generateCommitChartConfig } from './generateCommitChartConfig';

describe('generateCommitChartConfig', () => {
    const mockWeeklyActivity = [
        { week: '2023-W01', label: '01/01 - 07/01 (2023)', total: 10, usersDetail: { 1: { username: 'userA', count: 6 }, 2: { username: 'userB', count: 4 } } },
        { week: '2023-W02', label: '08/01 - 14/01 (2023)', total: 5, usersDetail: { 1: { username: 'userA', count: 5 } } },
    ];
    const mockProjectUsers = [{ user_id: 1, username: 'userA' }, { user_id: 2, username: 'userB' }];

    it('should generate correct config for "all" users', () => {
        const { chartData, chartOptions } = generateCommitChartConfig(mockWeeklyActivity, 'all', mockProjectUsers);

        expect(chartData.labels).toEqual(['01/01 - 07/01 (2023)', '08/01 - 14/01 (2023)']);
        expect(chartData.datasets[0].label).toBe('Total Commits per Week');
        expect(chartData.datasets[0].data).toEqual([10, 5]);
        expect(chartOptions.plugins.title.text).toBe('Weekly Commit Activity');
    });

    it('should generate correct config for a selected user', () => {
        const { chartData } = generateCommitChartConfig(mockWeeklyActivity, '1', mockProjectUsers);

        expect(chartData.datasets[0].label).toContain('Commits by userA');
        // Lưu ý: Dữ liệu total vẫn là của cả nhóm, logic này có thể cần xem lại trong code gốc.
        // Nếu muốn chỉ hiển thị commit của user đó, hàm gốc cần được sửa.
        // Dựa trên code hiện tại, nó chỉ đổi label.
        expect(chartData.datasets[0].data).toEqual([10, 5]);
    });

    it('should return a valid stepSize for the y-axis', () => {
        const { chartOptions } = generateCommitChartConfig(mockWeeklyActivity, 'all', mockProjectUsers);
        expect(chartOptions.scales.y.ticks.stepSize).toBe(1); // max is 10, so step is 1
    });

    it('should handle empty weekly activity', () => {
        const { chartData, chartOptions } = generateCommitChartConfig([], 'all', []);
        expect(chartData.labels).toEqual([]);
        expect(chartData.datasets[0].data).toEqual([]);
        expect(chartOptions.scales.y.ticks.stepSize).toBeUndefined(); // Không có data, không tính stepSize
    });
});