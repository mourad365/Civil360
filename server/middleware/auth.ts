import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { mongoStorage } from '../storage-mongo';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
    email?: string;
  };
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mock authentication for development
    if (process.env.NODE_ENV === 'development') {
      // Provide mock user based on request path or default to general director
      let mockUser = {
        id: '507f1f77bcf86cd799439011',
        username: 'directeur.general',
        name: 'Directeur Général Mock',
        role: 'general_director',
        email: 'dg@civil360.ma'
      };

      // Determine role based on the request path
      const path = req.path;
      if (path.includes('project-engineer') || path.includes('engineer')) {
        mockUser = {
          id: '507f1f77bcf86cd799439012',
          username: 'ingenieur.projet',
          name: 'Ingénieur Projet Mock',
          role: 'project_engineer',
          email: 'engineer@civil360.ma'
        };
      } else if (path.includes('purchasing')) {
        mockUser = {
          id: '507f1f77bcf86cd799439013',
          username: 'responsable.achats',
          name: 'Responsable Achats Mock',
          role: 'purchasing_manager',
          email: 'purchasing@civil360.ma'
        };
      } else if (path.includes('equipment') || path.includes('logistics')) {
        mockUser = {
          id: '507f1f77bcf86cd799439014',
          username: 'responsable.logistique',
          name: 'Responsable Logistique Mock',
          role: 'logistics_manager',
          email: 'logistics@civil360.ma'
        };
      }

      req.user = mockUser;
      console.log('Mock authentication:', mockUser.role, 'for path:', path);
      return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await mongoStorage.getUser(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await mongoStorage.getUser(decoded.id);

      if (user) {
        req.user = {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const generateToken = (user: any): string => {
  const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
};
