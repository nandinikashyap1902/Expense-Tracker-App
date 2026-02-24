const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please sign in again.' });
        }
        return res.status(401).json({ message: 'Token is invalid.' });
    }
}

module.exports = authMiddleware;
