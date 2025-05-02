const { getGroupsByUserId } = require('../models/groupModel');

const getGroups = async (req, res) => {
  const userId = parseInt(req.query.user_id, 10);

  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'user_id phải là một số nguyên dương' });
  }

  try {
    console.log(`Yêu cầu lấy nhóm cho user_id: ${userId}`);
    const groups = await getGroupsByUserId(userId);
    res.status(200).json(groups);
  } catch (error) {
    console.error('Lỗi trong getGroups:', error.message, error.stack);
    res.status(500).json({ error: `Lỗi server: ${error.message}` });
  }
};

module.exports = { getGroups };