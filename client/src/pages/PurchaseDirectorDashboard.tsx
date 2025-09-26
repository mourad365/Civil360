import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Home,
  Calendar,
  FileText,
  Download,
  Share
} from "lucide-react";

export default function PurchaseDirectorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Vue Globale" },
    { id: "calendar", label: "Calendrier Livraisons" },
    { id: "orders", label: "Commandes en Cours" },
    { id: "suppliers", label: "Fournisseurs" },
    { id: "budget", label: "Suivi Budgétaire" },
    { id: "contracts", label: "Contrats & Devis" },
    { id: "reports", label: "Rapports" }
  ];

  const orders = [
    {
      project: "Lumia Tours",
      material: "Béton C25/30",
      supplier: "Lafarge",
      quantity: "94.40 m³",
      delivery: "16/09/2024",
      status: "delivered",
      amount: "14 160 €",
      delay: 0
    },
    {
      project: "Riviera",
      material: "Acier HA500 12mm",
      supplier: "Arcelor",
      quantity: "3 500 kg",
      delivery: "08/09/2024",
      status: "delayed",
      amount: "4 200 €",
      delay: 2
    },
    {
      project: "Pont Horizon",
      material: "Compacteur",
      supplier: "Kiloutou",
      quantity: "1 unité",
      delivery: "15/09/2024",
      status: "urgent",
      amount: "450 €/j",
      delay: 5
    },
    {
      project: "Axis",
      material: "Briques",
      supplier: "Wienerberger",
      quantity: "25 000 u",
      delivery: "12/09/2024",
      status: "delivered",
      amount: "8 750 €",
      delay: 0
    }
  ];

  const suppliers = [
    { name: "Lafarge", category: "Béton", rating: 9.2, orders: 12, onTimeRate: 92, status: "reliable" },
    { name: "Arcelor", category: "Acier", rating: 7.1, orders: 8, onTimeRate: 75, status: "monitoring" },
    { name: "Kiloutou", category: "Location", rating: 6.5, orders: 5, onTimeRate: 60, status: "alert" },
    { name: "Wienerberger", category: "Matériaux", rating: 8.8, orders: 7, onTimeRate: 89, status: "reliable" },
    { name: "Peri", category: "Coffrage", rating: 9.0, orders: 3, onTimeRate: 100, status: "reliable" }
  ];

  const budgetCategories = [
    { category: "Béton & Ciment", budget: 375000, committed: 268450, remaining: 106550, percentage: 72 },
    { category: "Acier", budget: 250000, committed: 198200, remaining: 51800, percentage: 79 },
    { category: "Bois & Coffrage", budget: 125000, committed: 87500, remaining: 37500, percentage: 70 },
    { category: "Équipements", budget: 75000, committed: 42300, remaining: 32700, percentage: 56 },
    { category: "Divers", budget: 25000, committed: 12800, remaining: 12200, percentage: 51 }
  ];

  const contracts = [
    { supplier: "Lafarge", type: "Accord-cadre", start: "01/01/2024", end: "31/12/2024", amount: "300 000 €", status: "active" },
    { supplier: "Arcelor", type: "Commande ferme", start: "15/08/2024", end: "30/09/2024", amount: "85 000 €", status: "active" },
    { supplier: "Kiloutou", type: "Location", start: "01/09/2024", end: "30/09/2024", amount: "12 000 €", status: "active" },
    { supplier: "Wienerberger", type: "Accord-cadre", start: "01/03/2024", end: "28/02/2025", amount: "120 000 €", status: "active" },
    { supplier: "Peri", type: "Commande spot", start: "10/09/2024", end: "25/09/2024", amount: "45 000 €", status: "active" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "delayed": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "urgent": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-500";
      case "delayed": return "text-yellow-500";
      case "urgent": return "text-red-500";
      case "reliable": return "text-green-500";
      case "monitoring": return "text-yellow-500";
      case "alert": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getSupplierStatus = (status: string) => {
    switch (status) {
      case "reliable": return "Fiable";
      case "monitoring": return "Suivi";
      case "alert": return "Alerte";
      default: return "";
    }
  };

  return (
    <DashboardLayout title="Tableau de Bord - Directeur Achats">
      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-3">
              Vision Complète – Tableau de bord Directeur d'Achat
            </h1>
            <p className="text-muted-foreground">
              Gestion des approvisionnements, fournisseurs et optimisation des coûts
            </p>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Section */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Vue Globale des Approvisionnements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">45</div>
                    <div className="text-sm text-muted-foreground">Cmd en cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">850K€</div>
                    <div className="text-sm text-muted-foreground">Budget mensuel</div>
                    <Progress value={71} className="mt-1" />
                    <div className="text-xs text-slate-500">71% utilisé</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">87%</div>
                    <div className="text-sm text-muted-foreground">Livraisons à l'heure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">12</div>
                    <div className="text-sm text-muted-foreground">Fournisseurs actifs</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge className="bg-red-600 mr-2">2 retards</Badge>
                  <Badge className="bg-yellow-600 mr-2">3 dépassements</Badge>
                  <Badge className="bg-green-600">15 livraisons sem.</Badge>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Répartition budgétaire</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Béton & Ciment: 45%</li>
                    <li>Acier: 25%</li>
                    <li>Bois & Coffrage: 15%</li>
                    <li>Équipements: 10%</li>
                    <li>Divers: 5%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendrier des Livraisons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 4).map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/20 border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium text-sm">{order.material}</p>
                          <p className="text-xs text-muted-foreground">{order.project} • {order.supplier}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{order.delivery}</p>
                        <p className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status === "delivered" ? "Livré" :
                           order.status === "delayed" ? `+${order.delay}j` : 
                           "Urgent"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Exporter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    Rappel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tableau des Commandes en Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Projet</th>
                      <th className="text-left p-3">Matériel</th>
                      <th className="text-left p-3">Fournisseur</th>
                      <th className="text-left p-3">Quantité</th>
                      <th className="text-left p-3">Livraison</th>
                      <th className="text-left p-3">Statut</th>
                      <th className="text-left p-3">Montant</th>
                      <th className="text-left p-3">Retard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="p-3 font-medium">{order.project}</td>
                        <td className="p-3">{order.material}</td>
                        <td className="p-3">{order.supplier}</td>
                        <td className="p-3">{order.quantity}</td>
                        <td className="p-3">{order.delivery}</td>
                        <td className="p-3">
                          <div className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="text-sm">
                              {order.status === "delivered" ? "Livré" :
                               order.status === "delayed" ? "En retard" : "Urgent"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">{order.amount}</td>
                        <td className="p-3">
                          {order.delay > 0 ? (
                            <span className="text-red-400">+{order.delay} jours</span>
                          ) : (
                            <span className="text-green-400">0 jour</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suppliers Section */}
        {activeTab === "suppliers" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Gestion des Fournisseurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Fournisseur</th>
                      <th className="text-left p-3">Catégorie</th>
                      <th className="text-left p-3">Note</th>
                      <th className="text-left p-3">Commandes</th>
                      <th className="text-left p-3">% à l'heure</th>
                      <th className="text-left p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="p-3 font-medium">{supplier.name}</td>
                        <td className="p-3">{supplier.category}</td>
                        <td className="p-3">
                          <span className="font-semibold">{supplier.rating}</span>
                          <span className="text-muted-foreground">/10</span>
                        </td>
                        <td className="p-3">{supplier.orders}</td>
                        <td className="p-3">{supplier.onTimeRate}%</td>
                        <td className="p-3">
                          <span className={getStatusColor(supplier.status)}>
                            {getSupplierStatus(supplier.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Section */}
        {activeTab === "budget" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Suivi Budgétaire Détaillé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Catégorie</th>
                      <th className="text-left p-3">Budget</th>
                      <th className="text-left p-3">Engagé</th>
                      <th className="text-left p-3">Restant</th>
                      <th className="text-left p-3">% Utilisé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetCategories.map((item, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="p-3 font-medium">{item.category}</td>
                        <td className="p-3">{item.budget.toLocaleString()} €</td>
                        <td className="p-3">{item.committed.toLocaleString()} €</td>
                        <td className="p-3">{item.remaining.toLocaleString()} €</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress value={item.percentage} className="w-16" />
                            <span className="text-sm">{item.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-600 font-semibold">
                      <td className="p-3">Total</td>
                      <td className="p-3">850 000 €</td>
                      <td className="p-3">609 250 €</td>
                      <td className="p-3">240 750 €</td>
                      <td className="p-3">71%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contracts Section */}
        {activeTab === "contracts" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Contrats & Devis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Fournisseur</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Début</th>
                      <th className="text-left p-3">Fin</th>
                      <th className="text-left p-3">Montant</th>
                      <th className="text-left p-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="p-3 font-medium">{contract.supplier}</td>
                        <td className="p-3">{contract.type}</td>
                        <td className="p-3">{contract.start}</td>
                        <td className="p-3">{contract.end}</td>
                        <td className="p-3">{contract.amount}</td>
                        <td className="p-3">
                          <Badge className="bg-green-600">Actif</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports Section */}
        {activeTab === "reports" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Rapports d'Achats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-white/20 border border-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-2">78 500 €</div>
                  <div className="text-sm text-muted-foreground">Économies réalisées</div>
                  <div className="text-xs text-green-400">(9%)</div>
                </div>
                <div className="text-center p-4 bg-white/20 border border-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">87%</div>
                  <div className="text-sm text-muted-foreground">Taux de service</div>
                </div>
                <div className="text-center p-4 bg-white/20 border border-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-2">2.3</div>
                  <div className="text-sm text-muted-foreground">Délai moyen livraison</div>
                  <div className="text-xs text-muted-foreground">(jours)</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Générer rapport
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exporter Excel
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Partager
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
