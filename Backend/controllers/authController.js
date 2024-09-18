const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

        console.log('Entered Password:', password);
        console.log('Decrytion (Password Match):', isMatch);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET, // Ensure you have this set in your environment
            { expiresIn: '1h' }
        );

        // Optionally, send the JWT or session information here
        res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
