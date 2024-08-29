const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'guest'], default: 'guest' }
});

// Check if the model is already defined
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
