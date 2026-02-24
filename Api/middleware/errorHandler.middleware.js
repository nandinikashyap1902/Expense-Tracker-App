/**
 * Centralized error handler middleware.
 * Always add this as the LAST app.use() in index.js
 */
const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Only log stack traces in development
    if (process.env.NODE_ENV !== 'production') {
        console.error(`[ERROR] ${req.method} ${req.url} →`, err.message);
    }

    res.status(status).json({ error: message });
};

// Helper to create structured errors with a status code
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = { errorHandler, AppError };
