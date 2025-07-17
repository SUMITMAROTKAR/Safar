const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// User Schema (same as in server.js)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profile: {
    name: String,
    phone: String,
    address: String,
    about: String,
    photo: String,
    country: String,
    state: String
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'sam.marotkar' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('7758892030', 10);
    const adminUser = new User({
      username: 'sam.marotkar',
      email: 'admin@travelbooking.com',
      password: hashedPassword,
      role: 'admin',
      profile: {
        name: 'Sam Marotkar',
        email: 'admin@travelbooking.com',
        phone: '+91 7758892030',
        about: 'System Administrator',
        country: 'India',
        state: 'Maharashtra'
      }
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Username: sam.marotkar');
    console.log('Password: 7758892030');

  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

setupAdmin(); 