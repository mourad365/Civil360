import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ModernSidebar from './ModernSidebar';
import ModernNavbar from './ModernNavbar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Auto-login for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !user) {
      // Mock auto-login with general director role
      const mockUser = {
        id: 'mock-user-gd-001',
        username: 'directeur.general',
        name: 'Directeur Général Mock',
        role: 'general_director',
        email: 'dg@civil360.ma'
      };
      
      // Store mock auth data
      localStorage.setItem('civil360_token', 'mock-token-development');
      localStorage.setItem('civil360_user', JSON.stringify(mockUser));
      
      // Refresh the page to trigger auth context update
      window.location.reload();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Connexion automatique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className={cn(
        "transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        isMobile && "fixed inset-y-0 left-0 z-50"
      )}>
        <ModernSidebar />
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        !isMobile && sidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* Navigation Bar */}
        <ModernNavbar title={title} onMenuToggle={toggleSidebar} />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>© 2024 CIVIL360. Tous droits réservés.</p>
              <div className="flex items-center space-x-4 mt-2 md:mt-0">
                <span>Version 2.0.0</span>
                <span>•</span>
                <span>Support: support@civil360.ma</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
