import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Menu,
  Globe,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface ModernNavbarProps {
  title?: string;
  onMenuToggle?: () => void;
}

const ModernNavbar: React.FC<ModernNavbarProps> = ({ title = "Dashboard", onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <header className="glass-navbar sticky top-0 z-40 w-full h-16">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Page Title */}
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 border-white/20 focus:bg-white"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('fr')}>
                <span className="fi fi-fr mr-2"></span>
                Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                <span className="fi fi-ma mr-2"></span>
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                <span className="fi fi-us mr-2"></span>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">{notificationCount} nouvelles</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start p-4">
                  <div className="flex items-center space-x-2 w-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium flex-1">Nouveau projet assigné</span>
                    <span className="text-xs text-muted-foreground">Il y a 2h</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Projet Villa Moderne à Rabat vous a été assigné
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-4">
                  <div className="flex items-center space-x-2 w-full">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium flex-1">Commande en retard</span>
                    <span className="text-xs text-muted-foreground">Il y a 4h</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Livraison de ciment prévue aujourd'hui en retard
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-4">
                  <div className="flex items-center space-x-2 w-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium flex-1">Rapport validé</span>
                    <span className="text-xs text-muted-foreground">Hier</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rapport quotidien approuvé par le directeur
                  </p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="w-full text-center">
                Voir toutes les notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Mon Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <span className="w-4 h-4 mr-2">→</span>
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ModernNavbar;
