import mongoose, { connectDB, disconnectDB } from '@/server/config/database';

let isConnected = false;

export async function initDB() {
  const targetDbName = process.env.MONGODB_DB_NAME || 'civil360';
  const currentDbName = (mongoose.connection as any)?.db?.databaseName;

  // If connected to a different DB (like 'test'), reconnect to the correct one
  if (currentDbName && currentDbName !== targetDbName) {
    try {
      await disconnectDB();
    } catch {}
    isConnected = false;
  }

  if (isConnected && currentDbName === targetDbName) {
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
