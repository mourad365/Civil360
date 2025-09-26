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
        return <div className="w-3 h-3 bg-equipment-active rounded-full iot-pulse shadow-lg" />;
      case "maintenance":
        return <div className="w-3 h-3 bg-equipment-maintenance rounded-full iot-pulse shadow-lg" />;
      case "offline":
        return <div className="w-3 h-3 bg-equipment-offline rounded-full offline-indicator shadow-lg" />;
      default:
        return <div className="w-3 h-3 bg-equipment-idle rounded-full shadow-lg" />;
    }
  };

  const getStatusColor = () => {
    switch (equipment.status) {
      case "active":
        return "text-equipment-active font-semibold";
      case "maintenance":
        return "text-equipment-maintenance font-semibold";
      case "offline":
        return "text-equipment-offline font-semibold";
      default:
        return "text-equipment-idle";
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
    <Card className="construction-card border border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center shadow-inner",
              equipment.status === "active" ? "equipment-active text-white" :
              equipment.status === "maintenance" ? "equipment-maintenance text-white" :
              equipment.status === "offline" ? "equipment-offline text-white" :
              "bg-equipment-idle text-white"
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
