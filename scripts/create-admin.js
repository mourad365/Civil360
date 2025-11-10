import mongoose from 'mongoose';
import UserModel from '../src/server/models/User.ts';

const MONGODB_URI = 'mongodb+srv://mourad2:mourad2@cluster0.mwhno36.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'civil360';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = new UserModel({
      username: 'admin',
      password: '123456', // Will be hashed by the pre-save hook
      name: 'Admin User',
      role: 'admin',
      email: 'admin@civil360.com',
      preferences: {
        theme: 'light',
        language: 'fr',
        notifications: true,
        currency: 'MAD',
        timezone: 'Africa/Casablanca'
      },
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        position: 'System Administrator',
        department: 'IT',
        company: 'Civil360'
      },
      isActive: true
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: 123456');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
