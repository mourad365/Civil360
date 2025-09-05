import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  RefreshCw, Database, HardHat, Users, PieChart, Euro, ArrowRight, ArrowLeft, 
  CheckCircle, Loader2, Settings, AlertTriangle, Activity, Wifi, WifiOff,
  PlayCircle, PauseCircle, BarChart3, FileText, Clock, Zap
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import type { OdooSync as OdooSyncType } from "@shared/schema";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function OdooIntegration() {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedSyncType, setSelectedSyncType] = useState<string>("");
  const [batchSyncDialogOpen, setBatchSyncDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: syncStatus = [], isLoading } = useQuery({
    queryKey: ["/api/odoo/sync-status"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Real-time sync status updates
  useRealTimeData("/api/odoo/sync-status", 10000);

  const triggerSyncMutation = useMutation({
    mutationFn: async (entityType: string) => {
      const response = await fetch("/api/odoo/trigger-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType }),
      });
      if (!response.ok) throw new Error("Sync failed");
      return response.json();
    },
    onSuccess: (_, entityType) => {
      queryClient.invalidateQueries({ queryKey: ["/api/odoo/sync-status"] });
      toast({
        title: "Synchronisation lancée",
        description: `Sync ${entityType} avec Odoo ERP initiée`,
      });
    },
    onError: () => {
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de lancer la synchronisation",
        variant: "destructive",
      });
    },
  });

  const batchSyncMutation = useMutation({
    mutationFn: async (entityTypes: string[]) => {
      const results = await Promise.all(
        entityTypes.map(entityType =>
          fetch("/api/odoo/trigger-sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entityType }),
          })
        )
      );
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/odoo/sync-status"] });
      setBatchSyncDialogOpen(false);
      toast({
        title: "Synchronisation batch lancée",
        description: "Synchronisation de tous les modules initiée",
      });
    },
  });

  const getSyncIcon = (entityType: string) => {
    switch (entityType) {
      case "personnel":
        return <Users className="text-blue-600 h-4 w-4" />;
      case "projects":
        return <PieChart className="text-purple-600 h-4 w-4" />;
      case "facturation":
        return <Euro className="text-green-600 h-4 w-4" />;
      case "equipments":
        return <HardHat className="text-orange-600 h-4 w-4" />;
      case "quality":
        return <CheckCircle className="text-pink-600 h-4 w-4" />;
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
        return <AlertTriangle className="text-red-600 h-4 w-4" />;
      default:
        return <RefreshCw className="text-gray-600 h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Réussi</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">En cours</Badge>;
      case "failed":
        return <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Échec</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getTimeAgo = (lastSync: Date | string | null) => {
    if (!lastSync) return "Jamais";
    
    try {
      const date = typeof lastSync === 'string' ? new Date(lastSync) : lastSync;
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: fr 
      });
    } catch {
      return "Date invalide";
    }
  };

  const successfulSyncs = syncStatus.filter((s: OdooSyncType) => s.status === "success").length;
  const pendingSyncs = syncStatus.filter((s: OdooSyncType) => s.status === "pending").length;
  const failedSyncs = syncStatus.filter((s: OdooSyncType) => s.status === "failed").length;
  const totalSyncs = syncStatus.length;
  const syncHealthScore = totalSyncs > 0 ? Math.round((successfulSyncs / totalSyncs) * 100) : 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Intégration Odoo</h1>
            <p className="text-muted-foreground">Chargement du statut de synchronisation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Intégration Odoo ERP</h1>
          <p className="text-muted-foreground">
            Synchronisation bidirectionnelle temps réel avec l'ERP existant
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950 px-4 py-2 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full iot-pulse" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Connecté à Odoo
            </span>
          </div>
          <Dialog open={batchSyncDialogOpen} onOpenChange={setBatchSyncDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-batch-sync">
                <Activity className="mr-2 h-4 w-4" />
                Sync Globale
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Synchronisation Globale</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Lancer une synchronisation complète de tous les modules avec Odoo ERP.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Modules à synchroniser:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>Personnel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PieChart className="h-4 w-4 text-purple-600" />
                      <span>Projets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span>Facturation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HardHat className="h-4 w-4 text-orange-600" />
                      <span>Équipements</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => batchSyncMutation.mutate(["personnel", "projects", "facturation", "equipments"])}
                  disabled={batchSyncMutation.isPending}
                  className="w-full"
                  data-testid="button-confirm-batch-sync"
                >
                  {batchSyncMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Synchronisation en cours...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Lancer la Synchronisation
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Integration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div className="text-2xl font-bold text-green-600">{successfulSyncs}</div>
            </div>
            <div className="text-sm text-muted-foreground">Syncs réussies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Loader2 className="h-5 w-5 text-orange-600 mr-2" />
              <div className="text-2xl font-bold text-orange-600">{pendingSyncs}</div>
            </div>
            <div className="text-sm text-muted-foreground">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div className="text-2xl font-bold text-red-600">{failedSyncs}</div>
            </div>
            <div className="text-sm text-muted-foreground">Échecs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              <div className="text-2xl font-bold text-blue-600">{syncHealthScore}%</div>
            </div>
            <div className="text-sm text-muted-foreground">Santé intégration</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="status" data-testid="tab-sync-status">Statut Sync</TabsTrigger>
          <TabsTrigger value="dataflow" data-testid="tab-data-flow">Flux de Données</TabsTrigger>
          <TabsTrigger value="configuration" data-testid="tab-configuration">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring" data-testid="tab-monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sync Status Overview */}
            <Card className="shadow-sm border border-border">
              <CardHeader>
                <h2 className="text-xl font-bold text-foreground">Statut Synchronisation</h2>
                <p className="text-sm text-muted-foreground">
                  État actuel de la synchronisation avec Odoo ERP
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {syncStatus.map((sync: OdooSyncType) => (
                  <div key={sync.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getSyncIcon(sync.entityType)}
                      <div>
                        <span className="text-sm font-medium capitalize">
                          {sync.entityType}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          Type: {sync.syncType}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {getTimeAgo(sync.lastSync)}
                        </div>
                        {sync.errorMessage && (
                          <div className="text-xs text-red-600 max-w-32 truncate">
                            {sync.errorMessage}
                          </div>
                        )}
                      </div>
                      {getStatusBadge(sync.status)}
                      {getStatusIcon(sync.status)}
                      {sync.status !== "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerSyncMutation.mutate(sync.entityType)}
                          disabled={triggerSyncMutation.isPending}
                          data-testid={`button-sync-${sync.entityType}`}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sync Health */}
            <Card className="shadow-sm border border-border">
              <CardHeader>
                <h2 className="text-xl font-bold text-foreground">Santé de l'Intégration</h2>
                <p className="text-sm text-muted-foreground">
                  Performance globale de la synchronisation Odoo
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Taux de succès</span>
                      <span className="font-medium">{syncHealthScore}%</span>
                    </div>
                    <Progress value={syncHealthScore} className="w-full" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{successfulSyncs}</div>
                      <div className="text-xs text-muted-foreground">Réussies</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{pendingSyncs}</div>
                      <div className="text-xs text-muted-foreground">En cours</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-600">{failedSyncs}</div>
                      <div className="text-xs text-muted-foreground">Échecs</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <h4 className="font-medium text-foreground">Dernières activités</h4>
                  <div className="space-y-1 text-sm">
                    {syncStatus
                      .sort((a: OdooSyncType, b: OdooSyncType) => {
                        const dateA = a.lastSync ? new Date(a.lastSync).getTime() : 0;
                        const dateB = b.lastSync ? new Date(b.lastSync).getTime() : 0;
                        return dateB - dateA;
                      })
                      .slice(0, 3)
                      .map((sync: OdooSyncType) => (
                        <div key={sync.id} className="flex items-center justify-between text-xs">
                          <span className="capitalize">{sync.entityType}</span>
                          <span className={cn(
                            "font-medium",
                            sync.status === "success" ? "text-green-600" :
                            sync.status === "pending" ? "text-orange-600" :
                            "text-red-600"
                          )}>
                            {getTimeAgo(sync.lastSync)}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dataflow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Flow Direction */}
            <Card className="shadow-sm border border-border">
              <CardHeader>
                <h3 className="font-semibold text-foreground">Flux de Données</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Database className="text-white h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Odoo → CIVIL360</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Projets, clients, budgets, personnel, contrats
                    </p>
                  </div>
                  <ArrowRight className="text-blue-600 h-5 w-5" />
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 rounded-lg">
                  <ArrowLeft className="text-green-600 h-5 w-5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800 dark:text-green-200">CIVIL360 → Odoo</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Heures chantier, consommations, avancements, qualité
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <HardHat className="text-white h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Capabilities */}
            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200">
              <CardHeader>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                  APIs Avancées Disponibles
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm text-purple-700 dark:text-purple-300">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>REST API complète</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>WebHooks temps réel</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>GraphQL queries</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Batch synchronisation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Volume Statistics */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-foreground">Volume de Données Synchronisées</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">2,347</div>
                  <div className="text-sm text-muted-foreground">Enregistrements personnel</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">127</div>
                  <div className="text-sm text-muted-foreground">Projets actifs</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">8,934</div>
                  <div className="text-sm text-muted-foreground">Heures chantier</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">€2.4M</div>
                  <div className="text-sm text-muted-foreground">Facturation sync</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connection Settings */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Paramètres de Connexion</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="odoo-url">URL Serveur Odoo</Label>
                  <Input
                    id="odoo-url"
                    value="https://demo.odoo.com"
                    disabled
                    data-testid="input-odoo-url"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database-name">Base de Données</Label>
                  <Input
                    id="database-name"
                    value="construction_demo"
                    disabled
                    data-testid="input-database-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-version">Version API</Label>
                  <Input
                    id="api-version"
                    value="15.0"
                    disabled
                    data-testid="input-api-version"
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Connexion établie</span>
                </div>
              </CardContent>
            </Card>

            {/* Sync Configuration */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Configuration Sync</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sync-frequency">Fréquence de Synchronisation</Label>
                  <select 
                    id="sync-frequency" 
                    className="w-full p-2 border border-border rounded-md bg-background"
                    data-testid="select-sync-frequency"
                  >
                    <option value="5">Toutes les 5 minutes</option>
                    <option value="15">Toutes les 15 minutes</option>
                    <option value="30">Toutes les 30 minutes</option>
                    <option value="60">Toutes les heures</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Modules Activés</Label>
                  <div className="space-y-2">
                    {["personnel", "projects", "facturation", "equipments"].map((module) => (
                      <label key={module} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="capitalize text-sm">{module}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Webhook Configuration */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-foreground">Configuration WebHooks</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Endpoints Actifs</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span>/webhook/odoo/projects</span>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span>/webhook/odoo/personnel</span>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span>/webhook/odoo/invoices</span>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Configuration Sécurité</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Authentification token configurée</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Signature HMAC activée</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Chiffrement TLS 1.3</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Métriques de Performance</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-foreground">2.3s</div>
                    <div className="text-xs text-muted-foreground">Latence moyenne</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-foreground">99.2%</div>
                    <div className="text-xs text-muted-foreground">Disponibilité</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-foreground">1,247</div>
                    <div className="text-xs text-muted-foreground">Req/min moyenne</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-foreground">0.02%</div>
                    <div className="text-xs text-muted-foreground">Taux d'erreur</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilisation CPU</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <Progress value={23} className="w-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilisation mémoire</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <Progress value={67} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Error Log */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Journal des Erreurs</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Timeout connexion
                      </span>
                      <span className="text-xs text-red-600">Il y a 2h</span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Module facturation - Délai d'attente dépassé (30s)
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Données incohérentes
                      </span>
                      <span className="text-xs text-yellow-600">Il y a 4h</span>
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Module personnel - Format date invalide
                    </p>
                  </div>

                  <div className="text-center text-sm text-muted-foreground py-4">
                    <Clock className="h-4 w-4 mx-auto mb-2" />
                    Aucune autre erreur récente
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-foreground">Statut Système</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Services</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>API Gateway</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">En ligne</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sync Engine</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">En ligne</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Webhook Handler</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">En ligne</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Base de Données</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Connexion pool</span>
                      <span className="text-green-600">15/20 actives</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Requêtes/sec</span>
                      <span className="text-foreground">127</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Temps réponse</span>
                      <span className="text-foreground">12ms</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Cache</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Hit ratio</span>
                      <span className="text-green-600">89.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Taille utilisée</span>
                      <span className="text-foreground">234MB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Évictions/h</span>
                      <span className="text-foreground">12</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
