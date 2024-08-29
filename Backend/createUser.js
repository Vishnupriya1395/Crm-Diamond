const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Replace the below URI with your actual MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/DiamondCrown';
// OR
// const mongoURI = 'mongodb+srv://your_username:your_password@cluster.mongodb.net/your_database_name';

// Connecting to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Define a User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'guest'], required: true }
});

// Pre-save middleware to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Create a User model
const User = mongoose.model('User', userSchema);

// Create an Admin user
const createAdminUser = async () => {
  try {
    const admin = new User({
      username: 'Diamond@123',  // replace with your desired admin username
      password: 'Sanny@123',  // replace with your desired admin password
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

// Create a Guest user
const createGuestUser = async () => {
  try {
    const guest = new User({
      username: 'Diamond@2024',  // replace with your desired guest username
      password: 'Crown@123',  // replace with your desired guest password
      role: 'guest'
    });
    await guest.save();
    console.log('Guest user created');
  } catch (err) {
    console.error('Error creating guest user:', err);
  }
};

// Run the functions to create users
createAdminUser();
createGuestUser();
