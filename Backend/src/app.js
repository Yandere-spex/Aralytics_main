const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000', // Your React app URL
    credentials: true
}));
app.use(mongoSanitize());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later'
    });
    app.use('/api', limiter);

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    app.use('/api/auth', require('./routes/authRoutes'));

    app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
    });

    app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use(errorHandler);

module.exports = app;