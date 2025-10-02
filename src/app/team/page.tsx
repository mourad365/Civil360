'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, UserPlus, Award, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TeamPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Équipe</h1>
            <p className="text-muted-foreground">
              Gestion des membres et des équipes
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter Membre
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 ce mois</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipes Actives</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Sur 12 projets</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux Membres</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Moyenne</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5/5</div>
              <p className="text-xs text-muted-foreground">+0.3 ce trimestre</p>
            </CardContent>
          </Card>
        </div>

        {/* Teams by Project */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Équipes par Projet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  project: 'Construction Route Nationale N2',
                  teamSize: 45,
                  roles: { engineers: 8, workers: 32, supervisors: 5 },
                  leader: 'Ahmed Ould Mohamed'
                },
                {
                  project: 'Pont Tevragh Zeina',
                  teamSize: 28,
                  roles: { engineers: 5, workers: 20, supervisors: 3 },
                  leader: 'Fatima Mint Salem'
                },
                {
                  project: 'Immeuble Commercial Centre-Ville',
                  teamSize: 38,
                  roles: { engineers: 7, workers: 27, supervisors: 4 },
                  leader: 'Sidi Ould Cheikh'
                }
              ].map((team, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{team.project}</h3>
                      <p className="text-sm text-muted-foreground">Chef d'équipe: {team.leader}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{team.teamSize}</div>
                      <p className="text-xs text-muted-foreground">membres</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-muted-foreground">Ingénieurs:</span>
                      <span className="font-medium">{team.roles.engineers}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-muted-foreground">Ouvriers:</span>
                      <span className="font-medium">{team.roles.workers}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-muted-foreground">Superviseurs:</span>
                      <span className="font-medium">{team.roles.supervisors}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Membres de l'Équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Ahmed Ould Mohamed',
                  role: 'Ingénieur en Chef',
                  project: 'Route Nationale N2',
                  status: 'Actif',
                  rating: 4.8
                },
                {
                  name: 'Fatima Mint Salem',
                  role: 'Chef de Projet',
                  project: 'Pont Tevragh Zeina',
                  status: 'Actif',
                  rating: 4.9
                },
                {
                  name: 'Sidi Ould Cheikh',
                  role: 'Architecte',
                  project: 'Immeuble Commercial',
                  status: 'Actif',
                  rating: 4.7
                },
                {
                  name: 'Mariam Mint Abdallah',
                  role: 'Ingénieure Structurelle',
                  project: 'Route Nationale N2',
                  status: 'En formation',
                  rating: 4.5
                },
                {
                  name: 'Mohamed Ould Ahmed',
                  role: 'Chef de Chantier',
                  project: 'Pont Tevragh Zeina',
                  status: 'Actif',
                  rating: 4.6
                }
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{member.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.status === 'Actif' 
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {member.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{member.role}</span>
                        <span>{member.project}</span>
                        <div className="flex items-center">
                          <Award className="h-3 w-3 mr-1 text-yellow-500" />
                          <span>{member.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    Voir Profil
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
