const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { chat } = require('../controllers/chat.controller');

router.post('/chat', authMiddleware, chat);

module.exports = router;
