// backend/routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { submitFeedback } = require('../controllers/feedbackController');

// POST /api/feedback - Submit complaint/feedback
router.post('/', verifyToken, submitFeedback);

module.exports = router;
