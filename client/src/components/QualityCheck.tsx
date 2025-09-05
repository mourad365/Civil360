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
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            ✓ Conforme
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
            ⚠ Non-conforme
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
            ⏳ En attente
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
      "overflow-hidden",
      check.status === "failed" ? "border-orange-200 bg-orange-50 dark:bg-orange-950" : "border-border"
    )}>
      {check.imageUrl && (
        <img 
          src={check.imageUrl} 
          alt={`Contrôle qualité - ${check.location}`}
          className="w-full h-48 object-cover"
        />
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
