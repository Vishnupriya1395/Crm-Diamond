// controllers/authController.js

const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Adjust the path if necessary

// Login Controller
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Log the stored hashed password (for debugging purposes only)
        console.log('Stored Hashed Password:', user.password);

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Optionally, generate and send a JWT or session information here
        res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.role } });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      // Create a JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        'your_secret_key', // Replace with your secret key
        { expiresIn: '1h' }
      );
  
      res.json({ message: 'Login successful', token, user });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
