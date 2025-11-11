import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar collapsed={!isMobile && collapsed} isMobile={isMobile} mobileOpen={mobileOpen} />

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          !isMobile ? (collapsed ? "ml-16" : "ml-64") : "ml-0"
        )}
      >
        {/* Navigation Bar */}
        <Navbar
          title={title}
          onMenuToggle={toggleSidebar}
          onCollapseToggle={() => setCollapsed((v) => !v)}
          isCollapsed={!isMobile && collapsed}
        />
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
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
