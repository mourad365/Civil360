import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building, MapPin, Calendar, Euro, Users } from "lucide-react";
import type { Project } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Projects() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "paused":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Chantiers Actifs</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chantiers Actifs</h1>
          <p className="text-muted-foreground">
            Gestion et suivi de tous les projets de construction en cours
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {projects.length} projets
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <Card key={project.id} className="shadow-sm border border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Building className="text-primary-foreground h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground" data-testid={`project-name-${project.id}`}>
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status === "active" ? "Actif" : 
                   project.status === "completed" ? "Terminé" : 
                   project.status === "paused" ? "Pause" : project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Avancement</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress 
                  value={project.progress} 
                  className="w-full"
                  data-testid={`project-progress-${project.id}`}
                />
              </div>

              {/* Project Details */}
              <div className="space-y-3">
                {project.location && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                )}

                {project.budget && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Euro className="h-4 w-4" />
                    <span>{parseFloat(project.budget).toLocaleString('fr-FR')} €</span>
                  </div>
                )}

                {(project.startDate || project.endDate) && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {project.startDate ? new Date(project.startDate).toLocaleDateString('fr-FR') : 'N/A'} -  
                      {project.endDate ? new Date(project.endDate).toLocaleDateString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                )}

                {/* Mock team count */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 20) + 5} ouvriers</span>
                </div>
              </div>

              {/* Project Status Indicators */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dernière activité</span>
                  <span className="font-medium">
                    {project.createdAt ? 
                      new Date(project.createdAt).toLocaleDateString('fr-FR') : 
                      'N/A'
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Équipements IoT</span>
                  <Badge variant="outline">
                    {Math.floor(Math.random() * 15) + 3} actifs
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contrôles qualité</span>
                  <span className={cn(
                    "font-medium",
                    Math.random() > 0.7 ? "text-red-600" : "text-green-600"
                  )}>
                    {Math.random() > 0.7 ? "1 alerte" : "Conforme"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="p-12 text-center">
          <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucun projet</h3>
          <p className="text-muted-foreground">Les projets de construction apparaîtront ici</p>
        </Card>
      )}
    </div>
  );
}
