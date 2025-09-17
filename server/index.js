const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./auth');

const app = express();
app.use(bodyParser.json());

// Serve static files from /dist (built frontend) in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  // In development, serve static files from /public
  app.use(express.static(path.join(__dirname, '../public')));
}

// API routes
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
