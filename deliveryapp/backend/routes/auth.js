const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');
const authController = require('../controllers/authController');


// Existing routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

// New forgot password routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


module.exports = router;
