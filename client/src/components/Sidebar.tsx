import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Building, 
  Brain, 
  Radio, 
  Camera, 
  Smartphone, 
  RefreshCw,
  HardHat,
  Wrench
} from "lucide-react";

const navigation = [
  { name: "Tableau de Bord", href: "/dashboard", icon: BarChart3, current: true },
  { name: "Chantiers Actifs", href: "/chantiers", icon: Building, count: 12 },
  { name: "IA Analyse Plans", href: "/ai-plans", icon: Brain, badge: "3 en cours" },
  { name: "IoT Équipements", href: "/iot", icon: Radio, badge: "247 actifs" },
  { name: "Gestion Équipements", href: "/equipment", icon: Wrench, badge: "2 critiques" },
  { name: "Contrôle Qualité", href: "/quality", icon: Camera },
  { name: "Interface Mobile", href: "/mobile", icon: Smartphone },
  { name: "Intégration Odoo", href: "/odoo", icon: RefreshCw },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <HardHat className="text-primary-foreground h-5 w-5" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-foreground">CIVIL360</h1>
            <p className="text-xs text-muted-foreground">Plateforme BTP Intelligente</p>
          </div>
        </div>
      </div>
      
      {/* Connection Status */}
      <div className="px-4 mt-4">
        <div className="flex items-center p-3 bg-muted rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full iot-pulse"></div>
          <span className="ml-2 text-sm font-medium text-foreground">En ligne - Sync activée</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-8 flex-1 px-4 space-y-2" data-testid="nav-sidebar">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
              data-testid={`nav-link-${item.href.replace('/', '')}`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
              {item.count && (
                <span className="ml-auto bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded-full">
                  {item.count}
                </span>
              )}
              {item.badge && (
                <span className="ml-auto bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Odoo Integration Status */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
            <RefreshCw className="text-white h-4 w-4" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">Odoo ERP</p>
            <p className="text-xs text-green-600">✓ Synchronisé</p>
          </div>
        </div>
      </div>
    </div>
  );
}
