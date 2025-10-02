'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Building, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
            <p className="text-muted-foreground">
              Gestion et suivi de tous les projets
            </p>
          </div>
          <Button>
            <Building className="mr-2 h-4 w-4" />
            Nouveau Projet
          </Button>
        </div>

        {/* Project Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 ce mois</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Cours</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Active construction</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2M MRU</div>
              <p className="text-xs text-muted-foreground">Tous les projets</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipes Assignées</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Sur tous les sites</p>
            </CardContent>
          </Card>
        </div>

        {/* Project List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Liste des Projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Construction Route Nationale N2',
                  location: 'Nouakchott - Route de Rosso',
                  status: 'En cours',
                  progress: 75,
                  budget: '15.5M MRU',
                  team: 8
                },
                {
                  name: 'Pont Tevragh Zeina',
                  location: 'Nouakchott - Tevragh Zeina',
                  status: 'En cours',
                  progress: 45,
                  budget: '8.2M MRU',
                  team: 5
                },
                {
                  name: 'Immeuble Commercial Centre-Ville',
                  location: 'Nouakchott - Centre',
                  status: 'Planification',
                  progress: 15,
                  budget: '21.5M MRU',
                  team: 11
                }
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-semibold">{project.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'En cours' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {project.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {project.team} membres
                      </div>
                      <div>{project.budget}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="ml-4">
                    Voir Détails
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
