const mongoose = require('mongoose');
const User = require('./models/User');
const Sport = require('./models/Sport');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sports-scheduler';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Create Default Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.findOneAndUpdate(
      { email: 'admin@sportsscheduler.com' },
      {
        name: 'System Admin',
        email: 'admin@sportsscheduler.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      { upsert: true, new: true }
    );

    console.log('Admin user created/updated successfully:');
    console.log('Email: admin@sportsscheduler.com');
    console.log('Password: admin123');

    // 2. Seed Default Sports
    const defaultSports = ['Football', 'Badminton', 'Basketball', 'Tennis', 'Cricket'];
    for (const sportName of defaultSports) {
      await Sport.findOneAndUpdate(
        { name: sportName },
        { name: sportName, createdBy: admin._id },
        { upsert: true }
      );
    }
    console.log('Default sports seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin data:', error);
    process.exit(1);
  }
};

seed();
