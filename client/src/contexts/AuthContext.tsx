import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on mount
    const storedToken = localStorage.getItem('civil360_token');
    const storedUser = localStorage.getItem('civil360_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('civil360_token');
        localStorage.removeItem('civil360_user');
      }
    } else if (process.env.NODE_ENV === 'development') {
      // Auto-login in development mode
      console.log('Development mode: Auto-login enabled');
      const mockUser = {
        id: '507f1f77bcf86cd799439011',
        username: 'directeur.general',
        name: 'Directeur Général Mock',
        role: 'general_director',
        email: 'dg@civil360.ma'
      };
      
      const mockToken = 'mock-token-development';
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('civil360_token', mockToken);
      localStorage.setItem('civil360_user', JSON.stringify(mockUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('civil360_token', newToken);
    localStorage.setItem('civil360_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('civil360_token');
    localStorage.removeItem('civil360_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-construction-steel border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login will be handled by the router
      return null;
    }

    return <Component {...props} />;
  };
};
