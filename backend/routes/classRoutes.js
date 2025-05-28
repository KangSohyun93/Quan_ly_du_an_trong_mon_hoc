const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const verifyToken = require('../middleware/verify-token');

router.post('/', verifyToken, classController.createClass);
router.put('/:classId', verifyToken, classController.updateClass);
router.get('/', verifyToken, classController.getClasses);
router.delete('/:classId', verifyToken, classController.deleteClass);
router.post('/import/:id', verifyToken, classController.importClass);
router.post('/join', verifyToken, classController.joinClass);
router.get('/search', verifyToken, classController.searchClass);

module.exports = router;