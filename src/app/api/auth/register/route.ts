import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth-helpers';
import UserModel from '@/server/models/User';
import { initDB } from '@/lib/db-init';

export async function POST(req: NextRequest) {
  try {
    // Ensure DB connection (important in serverless/Netlify)
    await initDB();

    const { username, password, name, role, email } = await req.json();

    // Validation
    if (!username || !password || !name) {
      return NextResponse.json(
        { error: 'Username, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new UserModel({
      username,
      password,
      name,
      role: role || 'project_engineer',
      email
    });
    await newUser.save();

    const token = generateToken(newUser);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email
      },
      token
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user', details: error.message },
      { status: 500 }
    );
  }
}
