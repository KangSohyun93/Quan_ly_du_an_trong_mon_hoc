const express = require('express');
const router = express.Router();
const configurationsController = require('../controllers/configurationsController');
const verifyToken = require('../middleware/verify-token');

router.get('/', verifyToken, configurationsController.getConfigurations);
router.post('/', verifyToken, configurationsController.saveConfiguration);

module.exports = router;