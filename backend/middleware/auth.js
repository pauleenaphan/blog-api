const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
        
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        console.log("token ", token);
        console.log("secret key: ", process.env.SECRET_KEY);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' }); // 403 for Forbidden, as token is invalid
    }
};

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden: Only admins can perform this action');
    }
    next();
};

module.exports = {
    authenticateJWT,
    checkAdmin,
};
