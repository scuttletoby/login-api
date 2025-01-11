const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const winston = require('winston');

// Setup logger for failed login attempts
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'login-failures.log' }),
    ],
});

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = users.find(u => u.username.toLowerCase() === normalizedEmail);
    if (!user) {
        logger.info(`Failed login attempt for email: ${email}`);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        logger.info(`Failed login attempt for email: ${email}`);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    // Send token as a cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
        sameSite: 'Strict', // CSRF protection
        maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: 'Login successful' });
};
