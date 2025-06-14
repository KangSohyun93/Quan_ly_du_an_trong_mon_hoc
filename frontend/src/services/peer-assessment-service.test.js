// src/services/peer-assessment-service.test.js
import { fetchInstructorEvaluations, savePeerAssessment, updatePeerAssessment } from './peer-assessment-service';

// Mock fetch và sessionStorage
global.fetch = jest.fn();
const mockSessionStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

describe('Peer Assessment Service', () => {
    beforeEach(() => {
        fetch.mockClear();
        sessionStorage.setItem('token', 'fake-token');
    });

    describe('fetchInstructorEvaluations', () => {
        it('should fetch evaluations successfully', async () => {
            const mockEvaluations = [{ evaluation_id: 1, score: 90 }];
            fetch.mockResolvedValueOnce({ ok: true, json: async () => mockEvaluations });

            const result = await fetchInstructorEvaluations({ groupId: 1, projectId: 100 });

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/peerassessment/groups/1/projects/100/instructor-evaluations',
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer fake-token',
                    }
                })
            );
            expect(result).toEqual(mockEvaluations);
        });

        it('should throw an error if no token is found', async () => {
            sessionStorage.clear();
            await expect(fetchInstructorEvaluations({ groupId: 1, projectId: 100 }))
                .rejects.toThrow('Không tìm thấy token. Vui lòng đăng nhập lại.');
        });
    });

    describe('savePeerAssessment', () => {
        it('should send a POST request to save an assessment', async () => {
            const assessmentData = { assessor_id: 1, assessee_id: 2, quality_score: 5 };
            fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 123, ...assessmentData }) });

            await savePeerAssessment({ groupId: 1, projectId: 100, assessmentData });

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/peerassessment/groups/1/projects/100/peerassessments',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(assessmentData)
                })
            );
        });
    });

    describe('updatePeerAssessment', () => {
        it('should send a PUT request to update an assessment', async () => {
            const assessmentData = { quality_score: 4 };
            fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

            await updatePeerAssessment({ groupId: 1, projectId: 100, assessmentId: 55, assessmentData });

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/peerassessment/groups/1/projects/100/peerassessments/55',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(assessmentData)
                })
            );
        });
    });
});