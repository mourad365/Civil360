import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Bell, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-card shadow-sm border-b border-border" data-testid="header-topbar">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard Exécution</h1>
                  <p className="text-sm text-muted-foreground">Vue d'ensemble temps réel des chantiers</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* AI Status */}
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">IA Active</span>
                </div>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">3</span>
                </Button>
                {/* User Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-3 h-auto px-3 py-2 hover:bg-accent">
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.role}</p>
                      </div>
                      <div className="w-10 h-10 bg-construction-steel rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {user ? getUserInitials(user.name) : "??"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 construction-glass">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-muted-foreground">{user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
