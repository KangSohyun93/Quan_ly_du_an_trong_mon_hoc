module.exports = (req, res, next) => {
  req.user = { id: 1, role: 'Instructor' };
  req.userId = 1;
  req.isTeamLead = true;
  next();
};