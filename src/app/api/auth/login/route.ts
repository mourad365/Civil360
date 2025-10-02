import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth-helpers';
import UserModel from '@/server/models/User';

export async function POST(req: NextRequest) {
  try {
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
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
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
    return NextResponse.json(
      { error: 'Failed to login', details: error.message },
      { status: 500 }
    );
  }
}
