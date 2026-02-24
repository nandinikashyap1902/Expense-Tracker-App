const User = require('../models/User');

// ─── GET /api/profile ────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // never return password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ income: user.income, email: user.email });
    } catch (err) {
        next(err);
    }
};

// ─── PUT /api/profile ────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
    try {
        const { income } = req.body;

        if (income === undefined || isNaN(income) || Number(income) < 0) {
            return res.status(400).json({ error: 'A valid income amount is required' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { income: Number(income) },
            { new: true, select: '-password' }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ income: user.income, email: user.email });
    } catch (err) {
        next(err);
    }
};

module.exports = { getProfile, updateProfile };
