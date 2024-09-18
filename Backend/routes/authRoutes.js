const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controllers/authController');

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', {username,password});

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    console.log('User found:', user);
    if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password comparision:', {plainPassword: password, hashedPassword: user.password, isMatch});
    // Log the decrypted password for verification
    console.log('Decrypted Password:', user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({id:user._id, role: user.role}, process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    });

    // If the password matches, send a success response
    
    res.status(200).json({ token, user: {id:user._id, username: user.username, role: user.role} });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;