import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import type { QualityCheck } from "@shared/schema";
import { cn } from "@/lib/utils";

interface QualityCheckProps {
  check: QualityCheck;
  onCreateNonConformity?: () => void;
}

export default function QualityCheck({ check, onCreateNonConformity }: QualityCheckProps) {
  const getStatusIcon = () => {
    switch (check.status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (check.status) {
      case "passed":
        return (
          <Badge className="bg-quality-passed/20 text-quality-passed border-quality-passed/30 font-semibold">
            ✓ Conforme
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-quality-failed/20 text-quality-failed border-quality-failed/30 font-semibold">
            ⚠ Non-conforme
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-quality-pending/20 text-quality-pending border-quality-pending/30 font-semibold">
            ⏳ En attente
          </Badge>
        );
      case "review":
        return (
          <Badge className="bg-quality-review/20 text-quality-review border-quality-review/30 font-semibold">
            📋 Révision
          </Badge>
        );
      default:
        return null;
    }
  };

  const getQualityMetrics = () => {
    if (check.status === "passed") {
      return [
        { label: "Régularité surface", value: "97.2%" },
        { label: "Absence de fissures", value: "100%" },
        { label: "Conformité ferraillage", value: "95.8%" }
      ];
    }
    return [];
  };

  return (
    <Card className={cn(
      "construction-card overflow-hidden shadow-md hover:shadow-lg transition-all duration-300",
      check.status === "failed" ? "border-quality-failed/30 bg-quality-failed/5" : 
      check.status === "passed" ? "border-quality-passed/30 bg-quality-passed/5" :
      check.status === "pending" ? "border-quality-pending/30 bg-quality-pending/5" :
      "border-border"
    )}>
      {check.imageUrl && (
        <div className="relative overflow-hidden">
          <img 
            src={check.imageUrl} 
            alt={`Contrôle qualité - ${check.location}`}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            {getStatusIcon()}
          </div>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground" data-testid={`quality-check-title-${check.id}`}>
            {check.location}
          </h4>
          {getStatusBadge()}
        </div>
        
        {check.status === "passed" && (
          <div className="space-y-2 text-sm">
            {getQualityMetrics().map((metric, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-muted-foreground">{metric.label}:</span>
                <span className="text-green-600 font-medium">{metric.value}</span>
              </div>
            ))}
          </div>
        )}

        {check.status === "failed" && (
          <div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
              {check.notes}
            </p>
            {onCreateNonConformity && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={onCreateNonConformity}
                data-testid={`button-create-nonconformity-${check.id}`}
              >
                Créer Non-Conformité
              </Button>
            )}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Type: {check.checkType}</span>
            {check.aiScore && (
              <span>Score IA: {(parseFloat(check.aiScore) * 100).toFixed(1)}%</span>
            )}
          </div>
          {check.inspector && (
            <div className="text-xs text-muted-foreground mt-1">
              Inspecteur: {check.inspector}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
