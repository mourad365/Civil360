import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { mongoStorage } from '../server/storage-mongo';
import { initDB } from './db-init';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  email?: string;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  await initDB();
  try {
    // Mock authentication for development
    if (process.env.NODE_ENV === 'development') {
      const url = req.nextUrl.pathname;
      
      let mockUser: AuthUser = {
        id: '507f1f77bcf86cd799439011',
        username: 'directeur.general',
        name: 'Directeur Général Mock',
        role: 'general_director',
        email: 'dg@civil360.ma'
      };

      if (url.includes('project-engineer') || url.includes('engineer')) {
        mockUser = {
          id: '507f1f77bcf86cd799439012',
          username: 'ingenieur.projet',
          name: 'Ingénieur Projet Mock',
          role: 'project_engineer',
          email: 'engineer@civil360.ma'
        };
      } else if (url.includes('purchasing')) {
        mockUser = {
          id: '507f1f77bcf86cd799439013',
          username: 'responsable.achats',
          name: 'Responsable Achats Mock',
          role: 'purchasing_manager',
          email: 'purchasing@civil360.ma'
        };
      } else if (url.includes('equipment') || url.includes('logistics')) {
        mockUser = {
          id: '507f1f77bcf86cd799439014',
          username: 'responsable.logistique',
          name: 'Responsable Logistique Mock',
          role: 'logistics_manager',
          email: 'logistics@civil360.ma'
        };
      }

      return mockUser;
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return null;
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await mongoStorage.getUser(decoded.id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email ?? undefined
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth(req: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(req);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export function generateToken(user: any): string {
  const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function requireRole(user: AuthUser, roles: string[]) {
  if (!roles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
}
