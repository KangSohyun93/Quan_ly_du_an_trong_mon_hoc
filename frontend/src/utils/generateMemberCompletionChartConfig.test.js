// src/utils/generateMemberCompletionChartConfig.test.js
import { generateMemberCompletionChartConfig } from './generateMemberCompletionChartConfig';

describe('generateMemberCompletionChartConfig', () => {
    const mockMembers = [
        { name: 'Alice', role: 'PM', completed: 5, inProgress: 2, lateCompletion: 1, toDo: 0, overdueIncomplete: 0, total: 8 },
        { name: 'Bob', role: 'Member', completed: 3, inProgress: 1, lateCompletion: 0, toDo: 4, overdueIncomplete: 1, total: 9 },
    ];

    it('should generate correct stacked bar chart data', () => {
        const { data, options } = generateMemberCompletionChartConfig(mockMembers);

        expect(data.labels).toEqual(['Alice', 'Bob']);
        expect(data.datasets).toHaveLength(5);

        // Kiểm tra một vài dataset
        const completedDataset = data.datasets.find(d => d.label === 'Completed');
        expect(completedDataset.data).toEqual([5, 3]);

        const overdueDataset = data.datasets.find(d => d.label === 'Overdue & Incomplete');
        expect(overdueDataset.data).toEqual([0, 1]);

        // Kiểm tra options đặc biệt (stacked)
        expect(options.indexAxis).toBe('y');
        expect(options.scales.x.stacked).toBe(true);
        expect(options.scales.y.stacked).toBe(true);
    });

    it('should handle empty members data', () => {
        const { data } = generateMemberCompletionChartConfig([]);
        expect(data.labels).toEqual([]);
        expect(data.datasets).toEqual([]);
    });
});