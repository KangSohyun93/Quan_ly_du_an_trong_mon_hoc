import pool from '../db.js';

async function getGroups() {
    try {
        const [groups] = await pool.query(`
            SELECT group_id, group_name
            FROM \`Groups\`
            ORDER BY group_id
        `);
        return groups;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw new Error('Internal server error');
    }
}

async function getMembersByGroupId(groupId) {
    try {
        // Kiểm tra nhóm tồn tại
        const [groupCheck] = await pool.query(`SELECT 1 FROM \`Groups\` WHERE group_id = ?`, [groupId]);
        if (groupCheck.length === 0) {
            throw new Error(`Group with ID ${groupId} not found`);
        }

        // Lấy danh sách thành viên trong nhóm
        const [members] = await pool.query(`
            SELECT 
                u.user_id, u.username AS name, u.avatar,
                g.leader_id, gm.joined_at AS joinDate,
                DATEDIFF(NOW(), gm.joined_at) AS workDays,
                COALESCE(COUNT(CASE WHEN t.status = 'Completed' THEN 1 END), 0) AS completed,
                COALESCE(COUNT(CASE WHEN t.status = 'In-Progress' THEN 1 END), 0) AS inProgress,
                COALESCE(COUNT(CASE WHEN t.status = 'To-Do' THEN 1 END), 0) AS notStarted,
                COALESCE(COUNT(t.task_id), 0) AS total
            FROM GroupMembers gm
            JOIN Users u ON gm.user_id = u.user_id
            JOIN \`Groups\` g ON gm.group_id = g.group_id
            LEFT JOIN Tasks t ON t.assigned_to = u.user_id
            WHERE gm.group_id = ?
            GROUP BY u.user_id, u.username, u.avatar, g.leader_id, gm.joined_at
        `, [groupId]);

        // Lấy dữ liệu sprint cho từng thành viên
        const [sprintDataRaw] = await pool.query(`
            SELECT 
                u.user_id, u.username, s.sprint_id, s.sprint_number AS sprint,
                COALESCE(COUNT(CASE WHEN t.status = 'Completed' THEN 1 END), 0) AS completed,
                COALESCE(COUNT(t.task_id), 0) AS total,
                COALESCE(COUNT(CASE WHEN t.completed_at > t.due_date 
                                OR (t.due_date < NOW() AND t.status != 'Completed') THEN 1 END), 0) AS late
            FROM GroupMembers gm
            JOIN Users u ON gm.user_id = u.user_id
            JOIN Sprints s ON s.project_id = (SELECT project_id FROM Projects WHERE group_id = gm.group_id)
            LEFT JOIN Tasks t ON t.sprint_id = s.sprint_id AND t.assigned_to = u.user_id
            WHERE gm.group_id = ?
            GROUP BY u.user_id, u.username, s.sprint_id, s.sprint_number
            ORDER BY s.sprint_number
        `, [groupId]);

        // Định dạng sprintData
        const sprintData = {};
        members.forEach(member => {
            sprintData[member.name] = sprintDataRaw
                .filter(row => row.user_id === member.user_id)
                .map(row => ({
                    sprint: row.sprint,
                    completed: Number(row.completed),
                    total: Number(row.total),
                    late: Number(row.late),
                }));
        });

        // Thêm role và format members
        const formattedMembers = members.map(member => ({
            name: member.name,
            completed: Number(member.completed),
            total: Number(member.total),
            inProgress: Number(member.inProgress),
            notStarted: Number(member.notStarted),
            role: member.user_id === member.leader_id ? 'PM' : 'Member',
            avatar: member.avatar || 'https://i.pravatar.cc/150?img=1',
            joinDate: member.joinDate,
            workDays: Number(member.workDays),
        }));

        return { members: formattedMembers, sprintData };
    } catch (error) {
        console.error(`Error fetching members for group ${groupId}:`, error);
        throw error;
    }
}

async function getPeerAssessments(groupId) {
    try {
        // Chuyển groupId thành số
        const groupIdNum = parseInt(groupId, 10);
        if (isNaN(groupIdNum)) {
            throw new Error('Invalid groupId');
        }

        // Kiểm tra nhóm tồn tại
        const [groupCheck] = await pool.query('SELECT 1 FROM `Groups` WHERE group_id = ?', [groupIdNum]);
        if (groupCheck.length === 0) {
            throw new Error(`Group with ID ${groupId} not found`);
        }

        // Lấy dữ liệu đánh giá ngang hàng
        const [assessments] = await pool.query(`
            SELECT 
                u_assessee.username AS name,
                AVG(COALESCE(pa.deadline_score, 0) + 
                    COALESCE(pa.friendly_score, 0) + 
                    COALESCE(pa.quality_score, 0) + 
                    COALESCE(pa.team_support_score, 0) + 
                    COALESCE(pa.responsibility_score, 0)) / 5.0 AS score,
                u_assessor.username AS reviewer,
                (COALESCE(pa.deadline_score, 0) + 
                 COALESCE(pa.friendly_score, 0) + 
                 COALESCE(pa.quality_score, 0) + 
                 COALESCE(pa.team_support_score, 0) + 
                 COALESCE(pa.responsibility_score, 0)) / 5.0 AS detail_score,
                pa.note AS comment
            FROM PeerAssessments pa
            JOIN Users u_assessee ON pa.assessee_id = u_assessee.user_id
            JOIN Users u_assessor ON pa.assessor_id = u_assessor.user_id
            WHERE pa.group_id = ?
            GROUP BY u_assessee.user_id, u_assessee.username, u_assessor.username, pa.note, pa.deadline_score, pa.friendly_score, pa.quality_score, pa.team_support_score, pa.responsibility_score
        `, [groupIdNum]);

        // Định dạng dữ liệu giống peerReviewData
        const peerReviewData = [];
        const members = [...new Set(assessments.map(a => a.name))];
        for (const member of members) {
            const memberAssessments = assessments.filter(a => a.name === member);
            const avgScore = memberAssessments.reduce((sum, a) => sum + Number(a.score), 0) / memberAssessments.length || 0;
            const details = memberAssessments.map(a => ({
                reviewer: a.reviewer,
                score: a.detail_score ? Number(Number(a.detail_score).toFixed(1)) : 0,
                comment: a.comment || 'Không có bình luận'
            }));
            peerReviewData.push({
                name: member,
                score: Number(avgScore.toFixed(1)),
                details
            });
        }

        return peerReviewData;
    } catch (error) {
        console.error(`Error fetching peer assessments for group ${groupId}:`, error.message, error.stack);
        throw error;
    }
}

export { getGroups, getMembersByGroupId, getPeerAssessments };