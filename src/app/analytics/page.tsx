'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyses</h1>
          <p className="text-muted-foreground">
            Statistiques et analyses détaillées
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52.3M MRU</div>
              <p className="text-xs text-muted-foreground">+18.2% vs mois dernier</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI Moyen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5%</div>
              <p className="text-xs text-muted-foreground">+2.1% ce trimestre</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Completion</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% ce mois</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Délai Moyen</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.2 mois</div>
              <p className="text-xs text-muted-foreground">-0.8 mois amélioration</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Performance par Projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Route Nationale N2', performance: 92, color: 'bg-green-500' },
                  { name: 'Pont Tevragh Zeina', performance: 78, color: 'bg-blue-500' },
                  { name: 'Immeuble Commercial', performance: 65, color: 'bg-yellow-500' },
                  { name: 'Infrastructure Hydraulique', performance: 88, color: 'bg-green-500' }
                ].map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-muted-foreground">{project.performance}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${project.color} transition-all`}
                        style={{ width: `${project.performance}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Budget vs Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: 'Matériaux', budget: 15000000, spent: 12500000 },
                  { category: 'Main d\'œuvre', budget: 8000000, spent: 7200000 },
                  { category: 'Équipements', budget: 12000000, spent: 9800000 },
                  { category: 'Logistique', budget: 5000000, spent: 4100000 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <div className="text-muted-foreground">
                        {(item.spent / 1000000).toFixed(1)}M / {(item.budget / 1000000).toFixed(1)}M MRU
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          (item.spent / item.budget) > 0.9 
                            ? 'bg-red-500' 
                            : (item.spent / item.budget) > 0.7 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(item.spent / item.budget) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Analyse Détaillée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Productivité Moyenne</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction Client</p>
                  <p className="text-2xl font-bold">4.8/5</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taux de Sécurité</p>
                  <p className="text-2xl font-bold">99.2%</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Tendances du Mois</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Augmentation de 15% de la productivité
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Réduction de 8% des coûts opérationnels
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Amélioration du délai de livraison de 12%
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
