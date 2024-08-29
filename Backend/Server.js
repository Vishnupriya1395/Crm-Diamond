const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const formRoutes = require('./routes/formRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/formRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); // Use the CORS middleware with options
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
app.use('/api/customer', customerRoutes); // Moved after app initialization
app.use('/api/payment', paymentRoutes); // Moved after app initialization

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
