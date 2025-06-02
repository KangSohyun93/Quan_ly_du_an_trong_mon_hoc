const express = require('express');
const router = express.Router();
const commitController = require('../controllers/githubController'); // Import controller mới

// GET commits cho một project
router.get('/:projectId/commits', commitController.getProjectCommits);

// GET tóm tắt LOC cho một project
router.get('/:projectId/loc_summary', commitController.getProjectLOCSummary);

// POST để làm mới (refresh) commits từ GitHub cho một project
router.post('/:projectId/commits/refresh', commitController.refreshProjectCommits);

module.exports = router;