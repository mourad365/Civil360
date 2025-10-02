import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { mongoStorage } from '@/server/storage-mongo';
import UserModel from '@/server/models/User';

export async function GET(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    const user = await mongoStorage.getUser(authUser.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });

  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    const { name, email, role } = await req.json();

    const currentUser = await UserModel.findById(authUser.id);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;

    const updatedUser = await UserModel.findByIdAndUpdate(
      authUser.id, 
      updates, 
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser!._id,
        username: updatedUser!.username,
        name: updatedUser!.name,
        role: updatedUser!.role,
        email: updatedUser!.email
      }
    });

  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    );
  }
}
