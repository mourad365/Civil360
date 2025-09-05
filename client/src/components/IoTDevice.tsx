import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Settings, AlertTriangle, MapPin } from "lucide-react";
import type { IoTEquipment } from "@shared/schema";
import { cn } from "@/lib/utils";

interface IoTDeviceProps {
  equipment: IoTEquipment;
  onLocate?: () => void;
}

export default function IoTDevice({ equipment, onLocate }: IoTDeviceProps) {
  const getStatusIcon = () => {
    switch (equipment.status) {
      case "active":
        return <div className="w-2 h-2 bg-green-500 rounded-full iot-pulse" />;
      case "maintenance":
        return <div className="w-2 h-2 bg-orange-500 rounded-full iot-pulse" />;
      case "offline":
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const getStatusColor = () => {
    switch (equipment.status) {
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

  const getEquipmentIcon = () => {
    switch (equipment.type) {
      case "excavator":
        return <Truck className="h-6 w-6" />;
      case "crane":
        return <Settings className="h-6 w-6" />;
      case "compactor":
        return <AlertTriangle className="h-6 w-6" />;
      default:
        return <Truck className="h-6 w-6" />;
    }
  };

  const getUtilizationColor = () => {
    const utilization = equipment.utilization || 0;
    if (utilization >= 80) return "text-green-600";
    if (utilization >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              equipment.status === "active" ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400" :
              equipment.status === "maintenance" ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400" :
              "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
            )}>
              {getEquipmentIcon()}
            </div>
            <div>
              <p className="font-medium text-foreground" data-testid={`equipment-name-${equipment.id}`}>
                {equipment.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Type: {equipment.type} • Projet ID: {equipment.projectId?.slice(0, 8)}...
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon()}
                <span className={cn("text-xs", getStatusColor())}>
                  {equipment.status === "active" && equipment.latitude && equipment.longitude
                    ? `GPS: ${parseFloat(equipment.latitude).toFixed(4)}, ${parseFloat(equipment.longitude).toFixed(4)}`
                    : equipment.status === "maintenance" 
                      ? "Maintenance préventive requise"
                      : equipment.status === "offline"
                        ? "Hors zone autorisée - Alerte géofencing active"
                        : "Status inconnu"
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Utilisation</p>
                <p className={cn("text-lg font-bold", getUtilizationColor())}>
                  {equipment.utilization}%
                </p>
              </div>
              {equipment.batteryLevel !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  Batterie: {equipment.batteryLevel}%
                </Badge>
              )}
            </div>
            {equipment.status === "offline" && onLocate && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={onLocate}
                className="mt-2"
                data-testid={`button-locate-${equipment.id}`}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Localiser
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
