'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, 
  Building, 
  ShoppingCart, 
  Truck, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  LogOut,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  roles: string[];
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Tableau de Bord',
    path: '/dashboard',
    roles: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager']
  },
  {
    id: 'projects',
    icon: Building,
    label: 'Projets',
    path: '/projects',
    roles: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager']
  },
  {
    id: 'purchasing',
    icon: ShoppingCart,
    label: 'Achats',
    path: '/purchasing',
    roles: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager']
  },
  {
    id: 'equipment',
    icon: Truck,
    label: 'Équipements',
    path: '/equipment',
    roles: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager']
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analyses',
    path: '/analytics',
    roles: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager']
  },
  {
    id: 'etude-quantitative',
    icon: Calculator,
    label: 'Étude Quantitative',
    path: '/etude-quantitative',
    roles: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager']
  },
  {
    id: 'reports',
    icon: FileText,
    label: 'Rapports',
    path: '/reports',
    roles: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager']
  },
  {
    id: 'team',
    icon: Users,
    label: 'Équipe',
    path: '/team',
    roles: ['general_director', 'project_engineer', 'purchasing_manager', 'logistics_manager']
  },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  const userRole = user?.role?.toLowerCase();
  const filteredItems = sidebarItems.filter(item =>
    userRole === 'admin' || (userRole ? item.roles.includes(userRole) : false)
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 glass-sidebar z-50 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">CIVIL360</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          
          return (
            <Link key={item.id} href={item.path}>
              <div className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                "hover:bg-white/10 hover:translate-x-1 group",
                isActive 
                  ? "bg-white/15 text-white shadow-lg" 
                  : "text-white/80 hover:text-white"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-blue-400" : "text-white/70 group-hover:text-blue-400"
                )} />
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={cn(
                  "w-4 h-4 transition-all opacity-0 group-hover:opacity-100",
                  isActive && "opacity-100"
                )} />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-white/10 p-4 flex-shrink-0">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{user?.name}</p>
            <p className="text-white/60 text-xs capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <div className="mt-3 space-y-1">
          <button className="flex items-center space-x-3 w-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Paramètres</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
