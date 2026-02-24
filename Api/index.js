require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler.middleware');

// ─── Route imports ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const profileRoutes = require('./routes/profile.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Reads from env — required for Render/Railway

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'https://expense-tracker-app-alpha-ebon.vercel.app',
    'http://localhost:5173',
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// ─── Core middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── Database ─────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1); // Exit if DB fails — don't run a broken server
    });

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/test', (req, res) => res.json({ status: 'ok', message: 'Server is running' }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api', transactionRoutes);
app.use('/api', profileRoutes);
app.use('/api', chatRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ─── Centralized error handler (must be last) ─────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
