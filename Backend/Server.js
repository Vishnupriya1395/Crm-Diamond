const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const path = require('path'); 
const fs = require('fs'); // Import path module
const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const documentationRoutes = require('./routes/documentationRoutes');
const app = express();
require('dotenv').config();




const corsOption = {
  origin: ['http://localhost:3000', 'http://diamondcrown.org'], // List allowed domains
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};



// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(cors(corsOption)); // Use the CORS middleware with options
app.use(express.json());
app.use(cookieParser()); // Use the cookieParser middleware
app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Define routes
app.use('/api/documentation', documentationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/auth', authRoutes);



app.get('/test', (req, res) => {
  res.send('Test endpoint is working');
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  fs.readFile(sitemapPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error loading sitemap');
    }
    res.header('Content-Type', 'application/xml');
    res.send(data);
  });
});

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
