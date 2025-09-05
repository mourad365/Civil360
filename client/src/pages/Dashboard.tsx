import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import KPICard from "@/components/KPICard";
import AIProcessing from "@/components/AIProcessing";
import IoTDevice from "@/components/IoTDevice";
import QualityCheck from "@/components/QualityCheck";
import MobilePreview from "@/components/MobilePreview";
import OdooSync from "@/components/OdooSync";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building, Users, AlertTriangle, TrendingUp, Lightbulb, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: aiAnalyses = [] } = useQuery({
    queryKey: ["/api/ai/analysis"],
  });

  const { data: iotEquipment = [] } = useQuery({
    queryKey: ["/api/iot/equipment"],
  });

  const { data: qualityChecks = [] } = useQuery({
    queryKey: ["/api/quality/checks"],
  });

  const { data: odooSyncStatus = [] } = useQuery({
    queryKey: ["/api/odoo/sync-status"],
  });

  const handleUploadPlan = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'upload de plans CAO/BIM sera disponible prochainement",
    });
  };

  const handleLocateEquipment = () => {
    toast({
      title: "Localisation activée",
      description: "Géolocalisation GPS de l'équipement en cours...",
    });
  };

  const handleCreateNonConformity = () => {
    toast({
      title: "Non-conformité créée",
      description: "Rapport de non-conformité généré et assigné",
    });
  };

  const handleTriggerSync = async (entityType: string) => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/odoo/sync-status"] });
      toast({
        title: "Synchronisation lancée",
        description: `Sync ${entityType} avec Odoo ERP initiée`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de lancer la synchronisation",
        variant: "destructive",
      });
    }
  };

  if (statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card p-6 rounded-lg border animate-pulse">
              <div className="h-16 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Chantiers Actifs"
          value={stats?.activeProjects || 0}
          description="+2 ce mois"
          icon={<Building className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-100 dark:bg-green-900"
        />
        
        <KPICard
          title="Équipes sur Site"
          value={stats?.activeTeams || 0}
          description="94% présence"
          icon={<Users className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900"
        />
        
        <KPICard
          title="Alertes Qualité"
          value={stats?.qualityAlerts || 0}
          description="-3 vs hier"
          icon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
          iconBgColor="bg-orange-100 dark:bg-orange-900"
        />
        
        <KPICard
          title="Productivité IA"
          value={`+${stats?.productivityGain || 0}%`}
          description="vs dernière période"
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          iconBgColor="bg-purple-100 dark:bg-purple-900"
        />
      </div>

      {/* AI Plan Analysis */}
      <AIProcessing analyses={aiAnalyses} onUploadPlan={handleUploadPlan} />

      {/* AI Predictions */}
      <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-orange-600 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                Risque de Retard Détecté
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                L'IA prédit un retard de 3-5 jours sur le chantier "Résidence Les Jardins" 
                basé sur la météo et les approvisionnements.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Voir Solutions
                </Button>
                <Button size="sm" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  Ajuster Planning
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Lightbulb className="text-blue-600 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Optimisation Recommandée
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Réaffecter 2 équipes du chantier "Bureau Commercial" vers "Résidence Les Jardins" 
                pour optimiser les délais globaux.
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600 text-white">
                Gain estimé: -2 jours
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IoT Equipment & Quality Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IoT Equipment Tracking */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Suivi IoT Équipements</h2>
            <p className="text-sm text-muted-foreground">
              {iotEquipment.length} équipements connectés en temps réel
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {iotEquipment.slice(0, 3).map((equipment) => (
              <IoTDevice
                key={equipment.id}
                equipment={equipment}
                onLocate={equipment.status === "offline" ? handleLocateEquipment : undefined}
              />
            ))}
          </CardContent>
        </Card>

        {/* Computer Vision Quality Control */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Contrôle Qualité IA</h2>
            <p className="text-sm text-muted-foreground">
              Analyse automatique par Computer Vision
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {qualityChecks.slice(0, 2).map((check) => (
              <QualityCheck
                key={check.id}
                check={check}
                onCreateNonConformity={check.status === "failed" ? handleCreateNonConformity : undefined}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Interface Preview */}
      <MobilePreview />

      {/* Odoo Integration Status */}
      <OdooSync syncStatus={odooSyncStatus} onTriggerSync={handleTriggerSync} />

      {/* Predictive Analytics */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Analytics Prédictifs</h2>
          <p className="text-sm text-muted-foreground">
            Machine Learning pour optimisation et prévision des performances
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="text-white h-5 w-5" />
                </div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Prédiction Délais</h3>
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">94.7%</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Précision prédictive</p>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <p>• Analyse météorologique</p>
                  <p>• Disponibilité ressources</p>
                  <p>• Historique performances</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white h-5 w-5" />
                </div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Optimisation ROI</h3>
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">+€847K</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Économies générées</p>
                </div>
                <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <p>• Allocation optimale</p>
                  <p>• Réduction gaspillage</p>
                  <p>• Maintenance prédictive</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-white h-5 w-5" />
                </div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">Prévention Risques</h3>
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">-73%</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Incidents évités</p>
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <p>• Détection anomalies</p>
                  <p>• Alertes préventives</p>
                  <p>• Analyse comportementale</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
