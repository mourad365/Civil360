'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
            <p className="text-muted-foreground">
              Génération et consultation des rapports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Nouveau Rapport
            </Button>
          </div>
        </div>

        {/* Report Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rapports ce Mois</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+6 vs mois dernier</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">À valider</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archivés</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">Total historique</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Categories */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Rapports de Projet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Rapports d'avancement et de performance des projets
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Générer Rapport
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Rapports Financiers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analyses budgétaires et dépenses
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Générer Rapport
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Rapports d'Équipement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                État et maintenance des équipements
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Générer Rapport
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Rapports Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: 'Rapport Mensuel - Janvier 2024',
                  type: 'Projet',
                  date: '2024-01-31',
                  status: 'Validé',
                  size: '2.4 MB'
                },
                {
                  title: 'Analyse Financière Q4 2023',
                  type: 'Financier',
                  date: '2024-01-15',
                  status: 'Validé',
                  size: '1.8 MB'
                },
                {
                  title: 'État des Équipements - Semaine 3',
                  type: 'Équipement',
                  date: '2024-01-20',
                  status: 'En attente',
                  size: '856 KB'
                },
                {
                  title: 'Performance Projets - Bilan Annuel',
                  type: 'Projet',
                  date: '2024-01-10',
                  status: 'Validé',
                  size: '5.2 MB'
                },
                {
                  title: 'Rapport Sécurité - Janvier',
                  type: 'Sécurité',
                  date: '2024-01-28',
                  status: 'En attente',
                  size: '1.2 MB'
                }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{report.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          report.status === 'Validé' 
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{report.type}</span>
                        <span>{new Date(report.date).toLocaleDateString('fr-FR')}</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
