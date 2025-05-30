import pool from '../db.js';

// Modified getGroups function
async function getGroups(userId, classId, userRole) {
    // userId, classId, and userRole are expected to be validated and provided by the caller (e.g., route handler)
    if (!userId || !classId || !userRole) {
        console.error('getGroups called without userId, classId, or userRole.');
        throw new Error('Internal server error: Missing required parameters for fetching groups.');
    }

    try {
        let query;
        const params = [classId]; // Start with classId for all queries

        if (userRole === 'Instructor') {
            query = `
                SELECT g.group_id, g.group_name, p.project_id, c.class_name
                FROM \`Groups\` g
                JOIN Classes c ON g.class_id = c.class_id
                LEFT JOIN Projects p ON g.group_id = p.group_id
                WHERE g.class_id = ? AND c.instructor_id = ?
                ORDER BY g.group_name
            `;
            params.push(userId); // Add instructor's userId
        } else if (userRole === 'Student') {
            query = `
                SELECT g.group_id, g.group_name, p.project_id, c.class_name
                FROM \`Groups\` g
                JOIN GroupMembers gm ON g.group_id = gm.group_id
                JOIN Classes c ON g.class_id = c.class_id 
                LEFT JOIN Projects p ON g.group_id = p.group_id
                WHERE g.class_id = ? AND gm.user_id = ?
                ORDER BY g.group_name
            `;
            params.push(userId); // Add student's userId
        } else if (userRole === 'Admin') {
            // Admin sees all groups in the specified classId
            query = `
                SELECT g.group_id, g.group_name, p.project_id, c.class_name
                FROM \`Groups\` g
                JOIN Classes c ON g.class_id = c.class_id
                LEFT JOIN Projects p ON g.group_id = p.group_id
                WHERE g.class_id = ? 
                ORDER BY g.group_name
            `;
            // No additional userId needed for params, already has classId
        } else {
            console.warn(`Unhandled role: ${userRole} for userId: ${userId} in getGroups.`);
            return []; // Return empty for unhandled roles
        }

        const [groups] = await pool.query(query, params);
        return groups;
    } catch (error) {
        console.error(`Error fetching groups for user ${userId} (role: ${userRole}) in class ${classId}:`, error);
        throw new Error('Internal server error while fetching groups list.');
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
            LEFT JOIN Tasks t ON t.assigned_to = u.user_id AND t.sprint_id IN (SELECT sprint_id FROM Sprints s JOIN Projects pr ON s.project_id = pr.project_id WHERE pr.group_id = gm.group_id) -- Ensure tasks are for the project of this group
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
            JOIN Projects p_details ON p_details.group_id = gm.group_id -- Get project_id via group_id
            JOIN Sprints s ON s.project_id = p_details.project_id -- Link sprints to that project_id
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
            avatar: member.avatar || 'https://i.pravatar.cc/150?img=1', // Default avatar
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
        const groupIdNum = parseInt(groupId, 10);
        if (isNaN(groupIdNum)) {
            throw new Error('Invalid groupId');
        }

        const [groupCheck] = await pool.query('SELECT 1 FROM `Groups` WHERE group_id = ?', [groupIdNum]);
        if (groupCheck.length === 0) {
            throw new Error(`Group with ID ${groupId} not found`);
        }

        // Fetch all individual reviews with their detailed scores
        const [reviews] = await pool.query(`
            SELECT 
                u_assessee.username AS assessee_name,
                u_assessor.username AS reviewer_name,
                pa.note AS comment,
                pa.deadline_score,
                pa.friendly_score,
                pa.quality_score,
                pa.team_support_score,
                pa.responsibility_score,
                (COALESCE(pa.deadline_score, 0) + 
                 COALESCE(pa.friendly_score, 0) + 
                 COALESCE(pa.quality_score, 0) + 
                 COALESCE(pa.team_support_score, 0) + 
                 COALESCE(pa.responsibility_score, 0)) / 5.0 AS review_average_score
            FROM PeerAssessments pa
            JOIN Users u_assessee ON pa.assessee_id = u_assessee.user_id
            JOIN Users u_assessor ON pa.assessor_id = u_assessor.user_id
            WHERE pa.group_id = ?
            ORDER BY assessee_name, reviewer_name
        `, [groupIdNum]);

        const peerReviewData = [];
        if (reviews.length > 0) {
            const membersMap = new Map();

            for (const review of reviews) {
                if (!membersMap.has(review.assessee_name)) {
                    membersMap.set(review.assessee_name, { totalReviewScoreSum: 0, reviewCount: 0, details: [] });
                }
                const memberData = membersMap.get(review.assessee_name);

                const reviewAvg = review.review_average_score ? Number(Number(review.review_average_score).toFixed(1)) : 0;

                memberData.totalReviewScoreSum += reviewAvg;
                memberData.reviewCount++;
                memberData.details.push({
                    reviewer: review.reviewer_name,
                    overallReviewScore: reviewAvg,
                    comment: review.comment || null, // Keep null if no comment
                    scores: {
                        deadline: review.deadline_score === null ? 0 : review.deadline_score,
                        friendly: review.friendly_score === null ? 0 : review.friendly_score,
                        quality: review.quality_score === null ? 0 : review.quality_score,
                        teamSupport: review.team_support_score === null ? 0 : review.team_support_score,
                        responsibility: review.responsibility_score === null ? 0 : review.responsibility_score,
                    }
                });
            }

            for (const [name, data] of membersMap) {
                const finalAvgScore = data.reviewCount > 0 ? data.totalReviewScoreSum / data.reviewCount : 0;
                peerReviewData.push({
                    name: name,
                    score: Number(finalAvgScore.toFixed(1)),
                    details: data.details
                });
            }
        }
        return peerReviewData;
    } catch (error) {
        console.error(`Error fetching peer assessments for group ${groupId}:`, error.message, error.stack);
        throw error;
    }
}


export { getGroups, getMembersByGroupId, getPeerAssessments };