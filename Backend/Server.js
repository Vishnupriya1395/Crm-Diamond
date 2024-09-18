const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');  // Import path module
const formRoutes = require('./routes/formRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/forms');
const paymentRoutes = require('./routes/paymentRoutes');
const documentationRoutes = require('./routes/documentationRoutes');
require('dotenv').config();


// Initialize express app
const app = express();

// CORS configuration
const corsOption= {
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors({origin:'http://localhost:3000', credentials:true})); // Use the CORS middleware with options
app.use(express.json());
app.use(cookieParser()); // Use the cookieParser middleware

app.get('/test', (req, res) => {
  res.send('Test endpoint is working');
});

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.use('/api/forms', formRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/documentation', documentationRoutes);

// Serve static files from the React app (build folder)
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the above routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create an HTTP server
const server = http.createServer(app);

// Setup WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send('Welcome to the WebSocket server!');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
