import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  FileText, 
  Upload, 
  Play, 
  Sparkles, 
  Home,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

export default function EngineerDashboard() {
  const [activeTab, setActiveTab] = useState("project-config");

  const tabs = [
    { id: "project-config", label: "Configuration Projet" },
    { id: "structure", label: "Structure" },
    { id: "technical", label: "Saisie Technique" },
    { id: "planning", label: "Planning" },
    { id: "orders", label: "Commandes" },
    { id: "journal", label: "Journal Chantier" },
    { id: "cad-import", label: "Import CAO/BIM" },
    { id: "calculations", label: "Calculs Structurels" }
  ];

  const levels = [
    { name: "Fondations", type: "Infrastructure", surface: 850, height: -3.00, thickness: 40 },
    { name: "Sous-sol", type: "Souterrain", surface: 800, height: -2.40, thickness: 35 },
    { name: "RDC", type: "Étage", surface: 750, height: 0.00, thickness: 30 },
    { name: "Étage 1", type: "Étage", surface: 720, height: 3.50, thickness: 25 },
    { name: "Étage 2", type: "Étage", surface: 720, height: 7.00, thickness: 25 },
    { name: "Toiture", type: "Finition", surface: 700, height: 35.00, thickness: 20 }
  ];

  const materials = [
    { name: "Béton C25/30", quantity: 94.40, unit: "m³", unitPrice: 150, total: 14160, supplier: "Lafarge" },
    { name: "Acier HA500", quantity: 5930, unit: "kg", unitPrice: 1.20, total: 7116, supplier: "Arcelor" },
    { name: "Coffrage", quantity: 320, unit: "m²", unitPrice: 45, total: 14400, supplier: "Peri" },
    { name: "Main d'œuvre", quantity: 240, unit: "h", unitPrice: 65, total: 15600, supplier: "Interne" }
  ];

  const planningTasks = [
    { phase: "Terrassement", start: "01/09/2024", end: "05/09/2024", duration: "5 j", team: "Équipe A", status: "completed", progress: 100 },
    { phase: "Coffrage", start: "06/09/2024", end: "12/09/2024", duration: "7 j", team: "Équipe B", status: "in-progress", progress: 65 },
    { phase: "Ferraillage", start: "08/09/2024", end: "15/09/2024", duration: "8 j", team: "Équipe C", status: "in-progress", progress: 40 },
    { phase: "Bétonnage", start: "16/09/2024", end: "18/09/2024", duration: "3 j", team: "Équipe D", status: "pending", progress: 0 },
    { phase: "Décoffrage", start: "19/09/2024", end: "20/09/2024", duration: "2 j", team: "Équipe B", status: "pending", progress: 0 }
  ];

  const structuralElements = [
    { element: "Semelle S1", section: "1.2×1.2 m", load: "850 kN", capacity: "920 kN", status: "validated" },
    { element: "Longrine L2", section: "0.3×0.5 m", load: "120 kN/m", capacity: "135 kN/m", status: "validated" },
    { element: "Poteau P3", section: "0.3×0.3 m", load: "1 200 kN", capacity: "1 150 kN", status: "critical" },
    { element: "Dalle D1", section: "0.25 m", load: "8.5 kN/m²", capacity: "9.2 kN/m²", status: "validated" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500";
      case "in-progress": return "text-yellow-500";
      case "pending": return "text-gray-500";
      case "validated": return "text-green-500";
      case "critical": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-900/75 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-6 py-3">
          <strong className="text-xl tracking-wider">CIVIL360</strong>
          <Badge className="bg-blue-600">Ingénieur</Badge>
          <nav className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-3">
              Vision Complète – Tableau de bord Ingénieur
            </h1>
            <p className="text-slate-300">
              Gestion technique, calculs structurels et suivi détaillé des projets
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

        {/* Project Configuration */}
        {activeTab === "project-config" && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle>Création & Configuration du Projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Nom du projet</Label>
                  <Input defaultValue="Tour Lumia" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <Input defaultValue="Paris 15ᵉ" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input defaultValue="Bureaux" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="space-y-2">
                  <Label>Durée</Label>
                  <Input defaultValue="12 mois" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input defaultValue="5 000 000 €" className="bg-slate-700 border-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structure Definition */}
        {activeTab === "structure" && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle>Définition de la Structure (Niveaux)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Niveau</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Surface (m²)</th>
                      <th className="text-left p-3">Hauteur (m)</th>
                      <th className="text-left p-3">Ép. dalle (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map((level, index) => (
                      <tr key={index} className="border-b border-slate-700">
                        <td className="p-3 font-medium">{level.name}</td>
                        <td className="p-3">{level.type}</td>
                        <td className="p-3">{level.surface}</td>
                        <td className="p-3">{level.height > 0 ? `+${level.height.toFixed(2)}` : level.height.toFixed(2)}</td>
                        <td className="p-3">{level.thickness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Input */}
        {activeTab === "technical" && (
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle>Saisie Technique – Fondations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Semelles isolées</h4>
                      <p className="text-sm text-slate-400">
                        Nb: 24 • 1.2×1.2×0.8 m • Béton C25/30 • HA500<br />
                        Volumes: 27.65 m³ béton • 1 850 kg acier
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Longrines</h4>
                      <p className="text-sm text-slate-400">
                        125 ml • 0.3×0.5 m • C25/30 • HA500<br />
                        18.75 m³ béton • 1 200 kg acier
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Radier</h4>
                      <p className="text-sm text-slate-400">
                        120 m² • e=0.4 m • C25/30 • HA500<br />
                        48.00 m³ béton • 2 880 kg acier
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-4">Besoins matériaux – Fondations</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-600">
                            <th className="text-left p-2">Matériau</th>
                            <th className="text-left p-2">Qté</th>
                            <th className="text-left p-2">PU</th>
                            <th className="text-left p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {materials.map((material, index) => (
                            <tr key={index} className="border-b border-slate-700">
                              <td className="p-2">{material.name}</td>
                              <td className="p-2">{material.quantity} {material.unit}</td>
                              <td className="p-2">{material.unitPrice} €</td>
                              <td className="p-2">{material.total.toLocaleString()} €</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 p-2 bg-slate-700 rounded">
                      <strong>Total fondations: 51 276 €</strong>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Planning */}
        {activeTab === "planning" && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle>Planning – Fondations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Phase</th>
                      <th className="text-left p-3">Début</th>
                      <th className="text-left p-3">Fin</th>
                      <th className="text-left p-3">Durée</th>
                      <th className="text-left p-3">Équipe</th>
                      <th className="text-left p-3">Statut</th>
                      <th className="text-left p-3">Avancement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planningTasks.map((task, index) => (
                      <tr key={index} className="border-b border-slate-700">
                        <td className="p-3 font-medium">{task.phase}</td>
                        <td className="p-3">{task.start}</td>
                        <td className="p-3">{task.end}</td>
                        <td className="p-3">{task.duration}</td>
                        <td className="p-3">{task.team}</td>
                        <td className="p-3">
                          <div className={`flex items-center gap-2 ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            <span className="text-sm">
                              {task.status === "completed" ? "Terminé" :
                               task.status === "in-progress" ? "En cours" : "À venir"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="w-24">
                            <Progress value={task.progress} className="mb-1" />
                            <span className="text-xs text-slate-400">{task.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CAD/BIM Import */}
        {activeTab === "cad-import" && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import des Plans (CAO/BIM)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                  <p className="text-slate-400 mb-2">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                  <p className="text-sm text-slate-500">Formats supportés: .dwg, .pdf, .rvt, .ifc</p>
                  <Button className="mt-4">
                    <Upload className="h-4 w-4 mr-2" />
                    Choisir les fichiers
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Fichiers importés:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Plan de masse.dwg – 1/200
                    </li>
                    <li className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Plan fondations.pdf – 1/100
                    </li>
                    <li className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Coupe structurelle.dwg – 1/50
                    </li>
                    <li className="flex items-center gap-2 text-yellow-400">
                      <Clock className="h-4 w-4" />
                      Plan étage 1.pdf – en cours d'analyse
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Fonctionnalités d'analyse:</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Extraction automatique des cotes</li>
                    <li>• Reconnaissance d'éléments structurels</li>
                    <li>• Vérification d'incohérences</li>
                    <li>• Génération automatique du métré</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structural Calculations */}
        {activeTab === "calculations" && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Module de Calcul Structural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left p-3">Élément</th>
                      <th className="text-left p-3">Section</th>
                      <th className="text-left p-3">Charge</th>
                      <th className="text-left p-3">Capacité</th>
                      <th className="text-left p-3">Statut</th>
                      <th className="text-left p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {structuralElements.map((element, index) => (
                      <tr key={index} className="border-b border-slate-700">
                        <td className="p-3 font-medium">{element.element}</td>
                        <td className="p-3">{element.section}</td>
                        <td className="p-3">{element.load}</td>
                        <td className="p-3">{element.capacity}</td>
                        <td className="p-3">
                          <div className={`flex items-center gap-2 ${getStatusColor(element.status)}`}>
                            {element.status === "validated" ? 
                              <CheckCircle className="h-4 w-4" /> : 
                              <AlertCircle className="h-4 w-4" />
                            }
                            <span className="text-sm">
                              {element.status === "validated" ? "Validé" : "Critique"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {element.status === "critical" && (
                            <Button size="sm" variant="outline" className="text-orange-400 border-orange-400">
                              Redimensionner
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Lancer les calculs
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Optimiser auto
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Générer note de calcul
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
