const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, requireAdmin, reportController.getReports);

module.exports = router;
