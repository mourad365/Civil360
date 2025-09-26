import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Radio, Truck, Settings, AlertTriangle, MapPin, Battery, Wifi, WifiOff, Wrench, Activity } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import type { IoTEquipment, Project } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function IoTEquipment() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ["/api/iot/equipment"],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Use real-time data hook for IoT updates
  useRealTimeData("/api/iot/equipment", 5000);

  const updateEquipmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<IoTEquipment> }) => {
      const response = await fetch(`/api/iot/equipment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Update failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iot/equipment"] });
    },
  });

  const simulateIoTUpdate = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/iot/simulate-update", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Simulation failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iot/equipment"] });
      toast({
        title: "Données IoT mises à jour",
        description: "Simulation de données en temps réel effectuée",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "maintenance":
        return "text-orange-600";
      case "offline":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Actif</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">Maintenance</Badge>;
      case "offline":
        return <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Hors ligne</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case "excavator":
        return <Truck className="h-6 w-6" />;
      case "crane":
        return <Settings className="h-6 w-6" />;
      case "compactor":
        return <AlertTriangle className="h-6 w-6" />;
      default:
        return <Radio className="h-6 w-6" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600";
    if (level > 20) return "text-orange-600";
    return "text-red-600";
  };

  const filteredEquipment = equipment.filter((item: IoTEquipment) => {
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesProject = filterProject === "all" || item.projectId === filterProject;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesProject && matchesSearch;
  });

  const activeEquipment = equipment.filter((e: IoTEquipment) => e.status === "active").length;
  const maintenanceEquipment = equipment.filter((e: IoTEquipment) => e.status === "maintenance").length;
  const offlineEquipment = equipment.filter((e: IoTEquipment) => e.status === "offline").length;
  const averageUtilization = equipment.length > 0 
    ? equipment.reduce((sum: number, e: IoTEquipment) => sum + (e.utilization || 0), 0) / equipment.length
    : 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Radio className="h-8 w-8 animate-pulse text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Équipements IoT</h1>
            <p className="text-muted-foreground">Chargement des équipements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Équipements IoT</h1>
          <p className="text-muted-foreground">
            Suivi temps réel de {equipment.length} équipements connectés
          </p>
        </div>
        <Button 
          onClick={() => simulateIoTUpdate.mutate()}
          disabled={simulateIoTUpdate.isPending}
          variant="outline"
          data-testid="button-simulate-iot-update"
        >
          <Activity className="mr-2 h-4 w-4" />
          Simuler Données
        </Button>
      </div>

      {/* IoT Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full iot-pulse mr-2"></div>
              <div className="text-2xl font-bold text-green-600">{activeEquipment}</div>
            </div>
            <div className="text-sm text-muted-foreground">Équipements actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Wrench className="h-5 w-5 text-orange-600 mr-2" />
              <div className="text-2xl font-bold text-orange-600">{maintenanceEquipment}</div>
            </div>
            <div className="text-sm text-muted-foreground">En maintenance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <WifiOff className="h-5 w-5 text-red-600 mr-2" />
              <div className="text-2xl font-bold text-red-600">{offlineEquipment}</div>
            </div>
            <div className="text-sm text-muted-foreground">Hors ligne</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{averageUtilization.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Utilisation moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Rechercher équipement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-equipment"
              />
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger data-testid="select-filter-status">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Hors ligne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger data-testid="select-filter-project">
                  <SelectValue placeholder="Projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les projets</SelectItem>
                  {projects.map((project: Project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Wifi className="mr-2 h-4 w-4 text-green-600" />
              Temps réel activé
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="grid" data-testid="tab-grid-view">Vue grille</TabsTrigger>
          <TabsTrigger value="list" data-testid="tab-list-view">Vue liste</TabsTrigger>
          <TabsTrigger value="map" data-testid="tab-map-view">Carte</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item: IoTEquipment) => (
              <Card key={item.id} className={cn(
                "shadow-sm border transition-all hover:shadow-md",
                item.status === "offline" ? "border-red-200 bg-red-50 dark:bg-red-950" :
                item.status === "maintenance" ? "border-orange-200 bg-orange-50 dark:bg-orange-950" :
                "border-border"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        item.status === "active" ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400" :
                        item.status === "maintenance" ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400" :
                        "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                      )}>
                        {getEquipmentIcon(item.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground" data-testid={`equipment-name-${item.id}`}>
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location */}
                  {item.latitude && item.longitude && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        GPS: {parseFloat(item.latitude).toFixed(4)}, {parseFloat(item.longitude).toFixed(4)}
                      </span>
                    </div>
                  )}

                  {/* Utilization */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Utilisation</span>
                      <span className={cn(
                        "font-medium",
                        item.utilization && item.utilization >= 80 ? "text-green-600" :
                        item.utilization && item.utilization >= 50 ? "text-orange-600" :
                        "text-red-600"
                      )}>
                        {item.utilization}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all",
                          item.utilization && item.utilization >= 80 ? "bg-green-600" :
                          item.utilization && item.utilization >= 50 ? "bg-orange-500" :
                          "bg-red-500"
                        )}
                        style={{ width: `${item.utilization}%` }}
                      />
                    </div>
                  </div>

                  {/* Battery Level */}
                  {item.batteryLevel !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Battery className={cn("h-4 w-4", getBatteryColor(item.batteryLevel))} />
                        <span className="text-muted-foreground">Batterie</span>
                      </div>
                      <span className={cn("font-medium", getBatteryColor(item.batteryLevel))}>
                        {item.batteryLevel}%
                      </span>
                    </div>
                  )}

                  {/* Sensor Data */}
                  {item.sensorData && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-foreground mb-2">Données capteurs</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {Object.entries(item.sensorData as Record<string, any>).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      data-testid={`button-locate-${item.id}`}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Localiser
                    </Button>
                    {item.status === "maintenance" && (
                      <Button 
                        size="sm"
                        onClick={() => updateEquipmentMutation.mutate({
                          id: item.id,
                          updates: { status: "active" }
                        })}
                        data-testid={`button-mark-active-${item.id}`}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Marquer Actif
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredEquipment.map((item: IoTEquipment) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        item.status === "active" ? "bg-green-100 text-green-600" :
                        item.status === "maintenance" ? "bg-orange-100 text-orange-600" :
                        "bg-red-100 text-red-600"
                      )}>
                        {getEquipmentIcon(item.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="capitalize">{item.type}</span>
                          {item.latitude && item.longitude && (
                            <span>GPS: {parseFloat(item.latitude).toFixed(4)}, {parseFloat(item.longitude).toFixed(4)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div className="font-medium">{item.utilization}%</div>
                        <div className="text-muted-foreground">Utilisation</div>
                      </div>
                      {item.batteryLevel !== undefined && (
                        <div className="text-right text-sm">
                          <div className={cn("font-medium", getBatteryColor(item.batteryLevel))}>
                            {item.batteryLevel}%
                          </div>
                          <div className="text-muted-foreground">Batterie</div>
                        </div>
                      )}
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card className="h-96">
            <CardContent className="p-0 h-full">
              <div className="h-full bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Carte Interactive</h3>
                  <p className="text-muted-foreground">
                    Vue cartographique des équipements avec géolocalisation GPS temps réel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
