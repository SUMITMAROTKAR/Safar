const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage fallback
let inMemoryUsers = [];
let inMemoryEvents = [];
let inMemoryEventRequests = [];

// Try to load admin user from setup
const loadAdminUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash('7758892030', 10);
    const adminUser = {
      _id: 'admin-1',
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
      },
      createdAt: new Date()
    };
    
    // Check if admin already exists
    const existingAdmin = inMemoryUsers.find(u => u.username === 'sam.marotkar');
    if (!existingAdmin) {
      inMemoryUsers.push(adminUser);
      console.log('✅ Admin user loaded in memory');
    }
  } catch (error) {
    console.error('Error loading admin user:', error);
  }
};

// MongoDB Connection with fallback
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Using in-memory storage as fallback');
    console.log('🔗 For persistent storage, install MongoDB or use MongoDB Atlas');
    
    // Load admin user in memory
    await loadAdminUser();
    return false;
  }
};

let useMongoDB = false;
connectDB().then(connected => {
  useMongoDB = connected;
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: false },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'guide', 'admin'], default: 'user' },
  profile: {
    name: String,
    phone: String,
    address: String,
    about: String,
    photo: String,
    country: String,
    state: String
  },
  guideProfile: {
    experience: String,
    achievements: String,
    completedTreks: Number,
    ratings: Number,
    contact: String
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Guide Request Schema
const guideRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  decisionAt: { type: Date }
});
const GuideRequest = mongoose.model('GuideRequest', guideRequestSchema);
let inMemoryGuideRequests = [];

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  placeName: { type: String },
  description: { type: String, required: true },
  nearAttractions: { type: String },
  thingsToCarry: { type: String },
  pickupPoints: [{ type: String }],
  meetupTime: { type: String },
  pickupTime: { type: String },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  duration: { type: String, required: true },
  difficulty: { type: String, required: true },
  groupSize: { type: Number, required: true },
  bannerImage: { type: String },
  cardImage: { type: String },
  image: { type: String }, // legacy
  rating: { type: Number, default: 4.5 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
const Event = mongoose.model('Event', eventSchema);

// Event Request Schema
const eventRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  guide: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  duration: { type: String, required: true },
  difficulty: { type: String, required: true },
  groupSize: { type: Number, required: true },
  image: { type: String, required: false },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const EventRequest = mongoose.model('EventRequest', eventRequestSchema);

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    storage: useMongoDB ? 'MongoDB' : 'In-Memory',
    timestamp: new Date().toISOString()
  });
});

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email = '', role = 'user' } = req.body;

    if (useMongoDB) {
      // MongoDB logic
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // In-memory logic
      const existingUser = inMemoryUsers.find(u => u.username === username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `user-${Date.now()}`,
        username,
        email,
        password: hashedPassword,
        role,
        profile: {},
        createdAt: new Date()
      };

      inMemoryUsers.push(newUser);

      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt for username:', username);

    if (useMongoDB) {
      // MongoDB logic
      const user = await User.findOne({ username });
      if (!user) {
        console.log('User not found:', username);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log('Invalid password for user:', username);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('Login successful for user:', username);

      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    } else {
      // In-memory logic
      const user = inMemoryUsers.find(u => u.username === username);
      if (!user) {
        console.log('User not found:', username);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log('Invalid password for user:', username);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('Login successful for user:', username);

      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    if (useMongoDB) {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } else {
      const user = inMemoryUsers.find(u => u._id === req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, about, photo, country, state } = req.body;
    
    if (useMongoDB) {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.profile = {
        name: name || user.profile?.name,
        email: email || user.profile?.email,
        phone: phone || user.profile?.phone,
        address: address || user.profile?.address,
        about: about || user.profile?.about,
        photo: photo || user.profile?.photo,
        country: country || user.profile?.country,
        state: state || user.profile?.state
      };

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        profile: user.profile
      });
    } else {
      const userIndex = inMemoryUsers.findIndex(u => u._id === req.user.userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      inMemoryUsers[userIndex].profile = {
        name: name || inMemoryUsers[userIndex].profile?.name,
        email: email || inMemoryUsers[userIndex].profile?.email,
        phone: phone || inMemoryUsers[userIndex].profile?.phone,
        address: address || inMemoryUsers[userIndex].profile?.address,
        about: about || inMemoryUsers[userIndex].profile?.about,
        photo: photo || inMemoryUsers[userIndex].profile?.photo,
        country: country || inMemoryUsers[userIndex].profile?.country,
        state: state || inMemoryUsers[userIndex].profile?.state
      };

      res.json({
        message: 'Profile updated successfully',
        profile: inMemoryUsers[userIndex].profile
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const status = req.query.status;
    if (useMongoDB) {
      const query = status ? { status } : {};
      const events = await Event.find(query).populate('createdBy', 'username');
      res.json(events);
    } else {
      const events = status ? inMemoryEvents.filter(e => e.status === status) : inMemoryEvents;
      res.json(events);
    }
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create event (admin only)
app.post('/api/events', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (useMongoDB) {
      const event = new Event({
        ...req.body,
        createdBy: req.user.userId
      });
      await event.save();
      res.status(201).json({ message: 'Event created successfully', event });
    } else {
      const newEvent = {
        _id: `event-${Date.now()}`,
        ...req.body,
        createdBy: req.user.userId,
        createdAt: new Date()
      };
      inMemoryEvents.push(newEvent);
      res.status(201).json({ message: 'Event created successfully', event: newEvent });
    }
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    if (useMongoDB) {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } else {
      const event = inMemoryEvents.find(e => e._id === req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    }
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit event request
app.post('/api/event-requests', authenticateToken, async (req, res) => {
  try {
    if (useMongoDB) {
      const eventRequest = new EventRequest({
        ...req.body,
        requestedBy: req.user.userId
      });
      await eventRequest.save();
      res.status(201).json({ message: 'Event request submitted successfully', eventRequest });
    } else {
      const newRequest = {
        _id: `request-${Date.now()}`,
        ...req.body,
        requestedBy: req.user.userId,
        status: 'Pending',
        createdAt: new Date()
      };
      inMemoryEventRequests.push(newRequest);
      res.status(201).json({ message: 'Event request submitted successfully', eventRequest: newRequest });
    }
  } catch (error) {
    console.error('Submit event request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's event requests
app.get('/api/event-requests', authenticateToken, async (req, res) => {
  try {
    if (useMongoDB) {
      const eventRequests = await EventRequest.find({ requestedBy: req.user.userId })
        .populate('requestedBy', 'username');
      res.json(eventRequests);
    } else {
      const userRequests = inMemoryEventRequests.filter(r => r.requestedBy === req.user.userId);
      res.json(userRequests);
    }
  } catch (error) {
    console.error('Get event requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all event requests (admin only)
app.get('/api/admin/event-requests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (useMongoDB) {
      const eventRequests = await EventRequest.find()
        .populate('requestedBy', 'username');
      res.json(eventRequests);
    } else {
      res.json(inMemoryEventRequests);
    }
  } catch (error) {
    console.error('Get admin event requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject event request (admin only)
app.put('/api/admin/event-requests/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (useMongoDB) {
      const eventRequest = await EventRequest.findById(req.params.id);
      
      if (!eventRequest) {
        return res.status(404).json({ message: 'Event request not found' });
      }

      eventRequest.status = status;
      await eventRequest.save();

      if (status === 'Approved') {
        const event = new Event({
          title: eventRequest.title,
          description: eventRequest.description,
          guide: eventRequest.guide,
          location: eventRequest.location,
          price: eventRequest.price,
          date: eventRequest.date,
          duration: eventRequest.duration,
          difficulty: eventRequest.difficulty,
          groupSize: eventRequest.groupSize,
          image: eventRequest.image,
          createdBy: eventRequest.requestedBy
        });
        await event.save();
      }

      res.json({ message: `Event request ${status.toLowerCase()} successfully`, eventRequest });
    } else {
      const requestIndex = inMemoryEventRequests.findIndex(r => r._id === req.params.id);
      
      if (requestIndex === -1) {
        return res.status(404).json({ message: 'Event request not found' });
      }

      inMemoryEventRequests[requestIndex].status = status;

      if (status === 'Approved') {
        const newEvent = {
          _id: `event-${Date.now()}`,
          title: inMemoryEventRequests[requestIndex].title,
          description: inMemoryEventRequests[requestIndex].description,
          guide: inMemoryEventRequests[requestIndex].guide,
          location: inMemoryEventRequests[requestIndex].location,
          price: inMemoryEventRequests[requestIndex].price,
          date: inMemoryEventRequests[requestIndex].date,
          duration: inMemoryEventRequests[requestIndex].duration,
          difficulty: inMemoryEventRequests[requestIndex].difficulty,
          groupSize: inMemoryEventRequests[requestIndex].groupSize,
          image: inMemoryEventRequests[requestIndex].image,
          createdBy: inMemoryEventRequests[requestIndex].requestedBy,
          createdAt: new Date()
        };
        inMemoryEvents.push(newEvent);
      }

      res.json({ 
        message: `Event request ${status.toLowerCase()} successfully`, 
        eventRequest: inMemoryEventRequests[requestIndex] 
      });
    }
  } catch (error) {
    console.error('Update event request status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (useMongoDB) {
      const users = await User.find().select('-password');
      res.json(users);
    } else {
      const usersWithoutPassword = inMemoryUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPassword);
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Event image upload endpoint
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Profile photo upload endpoint
app.post('/api/upload-profile-photo', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const photoUrl = `/uploads/${req.file.filename}`;
    
    if (useMongoDB) {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      user.profile = user.profile || {};
      user.profile.photo = photoUrl;
      await user.save();
    } else {
      const userIndex = inMemoryUsers.findIndex(u => u._id === req.user.userId);
      if (userIndex !== -1) {
        inMemoryUsers[userIndex].profile = inMemoryUsers[userIndex].profile || {};
        inMemoryUsers[userIndex].profile.photo = photoUrl;
      }
    }
    
    res.json({ 
      message: 'Profile photo updated successfully',
      photoUrl,
      profile: { photo: photoUrl }
    });
  } catch (error) {
    console.error('Profile photo upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// About/Contact Info Schema
const aboutSchema = new mongoose.Schema({
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});
const About = mongoose.model('About', aboutSchema);
let inMemoryAbout = { content: "Explore Beautiful Destinations. Contact: safer.sukoon@example.com | +91-1234567890", updatedAt: new Date() };

// Get About/Contact Info
app.get('/api/about', async (req, res) => {
  try {
    if (useMongoDB) {
      let about = await About.findOne();
      if (!about) {
        about = await About.create(inMemoryAbout);
      }
      res.json(about);
    } else {
      res.json(inMemoryAbout);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update About/Contact Info (admin only)
app.put('/api/about', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });
    if (useMongoDB) {
      let about = await About.findOne();
      if (!about) {
        about = await About.create({ content });
      } else {
        about.content = content;
        about.updatedAt = new Date();
        await about.save();
      }
      res.json(about);
    } else {
      inMemoryAbout = { content, updatedAt: new Date() };
      res.json(inMemoryAbout);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Guide Schema
const guideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
});
const Guide = mongoose.model('Guide', guideSchema);
let inMemoryGuides = [
  { _id: 'g1', name: 'Amit Pawar', email: 'amit@example.com', phone: '+91 98765 43214', experience: '5 years', rating: 4.8, status: 'Active' },
  { _id: 'g2', name: 'Sneha Patil', email: 'sneha@example.com', phone: '+91 98765 43215', experience: '3 years', rating: 4.6, status: 'Active' },
  { _id: 'g3', name: 'Rohit Shinde', email: 'rohit@example.com', phone: '+91 98765 43216', experience: '7 years', rating: 4.9, status: 'Active' },
  { _id: 'g4', name: 'Priya Desai', email: 'priya@example.com', phone: '+91 98765 43217', experience: '4 years', rating: 4.7, status: 'Inactive' },
];

// Get all guides
app.get('/api/guides', async (req, res) => {
  try {
    if (useMongoDB) {
      const guides = await Guide.find();
      res.json(guides);
    } else {
      res.json(inMemoryGuides);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Add new guide (admin only)
app.post('/api/guides', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, experience, rating, status } = req.body;
    if (useMongoDB) {
      const guide = new Guide({ name, email, phone, experience, rating, status });
      await guide.save();
      res.status(201).json(guide);
    } else {
      const newGuide = { _id: `g${Date.now()}`, name, email, phone, experience, rating, status };
      inMemoryGuides.push(newGuide);
      res.status(201).json(newGuide);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Edit guide (admin only)
app.put('/api/guides/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, experience, rating, status } = req.body;
    if (useMongoDB) {
      const guide = await Guide.findByIdAndUpdate(req.params.id, { name, email, phone, experience, rating, status }, { new: true });
      if (!guide) return res.status(404).json({ message: 'Guide not found' });
      res.json(guide);
    } else {
      const idx = inMemoryGuides.findIndex(g => g._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Guide not found' });
      inMemoryGuides[idx] = { ...inMemoryGuides[idx], name, email, phone, experience, rating, status };
      res.json(inMemoryGuides[idx]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Delete guide (admin only)
app.delete('/api/guides/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (useMongoDB) {
      const guide = await Guide.findByIdAndDelete(req.params.id);
      if (!guide) return res.status(404).json({ message: 'Guide not found' });
      res.json({ message: 'Guide deleted' });
    } else {
      const idx = inMemoryGuides.findIndex(g => g._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Guide not found' });
      inMemoryGuides.splice(idx, 1);
      res.json({ message: 'Guide deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Guide Role Request (user requests to become guide)
app.post('/api/guiderequest', authenticateToken, async (req, res) => {
  try {
    if (useMongoDB) {
      // Check if already requested
      const existing = await GuideRequest.findOne({ user: req.user.userId, status: 'pending' });
      if (existing) return res.status(400).json({ message: 'Already requested' });
      const request = new GuideRequest({ user: req.user.userId });
      await request.save();
      res.status(201).json({ message: 'Guide request submitted', request });
    } else {
      const existing = inMemoryGuideRequests.find(r => r.user === req.user.userId && r.status === 'pending');
      if (existing) return res.status(400).json({ message: 'Already requested' });
      const request = { _id: `guidereq-${Date.now()}`, user: req.user.userId, status: 'pending', requestedAt: new Date() };
      inMemoryGuideRequests.push(request);
      res.status(201).json({ message: 'Guide request submitted', request });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Approve/Reject Guide Request
app.put('/api/approveguide/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    if (useMongoDB) {
      const request = await GuideRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ message: 'Request not found' });
      request.status = status;
      request.decisionAt = new Date();
      await request.save();
      if (status === 'approved') {
        await User.findByIdAndUpdate(request.user, { role: 'guide' });
      }
      res.json({ message: `Guide request ${status}`, request });
    } else {
      const idx = inMemoryGuideRequests.findIndex(r => r._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Request not found' });
      inMemoryGuideRequests[idx].status = status;
      inMemoryGuideRequests[idx].decisionAt = new Date();
      if (status === 'approved') {
        const userIdx = inMemoryUsers.findIndex(u => u._id === inMemoryGuideRequests[idx].user);
        if (userIdx !== -1) inMemoryUsers[userIdx].role = 'guide';
      }
      res.json({ message: `Guide request ${status}`, request: inMemoryGuideRequests[idx] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all guide requests (admin)
app.get('/api/guiderequests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (useMongoDB) {
      const requests = await GuideRequest.find().populate('user', 'username email role');
      res.json(requests);
    } else {
      res.json(inMemoryGuideRequests);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Event creation (guide or admin)
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    // Only guide or admin
    if (!['guide', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Only guides or admins can create events' });
    const eventData = { ...req.body, createdBy: req.user.userId, guide: req.user.userId, status: 'pending' };
    if (useMongoDB) {
      const event = new Event(eventData);
      await event.save();
      res.status(201).json({ message: 'Event created (pending approval)', event });
    } else {
      const newEvent = { _id: `event-${Date.now()}`, ...eventData, createdAt: new Date() };
      inMemoryEvents.push(newEvent);
      res.status(201).json({ message: 'Event created (pending approval)', event: newEvent });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get events (optionally filter by status)
app.get('/api/events', async (req, res) => {
  try {
    const status = req.query.status;
    if (useMongoDB) {
      const query = status ? { status } : {};
      const events = await Event.find(query).populate('guide', 'username profile guideProfile');
      res.json(events);
    } else {
      const events = status ? inMemoryEvents.filter(e => e.status === status) : inMemoryEvents;
      res.json(events);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve event (admin)
app.put('/api/events/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (useMongoDB) {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      event.status = 'approved';
      await event.save();
      res.json({ message: 'Event approved', event });
    } else {
      const idx = inMemoryEvents.findIndex(e => e._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Event not found' });
      inMemoryEvents[idx].status = 'approved';
      res.json({ message: 'Event approved', event: inMemoryEvents[idx] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Guide profile info
app.get('/api/guides/:id', async (req, res) => {
  try {
    if (useMongoDB) {
      const user = await User.findById(req.params.id);
      if (!user || user.role !== 'guide') return res.status(404).json({ message: 'Guide not found' });
      res.json({
        id: user._id,
        username: user.username,
        profile: user.profile,
        guideProfile: user.guideProfile,
        role: user.role
      });
    } else {
      const user = inMemoryUsers.find(u => u._id === req.params.id && u.role === 'guide');
      if (!user) return res.status(404).json({ message: 'Guide not found' });
      res.json({
        id: user._id,
        username: user.username,
        profile: user.profile,
        guideProfile: user.guideProfile,
        role: user.role
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Storage: ${useMongoDB ? 'MongoDB' : 'In-Memory'}`);
}); 