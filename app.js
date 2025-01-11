const express = require('express');
const authRoutes = require('./routes/auth');
const https = require('https');
const fs = require('fs');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

const options = {
    key: fs.readFileSync('./certificates/key.pem'),
    cert: fs.readFileSync('./certificates/certificate.pem'),
}


const app = express();


// Middleware
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies


// Rate Limiting for API routes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});
app.use(globalLimiter);

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Start the server
https.createServer(options, app).listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`));

