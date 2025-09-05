import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  iconBgColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export default function KPICard({ 
  title, 
  value, 
  description, 
  icon, 
  iconBgColor = "bg-primary", 
  trend,
  className 
}: KPICardProps) {
  return (
    <Card className={cn("shadow-sm border border-border", className)}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("p-3 rounded-lg", iconBgColor)}>
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground" data-testid={`kpi-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            {(description || trend) && (
              <div className="flex items-center justify-between mt-1">
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
                {trend && (
                  <p className={cn(
                    "text-sm font-medium",
                    trend.positive ? "text-green-600" : "text-red-600"
                  )}>
                    {trend.value}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
