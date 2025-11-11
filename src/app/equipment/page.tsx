'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Truck, Wrench, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EquipmentPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Équipements</h1>
            <p className="text-muted-foreground">
              Suivi et maintenance des équipements
            </p>
          </div>
          <Button>
            <Truck className="mr-2 h-4 w-4" />
            Ajouter Équipement
          </Button>
        </div>

        {/* Equipment Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Équipements</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 ce mois</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Service</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">91% disponibilité</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Retour prévu sous 3 jours</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hors Service</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Nécessite réparation</p>
            </CardContent>
          </Card>
        </div>

        {/* Equipment List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Liste des Équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Bulldozer CAT D8T',
                  category: 'Terrassement',
                  status: 'En service',
                  location: 'Route Nationale N2',
                  lastMaintenance: '2024-01-10',
                  nextMaintenance: '2024-02-10'
                },
                {
                  name: 'Grue Mobile Liebherr LTM 1050',
                  category: 'Levage',
                  status: 'En service',
                  location: 'Pont Tevragh Zeina',
                  lastMaintenance: '2024-01-05',
                  nextMaintenance: '2024-02-05'
                },
                {
                  name: 'Bétonnière IMER Workman II',
                  category: 'Béton',
                  status: 'En maintenance',
                  location: 'Atelier Central',
                  lastMaintenance: '2024-01-15',
                  nextMaintenance: '2024-01-20'
                },
                {
                  name: 'Compacteur Bomag BW 211',
                  category: 'Compactage',
                  status: 'Hors service',
                  location: 'Atelier Central',
                  lastMaintenance: '2024-01-12',
                  nextMaintenance: 'En attente de pièces'
                },
                {
                  name: 'Chargeuse Caterpillar 950M',
                  category: 'Chargement',
                  status: 'En service',
                  location: 'Centre-Ville',
                  lastMaintenance: '2024-01-08',
                  nextMaintenance: '2024-02-08'
                }
              ].map((equipment, index) => (
                <div key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <h3 className="font-semibold">{equipment.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        equipment.status === 'En service' 
                          ? 'bg-green-500/10 text-green-500'
                          : equipment.status === 'En maintenance'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {equipment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">Catégorie:</span> {equipment.category}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Localisation:</span> {equipment.location}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Dernière maintenance:</span> {new Date(equipment.lastMaintenance).toLocaleDateString('fr-FR')}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Prochaine maintenance:</span> {equipment.nextMaintenance}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto sm:ml-4 mt-2 sm:mt-0">
                    Gérer
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
