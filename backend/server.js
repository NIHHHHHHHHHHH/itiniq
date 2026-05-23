
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/error.middleware.js';

dotenv.config({ 
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' 
});


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 100,
  message: { success: false, data: null, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' }, message: 'Server is running' });
});


app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, data: null, message: `Route ${req.originalUrl} not found` });
});


app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    data: null,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;