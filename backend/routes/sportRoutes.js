const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', sportController.getSports);
router.post('/', authenticate, requireAdmin, sportController.createSport);

module.exports = router;
