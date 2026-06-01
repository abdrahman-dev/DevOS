import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './model/mongodb.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { env } from './config/env.js';

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js';
import friendRoutes from './routes/friendRoutes.js';

import errorHandler from './middleware/errorHandler.js';


const app = express();
const port = env.PORT;

// Middleware setup for JSON parsing, CORS with frontend, and cookie handling
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL whatever it is 
  credentials: true               
}));
app.use(cookieParser());

app.use(globalLimiter);
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/friends', friendRoutes);

// Global error handling middleware
app.use(errorHandler);

// Establish connection to MongoDB database
try {
    connectDB();
} catch (error) {
    console.error('Failed to connect to MongoDB:', error);
}

// Start the Express server on specified port
app.listen(port, () => {
    console.log(`Running on PORT:${port}`);
});