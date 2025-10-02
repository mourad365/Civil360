'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ShoppingCart, Package, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PurchasingPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Achats</h1>
            <p className="text-muted-foreground">
              Gestion des commandes et fournisseurs
            </p>
          </div>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nouvelle Commande
          </Button>
        </div>

        {/* Purchase Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes Actives</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+5 cette semaine</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Validation requise</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Mensuel</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4M MRU</div>
              <p className="text-xs text-muted-foreground">68% utilisé</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fournisseurs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">32 actifs</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Commandes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 'CMD-2024-001',
                  supplier: 'SOMAC',
                  items: 'Ciment, Fer à béton',
                  amount: '245,000 MRU',
                  status: 'Livrée',
                  date: '2024-01-15'
                },
                {
                  id: 'CMD-2024-002',
                  supplier: 'Matériaux Mauritanie',
                  items: 'Agrégats, Sable',
                  amount: '180,000 MRU',
                  status: 'En transit',
                  date: '2024-01-16'
                },
                {
                  id: 'CMD-2024-003',
                  supplier: 'Quincaillerie Moderne',
                  items: 'Outillage divers',
                  amount: '95,000 MRU',
                  status: 'En attente',
                  date: '2024-01-17'
                },
                {
                  id: 'CMD-2024-004',
                  supplier: 'SOMAC',
                  items: 'Peinture, Revêtements',
                  amount: '320,000 MRU',
                  status: 'En préparation',
                  date: '2024-01-18'
                }
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-semibold">{order.id}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Livrée' 
                          ? 'bg-green-500/10 text-green-500'
                          : order.status === 'En transit'
                          ? 'bg-blue-500/10 text-blue-500'
                          : order.status === 'En attente'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-gray-500/10 text-gray-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Package className="h-3 w-3 mr-1" />
                        {order.supplier}
                      </div>
                      <div>{order.items}</div>
                      <div className="font-medium text-foreground">{order.amount}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Date: {new Date(order.date).toLocaleDateString('fr-FR')}
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
