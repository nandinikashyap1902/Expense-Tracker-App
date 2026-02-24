const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
    getAll, getById, create, update, remove, getAnalytics
} = require('../controllers/transaction.controller');

// All transaction routes require authentication
router.use(authMiddleware);

router.get('/transactions', getAll);            // GET with pagination
router.get('/analytics', getAnalytics);         // GET analytics (MongoDB aggregation)
router.get('/transaction/:id', getById);        // GET single
router.post('/transaction', create);            // POST create
router.put('/transaction/:id', update);         // PUT update (id in params now ✅)
router.delete('/transaction/:id', remove);      // DELETE

module.exports = router;
