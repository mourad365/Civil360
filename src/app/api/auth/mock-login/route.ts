import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Mock login only available in development' },
        { status: 403 }
      );
    }

    const { role } = await req.json();
    
    const mockUsers = {
      general_director: {
        id: '507f1f77bcf86cd799439011',
        username: 'directeur.general',
        name: 'Directeur Général Mock',
        role: 'general_director',
        email: 'dg@civil360.ma'
      },
      project_engineer: {
        id: '507f1f77bcf86cd799439012',
        username: 'ingenieur.projet',
        name: 'Ingénieur Projet Mock',
        role: 'project_engineer',
        email: 'engineer@civil360.ma'
      },
      purchasing_manager: {
        id: '507f1f77bcf86cd799439013',
        username: 'responsable.achats',
        name: 'Responsable Achats Mock',
        role: 'purchasing_manager',
        email: 'purchasing@civil360.ma'
      },
      logistics_manager: {
        id: '507f1f77bcf86cd799439014',
        username: 'responsable.logistique',
        name: 'Responsable Logistique Mock',
        role: 'logistics_manager',
        email: 'logistics@civil360.ma'
      }
    };

    const selectedRole = role || 'general_director';
    const mockUser = mockUsers[selectedRole as keyof typeof mockUsers] || mockUsers.general_director;

    const token = generateToken(mockUser);

    return NextResponse.json({
      success: true,
      message: 'Mock login successful',
      user: mockUser,
      token
    });
  } catch (error) {
    console.error('Mock login error:', error);
    return NextResponse.json(
      { error: 'Mock login failed' },
      { status: 500 }
    );
  }
}
