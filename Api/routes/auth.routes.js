const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { signup, signin, logout } = require('../controllers/auth.controller');

// Limit login attempts: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limit signups: 3 per hour per IP to prevent spam
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { error: 'Too many signup attempts. Please try again later.' },
});

router.post('/signup', signupLimiter, signup);
router.post('/signin', loginLimiter, signin);
router.post('/logout', logout);

module.exports = router;
