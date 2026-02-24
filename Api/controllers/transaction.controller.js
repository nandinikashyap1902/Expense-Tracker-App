const Transaction = require('../models/Transaction');

// ─── GET /api/transactions?page=1&limit=10 ───────────────────────────────────
const getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50; // default 50 for dashboard
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            Transaction.find({ author: req.user.id })
                .sort({ datetime: -1 })  // newest first
                .skip(skip)
                .limit(limit),
            Transaction.countDocuments({ author: req.user.id })
        ]);

        res.json({
            transactions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total
            }
        });
    } catch (err) {
        next(err);
    }
};

// ─── GET /api/transaction/:id ────────────────────────────────────────────────
const getById = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        // Ownership check
        if (transaction.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(transaction);
    } catch (err) {
        next(err);
    }
};

// ─── POST /api/transaction ───────────────────────────────────────────────────
const create = async (req, res, next) => {
    try {
        const { amount, type, datetime, category, description } = req.body;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ error: 'A valid positive amount is required' });
        }
        if (!type || !['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Type must be "income" or "expense"' });
        }
        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        const transaction = await Transaction.create({
            amount: parseFloat(amount),
            type,
            datetime: datetime ? new Date(datetime) : new Date(),
            category,
            description: description || '',
            author: req.user.id   // ✅ From authMiddleware — no manual JWT decode needed
        });

        res.status(201).json(transaction);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
};

// ─── PUT /api/transaction/:id ─────────────────────────────────────────────
const update = async (req, res, next) => {
    try {
        const { amount, type, datetime, category, description } = req.body;
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        if (transaction.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not the owner of this transaction' });
        }

        transaction.amount = parseFloat(amount);
        transaction.type = type;
        transaction.datetime = new Date(datetime);
        transaction.category = category;
        transaction.description = description || '';

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        next(err);
    }
};

// ─── DELETE /api/transaction/:id ─────────────────────────────────────────────
const remove = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        if (transaction.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You cannot delete this transaction.' });
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

// ─── GET /api/analytics ──────────────────────────────────────────────────────
// MongoDB aggregation — shows spending by category for a given month
const getAnalytics = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59); // last day of month

        const [categoryBreakdown, monthlySummary] = await Promise.all([
            // Category-wise spending breakdown
            Transaction.aggregate([
                {
                    $match: {
                        author: req.user._id,
                        type: 'expense',
                        datetime: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { total: -1 } }
            ]),
            // Monthly income vs expense for last 6 months
            Transaction.aggregate([
                {
                    $match: {
                        author: req.user._id,
                        datetime: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$datetime' },
                            month: { $month: '$datetime' },
                            type: '$type'
                        },
                        total: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        ]);

        res.json({ categoryBreakdown, monthlySummary, month, year });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getById, create, update, remove, getAnalytics };
