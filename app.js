const express = require('express');
const app = express();

const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rankRoutes = require('./routes/rankRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 200
	})
);
app.use(hpp());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/rank', rankRoutes);

module.exports = { app };
