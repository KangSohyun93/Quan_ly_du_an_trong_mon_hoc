// src/utils/generateSprintPerformanceChartConfig.test.js
import { generateSprintPerformanceChartConfig } from './generateSprintPerformanceChartConfig';

describe('generateSprintPerformanceChartConfig', () => {
    const mockSprints = [
        { sprint: 1, completed: 10, late: 2, total: 12 },
        { sprint: 2, completed: 8, late: 1, total: 9 },
    ];

    it('should generate correct data for sprint performance', () => {
        const { data, options } = generateSprintPerformanceChartConfig(mockSprints);

        expect(data.labels).toEqual(['Sprint 1', 'Sprint 2']);
        expect(data.datasets).toHaveLength(2);

        const completedData = data.datasets.find(d => d.label === 'Completed').data;
        const lateData = data.datasets.find(d => d.label === 'Late').data;

        expect(completedData).toEqual([10, 8]);
        expect(lateData).toEqual([2, 1]);
        expect(options.plugins.title.text).toBe('Sprint Performance Over Time');
    });

    it('should return empty config for no sprints', () => {
        const { data } = generateSprintPerformanceChartConfig([]);
        expect(data.labels).toEqual([]);
        expect(data.datasets).toEqual([]);
    });
});