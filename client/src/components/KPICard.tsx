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
  iconBgColor = "bg-construction-steel", 
  trend,
  className 
}: KPICardProps) {
  return (
    <Card className={cn(
      "construction-card shadow-lg border border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm", 
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn(
            "p-3 rounded-xl shadow-inner", 
            iconBgColor,
            "bg-gradient-to-br from-construction-steel to-construction-steel/80"
          )}>
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1 bg-gradient-to-r from-construction-steel to-construction-orange bg-clip-text text-transparent" 
               data-testid={`kpi-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            {(description || trend) && (
              <div className="flex items-center justify-between mt-2">
                {description && (
                  <p className="text-sm text-muted-foreground font-medium">{description}</p>
                )}
                {trend && (
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold",
                    trend.positive 
                      ? "bg-construction-safety-green/20 text-construction-safety-green" 
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                  )}>
                    {trend.value}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
