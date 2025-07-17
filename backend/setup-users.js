const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: false },
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

const setupUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const adminPassword = await bcrypt.hash('7758892030', 10);
    const adminUser = new User({
      username: 'sam.marotkar',
      email: 'admin@travelbooking.com',
      password: adminPassword,
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

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = new User({
      username: 'testuser',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      profile: {
        name: 'Test User',
        email: 'user@example.com',
        phone: '+91 9876543210',
        about: 'Regular user account',
        country: 'India',
        state: 'Maharashtra'
      }
    });

    // Check if users already exist
    const existingAdmin = await User.findOne({ username: 'sam.marotkar' });
    const existingUser = await User.findOne({ username: 'testuser' });

    if (!existingAdmin) {
      await adminUser.save();
      console.log('✅ Admin user created: sam.marotkar / 7758892030');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    if (!existingUser) {
      await regularUser.save();
      console.log('✅ Regular user created: testuser / user123');
    } else {
      console.log('ℹ️ Regular user already exists');
    }

    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin Account:');
    console.log('   Username: sam.marotkar');
    console.log('   Password: 7758892030');
    console.log('   Role: admin');
    console.log('');
    console.log('👤 Regular User Account:');
    console.log('   Username: testuser');
    console.log('   Password: user123');
    console.log('   Role: user');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    mongoose.connection.close();
    console.log('\n✅ Setup completed successfully!');
  } catch (error) {
    console.error('❌ Setup error:', error);
    process.exit(1);
  }
};

setupUsers(); 