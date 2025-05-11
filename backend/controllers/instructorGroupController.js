const { getGroupsByInstructorId } = require('../models/instructorGroupModel');

const getInstructorGroups = async (req, res) => {
  const instructorId = parseInt(req.query.instructor_id, 10);

  if (isNaN(instructorId) || instructorId <= 0) {
    return res.status(400).json({ error: 'instructor_id phải là một số nguyên dương' });
  }

  try {
    console.log(`Yêu cầu lấy nhóm cho instructor_id: ${instructorId}`);
    const groups = await getGroupsByInstructorId(instructorId);
    res.status(200).json(groups);
  } catch (error) {
    console.error('Lỗi trong getInstructorGroups:', error.message, error.stack);
    res.status(500).json({ error: `Lỗi server: ${error.message}` });
  }
};

module.exports = { getInstructorGroups };