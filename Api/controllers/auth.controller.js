const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── POST /api/signup ────────────────────────────────────────────────────────
const signup = async (req, res, next) => {
    const { email, password, income } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'An account with this email already exists. Please sign in.'
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const userDoc = await User.create({
            email,
            password: hashedPassword,
            income: Number(income)
        });

        res.status(201).json({
            message: 'Account created successfully',
            user: { id: userDoc._id, email: userDoc.email, income: userDoc.income }
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: err.errors });
        }
        next(err);
    }
};

// ─── POST /api/signin ────────────────────────────────────────────────────────
const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '7d' }  // ✅ Extended from 1h → 7d for better UX
        );

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in ms
        });

        res.json({ id: user._id, email: user.email, income: user.income });
    } catch (err) {
        next(err);
    }
};

// ─── POST /api/logout ────────────────────────────────────────────────────────
const logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { signup, signin, logout };
