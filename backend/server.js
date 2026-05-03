require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// In a real EC2/S3 scenario, you would limit CORS to your S3 bucket endpoint
// e.g., app.use(cors({ origin: 'http://your-s3-bucket-url.com' }));
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ideavault')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
const ideasRouter = require('./routes/ideas');
app.use('/api/ideas', ideasRouter);

// Basic health check route for EC2 load balancers/verification
app.get('/health', (req, res) => {
  res.status(200).send('Backend is running!');
});

// --- SERVE FRONTEND (Simplest Method) ---
const path = require('path');

// 1. Tell Express to serve the static files from the React build folder (frontend/dist)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 2. Any request that DOES NOT match an API route (/api/*) will be sent the React app's index.html
// This allows React Router to handle page navigation without 404 errors.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend Server started on port- ${PORT}`);
    console.log(`Frontend is being served at - http://localhost:${PORT}`);
  });
}

module.exports = app;