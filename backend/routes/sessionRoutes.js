const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticate } = require('../middleware/auth');

router.get('/my', authenticate, sessionController.getMySessions);
router.get('/', sessionController.getSessions);
router.get('/:id', sessionController.getSessionById);
router.post('/', authenticate, sessionController.createSession);
router.post('/:id/join', authenticate, sessionController.joinSession);
router.patch('/:id/cancel', authenticate, sessionController.cancelSession);

module.exports = router;
