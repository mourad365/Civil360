import { connectDB } from '@/server/config/database';

let isConnected = false;

export async function initDB() {
  if (isConnected) {
    return;
  }

  // Connect to MongoDB - Skip if no valid URI provided
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<db_password>')) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✓ MongoDB connected');
    } catch (error) {
      console.warn('MongoDB connection failed, continuing without database:', error);
    }
  } else {
    console.log('MongoDB URI not configured, running in demo mode without database');
  }
}
