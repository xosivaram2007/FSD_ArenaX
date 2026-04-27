const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes setup (to be filled later)
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running...' });
});

// Import routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/standings', require('./routes/standingRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
