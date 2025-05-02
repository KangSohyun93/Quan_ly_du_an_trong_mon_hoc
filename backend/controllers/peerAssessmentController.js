const { getGroupMembersByProjectId, getPeerAssessmentsByAssessor, savePeerAssessment, getTaskStatsByProjectId, getMemberTaskStatsByProjectId } = require('../models/peerAssessmentModel');

const getGroupMembers = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  console.log(`Nhận yêu cầu getGroupMembers với projectId: ${projectId}`);
  if (isNaN(projectId) || projectId <= 0) {
    return res.status(400).json({ error: 'projectId phải là một số nguyên dương' });
  }
  try {
    const members = await getGroupMembersByProjectId(projectId);
    console.log('Trả về danh sách thành viên:', members);
    res.status(200).json(members);
  } catch (error) {
    console.error('Lỗi trong getGroupMembers:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
};

const getPeerAssessments = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const assessorId = parseInt(req.params.assessorId, 10);
  console.log(`Nhận yêu cầu getPeerAssessments với projectId: ${projectId}, assessorId: ${assessorId}`);
  if (isNaN(projectId) || projectId <= 0 || isNaN(assessorId) || assessorId <= 0) {
    return res.status(400).json({ error: 'projectId và assessorId phải là số nguyên dương' });
  }
  try {
    const assessments = await getPeerAssessmentsByAssessor(projectId, assessorId);
    console.log('Trả về danh sách đánh giá:', assessments);
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Lỗi trong getPeerAssessments:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
};

const saveAssessment = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const assessmentData = { ...req.body, projectId };
  console.log(`Nhận yêu cầu saveAssessment với projectId: ${projectId}, dữ liệu:`, assessmentData);
  try {
    const result = await savePeerAssessment(assessmentData);
    console.log('Lưu đánh giá thành công:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi trong saveAssessment:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
};

const getTaskStats = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  console.log(`Nhận yêu cầu getTaskStats với projectId: ${projectId}`);
  if (isNaN(projectId) || projectId <= 0) {
    return res.status(400).json({ error: 'projectId phải là một số nguyên dương' });
  }
  try {
    const stats = await getTaskStatsByProjectId(projectId);
    console.log('Trả về thống kê task:', stats);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Lỗi trong getTaskStats:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
};

const getMemberTaskStats = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  console.log(`Nhận yêu cầu getMemberTaskStats với projectId: ${projectId}`);
  if (isNaN(projectId) || projectId <= 0) {
    return res.status(400).json({ error: 'projectId phải là một số nguyên dương' });
  }
  try {
    const stats = await getMemberTaskStatsByProjectId(projectId);
    console.log('Trả về thống kê task của thành viên:', stats);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Lỗi trong getMemberTaskStats:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
};

module.exports = { getGroupMembers, getPeerAssessments, saveAssessment, getTaskStats, getMemberTaskStats };