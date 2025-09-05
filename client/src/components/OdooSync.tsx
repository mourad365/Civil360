import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, HardHat, Users, PieChart, Euro, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import type { OdooSync as OdooSyncType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface OdooSyncProps {
  syncStatus: OdooSyncType[];
  onTriggerSync: (entityType: string) => void;
}

export default function OdooSync({ syncStatus, onTriggerSync }: OdooSyncProps) {
  const getSyncIcon = (entityType: string) => {
    switch (entityType) {
      case "personnel":
        return <Users className="text-blue-600 h-4 w-4" />;
      case "projects":
        return <PieChart className="text-purple-600 h-4 w-4" />;
      case "facturation":
        return <Euro className="text-green-600 h-4 w-4" />;
      default:
        return <Database className="text-gray-600 h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-green-600 h-4 w-4" />;
      case "pending":
        return <Loader2 className="text-orange-600 h-4 w-4 animate-spin" />;
      case "failed":
        return <RefreshCw className="text-red-600 h-4 w-4" />;
      default:
        return <RefreshCw className="text-gray-600 h-4 w-4" />;
    }
  };

  const getTimeAgo = (lastSync: Date | string | null) => {
    if (!lastSync) return "Jamais";
    
    try {
      const date = typeof lastSync === 'string' ? new Date(lastSync) : lastSync;
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return "À l'instant";
      if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `Il y a ${diffInHours}h`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    } catch {
      return "Date invalide";
    }
  };

  return (
    <Card className="shadow-sm border border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Intégration Odoo ERP</h2>
            <p className="text-sm text-muted-foreground">
              Synchronisation bidirectionnelle temps réel avec l'ERP existant
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950 px-4 py-2 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Synchronisé</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Flow */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Flux de Données</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="text-white h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Odoo → CIVIL360</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Projets, clients, budgets, personnel
                  </p>
                </div>
                <ArrowRight className="text-blue-600 h-5 w-5" />
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 rounded-lg">
                <ArrowLeft className="text-green-600 h-5 w-5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-800 dark:text-green-200">CIVIL360 → Odoo</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Heures, consommations, avancements
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <HardHat className="text-white h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Statut Synchronisation</h3>
            <div className="space-y-3">
              {syncStatus.map((sync) => (
                <div key={sync.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getSyncIcon(sync.entityType)}
                    <span className="text-sm font-medium capitalize">
                      {sync.entityType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">
                        Dernière sync: {getTimeAgo(sync.lastSync)}
                      </span>
                      {sync.status === "pending" && (
                        <div className="text-xs text-orange-600">En cours...</div>
                      )}
                    </div>
                    {getStatusIcon(sync.status)}
                    {sync.status !== "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTriggerSync(sync.entityType)}
                        data-testid={`button-sync-${sync.entityType}`}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                API Avancées Disponibles
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-purple-700 dark:text-purple-300">
                <div>• REST API complète</div>
                <div>• WebHooks temps réel</div>
                <div>• GraphQL queries</div>
                <div>• Batch synchronisation</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
