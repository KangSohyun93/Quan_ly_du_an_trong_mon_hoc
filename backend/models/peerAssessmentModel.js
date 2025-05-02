const pool = require('../config/db');

const getGroupMembersByProjectId = async (projectId) => {
  try {
    console.log(`Truy vấn thành viên cho projectId: ${projectId}`);
    const [rows] = await pool.query(
      `
      SELECT 
        u.user_id,
        u.username,
        u.avatar
      FROM Projects p
      JOIN Groups g ON p.group_id = g.group_id
      JOIN GroupMembers gm ON g.group_id = gm.group_id
      JOIN Users u ON gm.user_id = u.user_id
      WHERE p.project_id = ? AND (u.role = 'Student' OR u.role IS NULL);
      `,
      [projectId]
    );
    if (rows.length === 0) {
      console.warn(`Không tìm thấy thành viên cho projectId: ${projectId}`);
    }
    console.log('Kết quả truy vấn getGroupMembersByProjectId:', rows);
    return rows;
  } catch (error) {
    console.error('Lỗi trong getGroupMembersByProjectId:', error.message, error.stack);
    throw new Error('Lỗi khi lấy danh sách thành viên: ' + error.message);
  }
};

const getPeerAssessmentsByAssessor = async (projectId, assessorId) => {
  try {
    console.log(`Truy vấn đánh giá cho projectId: ${projectId}, assessorId: ${assessorId}`);
    const [rows] = await pool.query(
      `
      SELECT 
        pa.assessee_id,
        pa.deadline_score,
        pa.friendly_score,
        pa.quality_score,
        pa.team_support_score,
        pa.responsibility_score,
        pa.note
      FROM PeerAssessments pa
      JOIN Projects p ON pa.group_id = p.group_id
      WHERE p.project_id = ? AND pa.assessor_id = ?;
      `,
      [projectId, assessorId]
    );
    if (rows.length === 0) {
      console.warn(`Không tìm thấy đánh giá cho projectId: ${projectId}, assessorId: ${assessorId}`);
    }
    console.log('Kết quả truy vấn getPeerAssessmentsByAssessor:', rows);
    return rows;
  } catch (error) {
    console.error('Lỗi trong getPeerAssessmentsByAssessor:', error.message, error.stack);
    throw new Error('Lỗi khi lấy đánh giá: ' + error.message);
  }
};

const savePeerAssessment = async (assessmentData) => {
  try {
    const { projectId, assessorId, assesseeId, deadlineScore, friendlyScore, qualityScore, teamSupportScore, responsibilityScore, note } = assessmentData;
    console.log(`Lưu đánh giá cho projectId: ${projectId}, assessorId: ${assessorId}, assesseeId: ${assesseeId}`);
    const [groupRows] = await pool.query(
      `SELECT group_id FROM Projects WHERE project_id = ?`,
      [projectId]
    );
    if (groupRows.length === 0) {
      throw new Error('Không tìm thấy nhóm cho dự án này');
    }
    const groupId = groupRows[0].group_id;

    await pool.query(
      `
      INSERT INTO PeerAssessments (group_id, assessor_id, assessee_id, deadline_score, friendly_score, quality_score, team_support_score, responsibility_score, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        deadline_score = VALUES(deadline_score),
        friendly_score = VALUES(friendly_score),
        quality_score = VALUES(quality_score),
        team_support_score = VALUES(team_support_score),
        responsibility_score = VALUES(responsibility_score),
        note = VALUES(note);
      `,
      [groupId, assessorId, assesseeId, deadlineScore, friendlyScore, qualityScore, teamSupportScore, responsibilityScore, note || '']
    );
    console.log('Lưu đánh giá thành công');
    return { success: true };
  } catch (error) {
    console.error('Lỗi trong savePeerAssessment:', error.message, error.stack);
    throw new Error('Lỗi khi lưu đánh giá: ' + error.message);
  }
};

const getMemberTaskStatsByProjectId = async (projectId) => {
  try {
    console.log(`Truy vấn thống kê task của thành viên cho projectId: ${projectId}`);
    
    // Lấy danh sách thành viên của project
    const [members] = await pool.query(
      `
      SELECT 
        u.user_id
      FROM Projects p
      JOIN Groups g ON p.group_id = g.group_id
      JOIN GroupMembers gm ON g.group_id = gm.group_id
      JOIN Users u ON gm.user_id = u.user_id
      WHERE p.project_id = ? AND (u.role = 'Student' OR u.role IS NULL);
      `,
      [projectId]
    );

    const memberStats = {};
    
    // Với mỗi thành viên, đếm tổng số task, số task completed và số task trễ hạn
    for (const member of members) {
      const userId = member.user_id;

      // Đếm tổng số task được giao
      const [totalStats] = await pool.query(
        `
        SELECT 
          COUNT(*) AS totalTasksAssigned
        FROM Tasks t
        JOIN Sprints s ON t.sprint_id = s.sprint_id
        WHERE s.project_id = ?
          AND t.assigned_to = ?;
        `,
        [projectId, userId]
      );

      // Đếm số task completed
      const [completedStats] = await pool.query(
        `
        SELECT 
          COUNT(*) AS tasksCompleted
        FROM Tasks t
        JOIN Sprints s ON t.sprint_id = s.sprint_id
        WHERE s.project_id = ?
          AND t.assigned_to = ?
          AND t.status = 'Completed';
        `,
        [projectId, userId]
      );

      // Đếm số task trễ hạn (dựa trên completed_at hoặc due_date so với ngày hiện tại)
      const [delayedStats] = await pool.query(
        `
        SELECT 
          COUNT(*) AS delayedTasks
        FROM Tasks t
        JOIN Sprints s ON t.sprint_id = s.sprint_id
        WHERE s.project_id = ?
          AND t.assigned_to = ?
          AND (
            (t.status = 'Completed' AND t.completed_at > t.due_date)
            OR (t.status != 'Completed' AND t.due_date < ?)
          );
        `,
        [projectId, userId, '2025-05-02']
      );

      memberStats[userId] = {
        totalTasksAssigned: totalStats[0].totalTasksAssigned || 0,
        tasksCompleted: completedStats[0].tasksCompleted || 0,
        delayedTasks: delayedStats[0].delayedTasks || 0,
      };
    }

    console.log('Kết quả thống kê task của thành viên:', memberStats);
    return memberStats;
  } catch (error) {
    console.error('Lỗi trong getMemberTaskStatsByProjectId:', error.message, error.stack);
    throw new Error('Lỗi khi lấy thống kê task của thành viên: ' + error.message);
  }
};

module.exports = { getGroupMembersByProjectId, getPeerAssessmentsByAssessor, savePeerAssessment, getMemberTaskStatsByProjectId };