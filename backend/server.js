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

// Healthcheck route
app.get(['/api/health', '/health', '/api', '/'], (req, res) => {
  res.json({ status: 'ok', service: 'student-startup-hub-backend' });
});

// Define Routes (mount under both '/api/...' and '/...' to support all proxy/rewrite setups)
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/ideas', ideaRoutes);
app.use('/ideas', ideaRoutes);

app.use('/api/chat', chatRoutes);
app.use('/chat', chatRoutes);

app.use('/api/messages', messageRoutes);
app.use('/messages', messageRoutes);

app.use('/api/contact', contactRoutes);
app.use('/contact', contactRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;