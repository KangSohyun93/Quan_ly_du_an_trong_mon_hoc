import pool from '../db.js';

export const getProjectById = async (projectId) => {
    const connection = await pool.getConnection();
    try {
        console.log(`[Model] Fetching project details for projectId: ${projectId}`);
        const [rows] = await connection.query(
            'SELECT project_id, project_name, group_id, description, tools_used, status, github_repo_url, created_at, end_date FROM Projects WHERE project_id = ?',
            [projectId]
        );
        if (rows.length === 0) {
            console.warn(`[Model] Project with id ${projectId} not found.`);
            return null; // Hoặc throw new Error('Project not found'); tùy theo cách bạn muốn xử lý
        }
        console.log(`[Model] Project details for ${projectId}:`, rows[0]);
        return rows[0];
    } catch (error) {
        console.error(`[Model] Error fetching project by id ${projectId}:`, error);
        throw error; // Ném lỗi để controller có thể bắt và xử lý
    } finally {
        connection.release();
    }
};