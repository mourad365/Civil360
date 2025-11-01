import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth-helpers';
import UserModel from '@/server/models/User';
import { initDB } from '@/lib/db-init';
import db from '@/server/config/database';

export async function POST(req: NextRequest) {
  try {
    // Initialize database connection
    await initDB();
    
    console.log('Database name:', UserModel.db?.name);
    console.log('Collection name:', UserModel.collection.name);
    console.log('Global connection db:', db.connection.db?.databaseName);
    
    // Count total users in collection
    const totalUsers = await UserModel.countDocuments();
    console.log('Total users in collection:', totalUsers);

    const { username, password } = await req.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await UserModel.findOne({ username }).select('+password');
    
    console.log('User found:', user ? 'Yes' : 'No');
    console.log('Username searched:', username);
    
    if (!user) {
      // Debug: Try to find any user to see what's in the collection
      const anyUser = await UserModel.findOne().select('username email');
      console.log('Sample user in collection:', anyUser);
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('User has password field:', !!user.password);
    console.log('Password hash starts with:', user.password?.substring(0, 10));
    console.log('Attempting to compare password...');

    // Check password
    const isValidPassword = await user.comparePassword(password);
    
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      },
      token
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    // Check if it's a database connection error
    if (error.message?.includes('connect') || error.message?.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Service de base de données indisponible. Veuillez contacter l\'administrateur.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Échec de la connexion', details: error.message },
      { status: 500 }
    );
  }
}
