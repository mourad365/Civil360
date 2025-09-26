import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Euro, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  MapPin,
  Calendar,
  FileText,
  Home
} from "lucide-react";

export default function DirectorGeneralDashboard() {
  const [activeTab, setActiveTab] = useState("kpis");

  const tabs = [
    { id: "kpis", label: "KPIs" },
    { id: "map", label: "Carte" },
    { id: "projects", label: "Projets" },
    { id: "finance", label: "Finance" },
    { id: "resources", label: "Ressources" },
    { id: "calendar", label: "Calendrier" },
    { id: "alerts", label: "Alertes" },
    { id: "reports", label: "Rapports" }
  ];

  const projects = [
    {
      name: "Lumia Tours",
      progress: 75,
      budget: { used: 4.5, total: 5.0 },
      delay: -3,
      risks: "Dépassement béton prévu",
      location: "Paris",
      status: "on-track"
    },
    {
      name: "Résidence Riviera",
      progress: 40,
      budget: { used: 2.8, total: 3.2 },
      delay: 7,
      risks: "Retard approvision.",
      location: "Lyon",
      status: "attention"
    },
    {
      name: "Pont Horizon",
      progress: 15,
      budget: { used: 1.2, total: 1.5 },
      delay: 0,
      risks: "Météo défavorable",
      location: "Marseille",
      status: "alert"
    },
    {
      name: "Centre Commercial Axis",
      progress: 90,
      budget: { used: 4.2, total: 4.5 },
      delay: -2,
      risks: "Aucun",
      location: "Bordeaux",
      status: "on-track"
    }
  ];

  const alerts = {
    urgent: [
      "Rupture stock ciment – Riviera",
      "Retard livraison acier – 5 jours"
    ],
    attention: [
      "Dépassement budget MO – Lumia (+8%)",
      "Alerte météo – Vent fort jeudi"
    ],
    info: [
      "Livraison réussie – Bois charpente",
      "Réunion planifiée – Client Axis 10h"
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "text-green-600";
      case "attention": return "text-yellow-600";
      case "alert": return "text-red-600";
      default: return "text-gray-600";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header Toolbar */}
      <header className="sticky top-0 z-20 bg-slate-900/75 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-6 py-3">
          <strong className="text-xl tracking-wider">CIVIL360</strong>
          <nav className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Badge className="mb-4 bg-blue-600">
                  Présentation: <strong>CIVIL360</strong>
                </Badge>
                <h1 className="text-3xl font-bold mb-3">
                  Vision Complète – Tableau de bord Directeur Général
                </h1>
                <p className="text-slate-300 mb-4">
                  Centraliser l'information • Synchroniser les actions • Optimiser les ressources
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-600">Réduction délais ≤ 15%</Badge>
                  <Badge className="bg-green-600">Dépassements budget ↓ 20%</Badge>
                  <Badge className="bg-blue-600">Visibilité temps réel</Badge>
                </div>
              </div>
              <Card className="bg-slate-600 border-slate-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Indicateurs clés du mois</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-300">Projets actifs</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div>
                      <p className="text-slate-300">Budget total</p>
                      <p className="text-lg font-bold">15.8M€ / 17.2M€</p>
                      <p className="text-slate-400">(92%)</p>
                    </div>
                    <div>
                      <p className="text-slate-300">Avancement global</p>
                      <Progress value={68} className="mt-1" />
                      <p className="text-sm text-slate-400">68%</p>
                    </div>
                    <div>
                      <p className="text-slate-300">Collaborateurs actifs</p>
                      <p className="text-2xl font-bold">87</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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

        {/* KPIs Section */}
        {activeTab === "kpis" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-400" />
                  Projets Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">12</div>
                <p className="text-sm text-slate-400">+2 ce mois</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-green-400" />
                  Budget Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">15.8M€ / 17.2M€</div>
                <Progress value={92} className="mb-2" />
                <p className="text-sm text-slate-400">92% utilisé</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Avancement Global
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={68} className="mb-2" />
                <div className="text-2xl font-bold mb-2">68%</div>
                <p className="text-sm text-slate-400">Moyenne pondérée</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-400" />
                  Collaborateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">87</div>
                <p className="text-sm text-slate-400">Sur site actif</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Délai Moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-green-400">-2 jours</div>
                <p className="text-sm text-slate-400">En avance</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle>Alertes Actives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className="bg-red-600">3 projets en dérive</Badge>
                <Badge className="bg-green-600">5 livraisons semaine</Badge>
                <Badge className="bg-yellow-600">2 équipements panne</Badge>
                <Badge className="bg-orange-600">1 rupture stock</Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Map Section */}
        {activeTab === "map" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-400" />
                  Carte Interactive des Chantiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-slate-400">
                  (Carte interactive – Paris, Lyon, Marseille, Bordeaux)
                </div>
                <div className="flex gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Dans les temps
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Attention
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    En alerte
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle>État des Chantiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects.map((project) => (
                  <div key={project.name} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getStatusDot(project.status)}`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-slate-400">{project.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.progress}%</p>
                      <p className="text-xs text-slate-400">Avancement</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects Section */}
        {activeTab === "projects" && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle>Détail des Projets en Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Projet</th>
                      <th className="text-left p-3">Avancement</th>
                      <th className="text-left p-3">Budget</th>
                      <th className="text-left p-3">Délai</th>
                      <th className="text-left p-3">Risques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.name} className="border-b border-slate-700">
                        <td className="p-3 font-medium">{project.name}</td>
                        <td className="p-3">
                          <div className="w-32">
                            <Progress value={project.progress} className="mb-1" />
                            <span className="text-sm text-slate-400">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">
                            {project.budget.used}M€ / {project.budget.total}M€
                          </span>
                          <br />
                          <span className="text-xs text-slate-400">
                            ({Math.round((project.budget.used / project.budget.total) * 100)}%)
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={project.delay < 0 ? "text-green-400" : project.delay > 0 ? "text-red-400" : "text-slate-400"}>
                            {project.delay === 0 ? "Dans temps" : 
                             project.delay < 0 ? `${Math.abs(project.delay)} jours avance` : 
                             `+${project.delay} jours`}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-slate-400">{project.risks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerts Section */}
        {activeTab === "alerts" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-red-900/20 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  🔴 Urgent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {alerts.urgent.map((alert, index) => (
                    <li key={index} className="text-red-300">• {alert}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-yellow-900/20 border-yellow-600">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  🟡 Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {alerts.attention.map((alert, index) => (
                    <li key={index} className="text-yellow-300">• {alert}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 border-green-600">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  🟢 Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {alerts.info.map((alert, index) => (
                    <li key={index} className="text-green-300">• {alert}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Section */}
        {activeTab === "reports" && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle>Rapports Automatiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="flex items-center gap-2 h-auto p-4 flex-col">
                  <FileText className="h-6 w-6" />
                  <span>Rapport Hebdomadaire</span>
                </Button>
                <Button className="flex items-center gap-2 h-auto p-4 flex-col">
                  <FileText className="h-6 w-6" />
                  <span>Rapport Mensuel</span>
                </Button>
                <Button className="flex items-center gap-2 h-auto p-4 flex-col">
                  <FileText className="h-6 w-6" />
                  <span>Rapport Trimestriel</span>
                </Button>
                <Button className="flex items-center gap-2 h-auto p-4 flex-col">
                  <FileText className="h-6 w-6" />
                  <span>Rapport Personnalisé</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
