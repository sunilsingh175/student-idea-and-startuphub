const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Ensure DB is connected before processing API requests (essential for Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error in request:', err);
    return res.status(500).json({
      msg: 'Database connection failed. Please check MongoDB Atlas Network Access allows 0.0.0.0/0.',
      error: err.message,
    });
  }
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ideas', require('./routes/ideaRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;