
const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, data: null, message: `${field} already in use` });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, data: null, message });
  }

// JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, data: null, message: 'Invalid token' });
  }

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    data: null,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

export default errorHandler;