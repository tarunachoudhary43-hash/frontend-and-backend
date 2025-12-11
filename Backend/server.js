// server.js - MERN backend setup

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Load .env explicitly

console.log('Loaded MONGO_URI:', process.env.MONGO_URI); // Debug: should print your Mongo URI

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// ---------------------------
// CORRECTED CORS CONFIG
// ---------------------------
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://frontend-and-backend-1-2t7r.onrender.com"   // <-- your frontend URL
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth')); // Auth routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
