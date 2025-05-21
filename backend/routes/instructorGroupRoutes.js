// instructorGroupRoutes.js
const express = require('express');
const router = express.Router();
const { getInstructorGroups, getGroupsInClass, getMembersInClass } = require('../controllers/instructorGroupController');

router.get('/', getInstructorGroups);
router.get('/classes/:classId/groups', getGroupsInClass);
router.get('/classes/:classId/members', getMembersInClass);

module.exports = router;