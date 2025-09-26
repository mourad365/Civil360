import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Truck, 
  MapPin, 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Home,
  FileText,
  Download,
  Share,
  Settings
} from "lucide-react";

export default function LogisticsDirectorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Vue Globale" },
    { id: "inventory", label: "Inventaire" },
    { id: "transfers", label: "Transferts" },
    { id: "maintenance", label: "Maintenance" },
    { id: "rentals", label: "Locations" },
    { id: "reports", label: "Rapports" }
  ];

  const equipmentCategories = [
    { category: "Compacteurs", total: 15, available: 8, used: 5, maintenance: 1, broken: 1 },
    { category: "Vibrateurs", total: 12, available: 6, used: 4, maintenance: 2, broken: 0 },
    { category: "Grues", total: 8, available: 3, used: 4, maintenance: 1, broken: 0 },
    { category: "Bétonnières", total: 10, available: 4, used: 5, maintenance: 1, broken: 0 },
    { category: "Échafaudages", total: 13, available: 7, used: 6, maintenance: 0, broken: 0 }
  ];

  const transfers = [
    {
      date: "12/09/2024",
      equipment: "Compacteur C5",
      from: "Entrepôt",
      to: "Lumia Tours",
      status: "completed"
    },
    {
      date: "15/09/2024",
      equipment: "Grue G2",
      from: "Riviera",
      to: "Pont Horizon",
      status: "delayed"
    },
    {
      date: "16/09/2024",
      equipment: "Vibrateur V8",
      from: "Axis",
      to: "Lumia Tours",
      status: "in-progress"
    },
    {
      date: "18/09/2024",
      equipment: "Bétonnière B3",
      from: "Entrepôt",
      to: "Riviera",
      status: "planned"
    }
  ];

  const maintenanceSchedule = [
    {
      equipment: "Compacteur C5",
      lastMaintenance: "15/08/2024",
      nextMaintenance: "15/10/2024",
      type: "Préventive",
      supplier: "Volvo"
    },
    {
      equipment: "Grue G2",
      lastMaintenance: "01/09/2024",
      nextMaintenance: "01/12/2024",
      type: "Révision",
      supplier: "Liebherr"
    },
    {
      equipment: "Vibrateur V8",
      lastMaintenance: "20/07/2024",
      nextMaintenance: "20/10/2024",
      type: "Vérification",
      supplier: "Wacker Neuson"
    },
    {
      equipment: "Bétonnière B3",
      lastMaintenance: "05/09/2024",
      nextMaintenance: "05/12/2024",
      type: "Préventive",
      supplier: "Mercedes"
    }
  ];

  const rentals = [
    {
      equipment: "Compacteur",
      supplier: "Kiloutou",
      start: "01/09/2024",
      end: "30/09/2024",
      cost: "450 €/j",
      status: "active"
    },
    {
      equipment: "Grue 50T",
      supplier: "Loxam",
      start: "15/08/2024",
      end: "15/10/2024",
      cost: "800 €/j",
      status: "active"
    },
    {
      equipment: "Bétonnière",
      supplier: "Fraikin",
      start: "01/09/2024",
      end: "30/09/2024",
      cost: "300 €/j",
      status: "active"
    },
    {
      equipment: "Vibrateur",
      supplier: "Kiloutou",
      start: "10/09/2024",
      end: "10/10/2024",
      cost: "150 €/j",
      status: "active"
    }
  ];

  const equipmentLocations = [
    { name: "Lumia Tours", location: "Paris", equipment: "3 équipements", status: "on-track" },
    { name: "Résidence Riviera", location: "Lyon", equipment: "2 équipements", status: "attention" },
    { name: "Pont Horizon", location: "Marseille", equipment: "1 équipement", status: "alert" },
    { name: "Centre Commercial Axis", location: "Bordeaux", equipment: "2 équipements", status: "on-track" },
    { name: "Entrepôt Central", location: "Villejuif", equipment: "12 équipements", status: "storage" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "delayed": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "planned": return <Calendar className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500";
      case "in-progress": return "text-yellow-500";
      case "delayed": return "text-red-500";
      case "planned": return "text-blue-500";
      case "on-track": return "text-green-500";
      case "attention": return "text-yellow-500";
      case "alert": return "text-red-500";
      case "storage": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "on-track": return "bg-green-500";
      case "attention": return "bg-yellow-500";
      case "alert": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTransferStatus = (status: string) => {
    switch (status) {
      case "completed": return "Terminé";
      case "in-progress": return "En cours";
      case "delayed": return "Retard";
      case "planned": return "Planifié";
      default: return "";
    }
  };
  return (
    <DashboardLayout title="Tableau de Bord - Directeur Logistique">
      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-3">
              Vision Complète – Tableau de bord Directeur Logistique
            </h1>
            <p className="text-muted-foreground">
              Gestion du parc matériel, maintenance et optimisation logistique
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
                <CardTitle>Vue Globale du Parc Matériel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">58</div>
                    <div className="text-sm text-muted-foreground">Équipements actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">82%</div>
                    <div className="text-sm text-muted-foreground">Taux d'utilisation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">45K€</div>
                    <div className="text-sm text-muted-foreground">Coût location mensuel</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">92%</div>
                    <div className="text-sm text-muted-foreground">Transferts à l'heure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">2</div>
                    <div className="text-sm text-muted-foreground">Maintenances prév.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">12</div>
                    <div className="text-sm text-muted-foreground">Transferts semaine</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Répartition du parc</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Compactage: 35%</li>
                    <li>Levage: 25%</li>
                    <li>Bétonnage: 20%</li>
                    <li>Divers: 20%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Carte des Équipements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-muted-foreground mb-4">
                  (Localisation temps réel – Paris, Lyon, Marseille, Bordeaux, Entrepôt)
                </div>
                <div className="flex gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Disponible
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Utilisé
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    En panne
                  </span>
                </div>
                
                <div className="space-y-2">
                  {equipmentLocations.map((location, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-white/20 border border-white/10 rounded">
                      <div className={`w-2 h-2 rounded-full ${getStatusDot(location.status)}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{location.name}</p>
                        <p className="text-xs text-muted-foreground">{location.location}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{location.equipment}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inventory Section */}
        {activeTab === "inventory" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Inventaire des Équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Catégorie</th>
                      <th className="text-left p-3">Total</th>
                      <th className="text-left p-3">Disponible</th>
                      <th className="text-left p-3">Utilisé</th>
                      <th className="text-left p-3">Maint.</th>
                      <th className="text-left p-3">Panne</th>
                      <th className="text-left p-3">Taux d'utilisation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentCategories.map((category, index) => (
                      <tr key={index} className="border-b border-slate-700">
                        <td className="p-3 font-medium">{category.category}</td>
                        <td className="p-3">{category.total}</td>
                        <td className="p-3 text-green-400">{category.available}</td>
                        <td className="p-3 text-blue-400">{category.used}</td>
                        <td className="p-3 text-yellow-400">{category.maintenance}</td>
                        <td className="p-3 text-red-400">{category.broken}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={Math.round((category.used / category.total) * 100)} 
                              className="w-16" 
                            />
                            <span className="text-sm">
                              {Math.round((category.used / category.total) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-600 font-semibold">
                      <td className="p-3">Total</td>
                      <td className="p-3">58</td>
                      <td className="p-3 text-green-400">28 (48%)</td>
                      <td className="p-3 text-blue-400">24 (41%)</td>
                      <td className="p-3 text-yellow-400">5 (9%)</td>
                      <td className="p-3 text-red-400">1 (2%)</td>
                      <td className="p-3">82% global</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transfers Section */}
        {activeTab === "transfers" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Gestion des Transferts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Équipement</th>
                      <th className="text-left p-3">Depuis</th>
                      <th className="text-left p-3">Vers</th>
                      <th className="text-left p-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((transfer, index) => (
                      <tr key={index} className="border-b border-slate-700">
                        <td className="p-3">{transfer.date}</td>
                        <td className="p-3 font-medium">{transfer.equipment}</td>
                        <td className="p-3">{transfer.from}</td>
                        <td className="p-3">{transfer.to}</td>
                        <td className="p-3">
                          <div className={`flex items-center gap-2 ${getStatusColor(transfer.status)}`}>
                            {getStatusIcon(transfer.status)}
                            <span className="text-sm">{getTransferStatus(transfer.status)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Programmer
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Disponibilité
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alerter équipe
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Maintenance Section */}
        {activeTab === "maintenance" && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Préventive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-3">Équipement</th>
                        <th className="text-left p-3">Dernière maint.</th>
                        <th className="text-left p-3">Prochaine</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Fournisseur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenanceSchedule.map((item, index) => (
                        <tr key={index} className="border-b border-slate-700">
                          <td className="p-3 font-medium">{item.equipment}</td>
                          <td className="p-3">{item.lastMaintenance}</td>
                          <td className="p-3">{item.nextMaintenance}</td>
                          <td className="p-3">{item.type}</td>
                          <td className="p-3">{item.supplier}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/20 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-400">Maintenances Urgentes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="text-red-300">• Compacteur C1 (Marseille): huile moteur à changer – 5h</li>
                  <li className="text-red-300">• Vibrateur V3 (Lyon): vérification circuit électrique – 2h</li>
                </ul>
                
                <div className="flex gap-2 mt-4">
                  <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
                    <Settings className="h-4 w-4" />
                    Planifier intervention
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 border-red-400 text-red-400">
                    <Truck className="h-4 w-4" />
                    Commander pièces
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Historique
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rentals Section */}
        {activeTab === "rentals" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Gestion des Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Équipement</th>
                      <th className="text-left p-3">Fournisseur</th>
                      <th className="text-left p-3">Début</th>
                      <th className="text-left p-3">Fin</th>
                      <th className="text-left p-3">Coût</th>
                      <th className="text-left p-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.map((rental, index) => (
                      <tr key={index} className="border-b border-slate-700">
                        <td className="p-3 font-medium">{rental.equipment}</td>
                        <td className="p-3">{rental.supplier}</td>
                        <td className="p-3">{rental.start}</td>
                        <td className="p-3">{rental.end}</td>
                        <td className="p-3">{rental.cost}</td>
                        <td className="p-3">
                          <Badge className="bg-green-600">Actif</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-white/20 border border-white/10 p-4 rounded-lg mb-4">
                <p className="text-sm">
                  <strong>Coût mensuel total:</strong> <span className="text-green-400">45 000 €</span> • 
                  <strong> Économies vs achat:</strong> <span className="text-blue-400">12 000 €</span>
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Renouveler
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Réserver
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Négocier tarif
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports Section */}
        {activeTab === "reports" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Rapports Logistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-white/20 border border-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-2">78 500 €</div>
                  <div className="text-sm text-muted-foreground">Économies réalisées</div>
                  <div className="text-xs text-green-400">(9%)</div>
                </div>
                <div className="text-center p-4 bg-white/20 border border-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">92%</div>
                  <div className="text-sm text-muted-foreground">Taux de disponibilité</div>
                </div>
                <div className="text-center p-4 bg-white/20 border border-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-2">1.7</div>
                  <div className="text-sm text-muted-foreground">Délai moyen transfert</div>
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
