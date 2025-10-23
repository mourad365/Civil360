import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, generateToken } from '@/lib/auth-helpers';
import UserModel from '@/server/models/User';

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    const user = await UserModel.findById(authUser.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      token
    });

  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token', details: error.message },
      { status: 500 }
    );
  }
}
